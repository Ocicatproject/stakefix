"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { getTransactionReceipt } from "@wagmi/core";
import { useState, useEffect, useRef} from "react";
import Image from "next/image";
import { keccak256, toUtf8Bytes } from "ethers";
import { CreateProposal } from "@/lib/api/actions";
import contractabi from "@/web3/config/dao-contractabi.json";
import { CONSTANTS } from "@/web3/config/constants";
import {
  useAccount,
  useWriteContract,
} from "wagmi";
import { readContract } from "@wagmi/core";

import { useConfig } from "wagmi";
import { useRouter } from "next/navigation";
import { useProposals } from "@/context/proposalsContext";
import { formatAPIDate } from "@/lib/utils";
import VotesNumber from "@/components/votesNumber";
import ProposalStatus from "./proposalStatus";
import VoteProgressBar from "./VoteProgressBar";
import ProposalEndDateDisplay from "./ProposalEndDateDisplay";


function Proposals() {
  const router = useRouter();
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const adminAddress = CONSTANTS.OCICAT_DAO_ADMIN_ADDRESS as `0x${string}`;
  const { isConnected, address } = useAccount(); // Wallet connection
  const { writeContract } = useWriteContract();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [active, setActive] = useState("");
  const [ocicatReward, setOcicatReward] = useState<number | "">("");
  const [bnbReward, setBnbReward] = useState<number | "">("");
  const [isCoAdmin, setIsCoAdmin] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const previewUrl = selectedFile
     ? URL.createObjectURL(selectedFile)
     : "/cat_bg.jpg";


  // get proposals data
  const { proposals, fetchProposals } = useProposals();

  // proposal search filter
  const [searchTerm, setSearchTerm] = useState("");

 const triggerFileInput = () => {
   fileInputRef.current?.click();
 };
 
  
  async function fetchIsCoAdmin(address: `0x${string}`): Promise<boolean> {
    try {
      const result = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: contractabi,
        functionName: "isCoAdmin",
        args: [address],
      });
      if (result) { 
        setIsCoAdmin(true);
      }
      return Boolean(result);
    } catch (error) {
      console.error("Error reading isCoAdmin:", error);
      return false;
    }
  }
  useEffect(() => {
    if (address) {
      fetchIsCoAdmin(address as `0x${string}`);
    }
  },[address, isConnected]);
  

  // Create proposal on contract
  async function createProposalOnContract() {
    setLoadingSubmit(true);

    if (!isConnected && !address) {
      toast.error("Please connect your wallet first.");
      setLoadingSubmit(false);
      return null; // Return null if wallet isn't connected
    }

    try {
      // console.log("Executing createProposal...");

      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: contractAddress,
            abi: contractabi,
            functionName: "createProposal",
            args: [
              title,
              description,
              BigInt(Number(ocicatReward) * 1000000),
              BigInt(Number(bnbReward) * 1e18),
            ],
          },
          {
            onSuccess: (txHash: `0x${string}`) => {
              // console.log("Transaction Hash:", txHash);
              resolve(txHash); // return hash
            },
            onError: (error) => {
              console.error("Error creating proposal:", error);
              toast.error(`Failed to create proposal: ${error}`);
              setLoadingSubmit(false);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Unexpected error creating proposal:", error);
      toast.error(`Unexpected error: ${error}`);
      setLoadingSubmit(false);
      return null;
    }
  }

  // Get transaction reciept and extract proposal ID
  async function getProposalIdFromTxReceipt() {
    const txHash = await createProposalOnContract();

    if (!txHash) {
      console.error("Failed to retrieve transaction hash.");
      return;
    }

    // console.log("Waiting 3 seconds before checking transaction receipt...");
    await new Promise((resolve) => setTimeout(resolve, 3000)); //  Initial delay

    let transactionReceipt;
    for (let i = 0; i < 10; i++) {
      // Retry up to 10 times
      transactionReceipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      });

      if (transactionReceipt) break; //  Exit loop if receipt is found
      // console.log(`Attempt ${i + 1}: Waiting for transaction receipt...`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); //  Wait 2 sec before retrying
    }

    if (!transactionReceipt) {
      // console.error("Transaction receipt not found after multiple retries.");
      return;
    }

    // Extract Proposal ID from transaction logs
    const eventSignature = "ProposalCreated(uint256,string,address)";
    const topicHash = keccak256(toUtf8Bytes(eventSignature));

    const proposalEvent = transactionReceipt.logs?.find(
      (log) => log.topics && log.topics[0] === topicHash
    );

    if (proposalEvent && proposalEvent.topics?.[1]) {
      const proposalId = BigInt(proposalEvent.topics[1]).toString();
      // console.log("Extracted Proposal ID:", proposalId);
      return proposalId;
    }

    console.error("Proposal ID not found in transaction logs.");
  }

  // Send proposal data to API

 async function sendProposalToAPI(file?: File) {
   setLoadingSubmit(true);

   if (!address) {
     toast.error("Please connect wallet to create proposal");
     setLoadingSubmit(false);
     return;
   }

   try {
     // ⏳ Step 1: Try uploading image if present
     const uploadImageAndGetIPFSUrl = async () => {
       if (!file) return "/cat_bg.jpg"; // 🎯 Use default if no file
       const data = new FormData();
       data.append("file", file);

       const res = await fetch("/api/upload", {
         method: "POST",
         body: data,
       });

       const result = await res.json();
       return result.ipfsUrl ?? "/cat_bg.jpg"; // fallback
     };

     const ipfsUrl = await uploadImageAndGetIPFSUrl();

     // ⏳ Step 2: Get proposal ID
     const proposalId = await getProposalIdFromTxReceipt();
     if (!proposalId) {
       toast.error("Failed to retrieve proposal ID from transaction receipt.");
       setLoadingSubmit(false);
       return;
     }

     // ⏳ Step 3: Build data and send to API
     const data = {
       title,
       image: ipfsUrl,
       distributionAmount: Number(ocicatReward),
       description,
       creator: address ?? "",
       proposalId,
       createdDate: new Date().toISOString(),
     };

     const response = await CreateProposal(data);

     if (response?.success) {
       setLoadingSubmit(false);
       setShowModal(false);
       toast.success("Proposal successfully recorded!");
       fetchProposals();
     } else {
       toast.error("Proposal creation failed. Please try again.");
       console.log("Proposal creation failed.");
     }
   } catch (error) {
     toast.error(
       `API request error: ${
         error instanceof Error ? error.message : String(error)
       }`
     );
     console.error("API request error:", error);
   } finally {
     setLoadingSubmit(false);
   }
 }


  function validateInput() {
    if (!title || !description ) {
      toast.error("Please fill in all fields before submitting.");
      setLoadingSubmit(false); // Reset loading state
      return;
    } else {
      if ( address) {
sendProposalToAPI(selectedFile ?? undefined);
      }
    }
  }


  const tableHeadings = ["Title", "Voted", "Status", "Result", "Start", "End"];
  const proposalNav = [
    `Proposals (${proposals.length})`,
   
  ];

  useEffect(() => {
    if (proposals) {
      setActive(proposalNav[0]);
    }
  }, [proposals]);


  function handleProposalNavClick(index: number) {
    const activeNavLink = proposalNav[index];
    setActive(activeNavLink);
  }

  



  // Filter proposals based on search term
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // || proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    // If "Failed" nav is active, show nothing (empty list)
    if (active === "Failed") return false;

    // If "Successful" or "Proposals" nav is active, show all matching proposals
    return matchesSearch;
  });

  return (
    <div className="flex w-full 2xl:w-[80%] mx-auto pb-3 flex-col justify-start items-start bg-[#121212] rounded-xl show max-h-screen overflow-y-auto relative">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Enable dark mode
        toastClassName="!bg-[#222] !text-white rounded-lg" // Custom dark style
      />
      <div className="fixed scroll-gradient md:hidden w-6 h-full right-0 top-0"></div>
      {/*proposals heading and nav */}
      <div className="flex flex-col pb-3 pt-6 sm:py-0 sm:flex-row w-full justify-between items-start sm:items-center sm:gap-16 gap-2 text-white px-4 sm:px-8 sticky top-0 left-0 bg-[#121212] z-[1000]">
        <h2 className="font-extrabold flex items-center justify-start text-xl sm:text-3xl py-3 sm:py-5 min-w-40 sm:min-w-56">
          DAO Proposals
        </h2>
        <div className="lg:flex w-[70%] items-center justify-center font-extrabold text-sm hidden gap-8">
          {proposalNav.map((navLink, index) => (
            <button
              key={index}
              onClick={() => handleProposalNavClick(index)}
              className={`relative py-1 flex w-fit flex-nowrap ${
                active === proposalNav[index] ? " text-[#FF2727]" : ""
              }`}
            >
              {navLink}
            </button>
          ))}
        </div>
        <div className="flex flex-row-reverse sm:flex-row w-full justify-center items-center gap-3">
          <div className="flex justify-center items-center gap-2 h-12 min-w-32 bg-[#222222] rounded-[7px] py-3 px-5 text-xs w-full">
            <input
              className="flex h-full w-full bg-transparent text-[#787878]"
              type="text"
              placeholder="Search proposals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="relative flex justify-center items-center h-3 w-3 cursor-pointer">
              <Image
                alt="Search Icon"
                src="/Search_Icons_UIA.png"
                objectFit="contain"
                objectPosition="center"
                layout="fill"
              ></Image>
            </span>
          </div>
          <button
            className="text-white flex justify-center items-center bg-[#FF2727] py-3 px-5 font-extrabold text-sm w-fit text-nowrap rounded-[7px]"
            onClick={() => {
              if (!address) {
                toast.error(
                  "Please connect your wallet before creating a proposal."
                );
                return;
              }
              if (!isCoAdmin) {
                if (address !== adminAddress) {
                  toast.info("Only admins can create proposals");
                  return;
                }
              }
              setShowModal(true);
            }}
          >
            Create Proposal
          </button>
        </div>
      </div>

      {/* proposals table */}

      <table className="w-full border-transparent">
        <thead className="w-full sticky z-[1000] top-[8.5rem] sm:top-[4.5rem] left-0">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="first:px-4 pr-4 sm:first:px-8 sm:pr-8 py-4 text-left font-normal text-base"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {/* Proposals List */}

          {filteredProposals.reverse().map((proposal, index) => (
            <tr
              key={index}
              className="border-b border-b-[#222222] cursor-pointer hover:bg-[#222222] transition-class w-full"
              onClick={() => {
                router.push(`/proposals/${proposal._id}`);
              }}
            >
              <td className="px-4 sm:px-8 border-1 border-transparent max-w-80">
                <div className="flex h-10 flex-col justify-start items-start min-w-52">
                  <div className="font-extrabold text-sm">
                    {" "}
                    {proposal.title}
                  </div>
                  <div className="text-[#414141] font-extrabold text-xs truncate max-w-full">
                    {proposal.description}
                  </div>
                </div>
              </td>
              <td className="pl-4 text-center py-2 font-semibold text-sm">
                <VotesNumber proposalId={proposal.proposalId} />
              </td>

              <td className="text-center pr-4 sm:pr-8 py-2 font-semibold text-sm">
                <div className="flex justify-start items-center w-32">
                  <ProposalStatus proposalId={proposal.proposalId} />
                </div>
              </td>

              <td className="text-center pr-4 sm:pr-8 py-2 flex justify-start items-center font-semibold text-sm">
                <VoteProgressBar proposalId={proposal.proposalId} />
              </td>

              <td className="text-center pr-4 sm:pr-8 py-2 font-semibold text-sm">
                <div className="flex h-10 py-3 flex-col justify-start items-start w-full min-w-40">
                  <div className="font-extrabold text-sm">
                    {formatAPIDate(proposal.createdDate).date}
                  </div>
                  <div className="text-[#414141] font-extrabold text-xs">
                    {formatAPIDate(proposal.createdDate).time}
                  </div>
                </div>
              </td>

              <td className="text-center py-2 font-semibold text-sm">
                <ProposalEndDateDisplay proposalId={proposal.proposalId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Component */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[1000] justify-center backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#111111] rounded-[20px] p-6 w-[90%] sm:w-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center">
              <span
                className="text-[#FF2727] cursor-pointer font-medium text-base underline"
                onClick={() => setShowModal(false)}
              >
                Back
              </span>
            </div>
            <div
              className="flex w-fit cursor-pointer px-4 mx-auto flex-col justify-center items-center relative"
              onClick={triggerFileInput}
            >
              <input
                type="file"
                accept="image/*"
                aria-label="Upload image"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
                ref={fileInputRef}
                className="hidden"
              />

              <span className="relative flex justify-center items-center w-20 h-20">
                <Image
                  alt=" "
                  src={previewUrl}
                  objectFit="contain"
                  layout="fill"
                  objectPosition="center"
                ></Image>
              </span>
              <h2 className="text-white font-semibold text-3xl">Ocicat</h2>
              <span className="bg-gray-700 rounded-full py-1 px-3 absolute -top-4 -right-8 cursor-pointer text-sm">
                Upload Icon
              </span>
            </div>
            <div className="py-3 font-medium text-sm">
              <h2 className="text-center text-[#FF2727] text-xl font-extrabold mb-4">
                Create new Proposal
              </h2>

              <div className="flex flex-col gap-2 py-3">
                <label className="text-white font-bold text-xs" htmlFor="title">
                  Proposal Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g proposal title"
                  required
                  className="w-full p-2 border border-[#222222] bg-[#111111] text-white rounded"
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label
                  className="text-white font-bold text-xs"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  placeholder="e.g proposal description"
                  className="w-full h-20 p-2 border border-[#222222] bg-[#111111] text-white rounded"
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label
                  className="text-white font-bold text-xs"
                  htmlFor="distributionAmount"
                >
                  Voting reward
                </label>
                <div
                  id="distributionAmount"
                  className="w-full h-fit flex flex-col items-center justify-start gap-4 sm:gap-8 p-2 border border-[#222222] bg-[#111111] text-white rounded"
                >
                  <label className="flex items-center gap-2 w-full">
                    <span>OCICAT:</span>
                    <input
                      type="number"
                      inputMode="decimal" // helps on mobile keyboards
                      pattern="[0-9]*"
                      value={ocicatReward}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOcicatReward(val === "" ? "" : Number(val));
                      }}
                      placeholder="e.g 100000 OCICAT"
                      className="w-full bg-transparent text-white border-none focus:outline-none"
                    />
                  </label>
                  <label className="flex items-center gap-2 w-full">
                    <span>BNB:</span>
                    <input
                      type="number"
                      inputMode="decimal" // helps on mobile keyboards
                      pattern="[0-9]*"
                      value={bnbReward}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBnbReward(val === "" ? "" : Number(val));
                      }}
                      placeholder=" e.g 0.02 BNB"
                      className="w-full bg-transparent text-white border-none focus:outline-none"
                    />
                    <span className="relative flex items-center justify-center h-5 w-5 ml-1">
                      <Image
                        alt="BNB"
                        src={"/bnb-bnb-logo.png"}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                      />
                    </span>
                  </label>
                </div>
              </div>

              <button
                className="bg-[#FF2727] text-white py-2 px-4 rounded mt-2 w-full flex justify-center items-center"
                onClick={() => {
                  setLoadingSubmit(true);
                  validateInput();
                }}
                disabled={loadingSubmit} // Disable button while loading
              >
                {loadingSubmit ? (
                  <span className="loader w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Submit Proposal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Proposals;


