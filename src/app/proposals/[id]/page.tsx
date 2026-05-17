"use client"
// import {  ProposalData } from "@/lib/api/actions";
import Image from "next/image";
// import Link from "next/link";
import PageTransitionEffect from "@/components/PageTransitionEffect";
import BackButton from "@/components/back-button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { CONSTANTS } from "@/web3/config/constants";
import { useAccount, useWriteContract } from "wagmi";
import { useConfig } from "wagmi";
import { getTransactionReceipt } from "@wagmi/core";
// import { keccak256, toUtf8Bytes } from "ethers";
import { useProposals } from "@/context/proposalsContext";
import { useParams } from "next/navigation";
import { readContract } from "@wagmi/core";
import contractabi from "@/web3/config/dao-contractabi.json";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {formatWallet, addDays, formatDate, formatNumberToLocale } from "@/lib/utils";
import STAKING_CONTRACT_ABI from "@/web3/config/abi.json";
import ProposalStatus from "@/components/proposalStatus";
import { votingOngoing } from "@/lib/utils";
import NFT_CONTRACT_ABI from "@/web3/config/nft-contract-abi.json";
import LIQUIDITY_CONTRACT_ABI from "@/web3/config/liquiditystakingabi.json";
import ImageModal from "@/components/imageModal";

export default function Page() {
  const wagmiConfig = useConfig();
  const OCICAT_SPENDER =
    CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
  const LIQUIDITY_ADDRESS = CONSTANTS.LIQUIDITY_ADDRESS as `0x${string}`;
  const NFT_CONTRACT_ADDRESS = CONSTANTS.NFT_ADDRESS as `0x${string}`;
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const { isConnected, address } = useAccount(); // Wallet connection
  const { writeContract } = useWriteContract();
  const [daoPower, setDAOPower] = useState<string | null>("");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimableReward, setClaimableReward] = useState<number>(0);
  const [totalDaoPower, setTotalDaoPower] = useState<number | null>(null);
  const [id, setId] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [proposalImage, setProposalImage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [voterInfo, setVoterInfo] = useState({
    hasVoted: false,
    hasClaimed: false,
    voterPower: BigInt(0),
    rewardOcicat: BigInt(0),
    rewardBNB: BigInt(0),
    votedSide: "",
  });
  const [proposalData, setProposalData] = useState({
    title: "",
    description: "",
    startTime: BigInt(0),
    duration: BigInt(0),
    yesPower: BigInt(0),
    noPower: BigInt(0),
    ocicatReward: BigInt(0),
    bnbReward: BigInt(0),
    totalVotes: BigInt(0),
    yesvote: BigInt(0),
    finalized: false,
    outcome: "",
  });

  // get proposals data
  async function fetchProposalData(proposalId: string) {
    try {
      const raw = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: contractabi,
        functionName: "getProposal",
        args: [proposalId],
      });

      const [
        title,
        description,
        startTime,
        duration,
        yesPower,
        noPower,
        ocicatReward,
        bnbReward,
        totalVotes,
        yesvote,
        finalized,
        outcome,
      ] = raw as [
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        boolean,
        string
      ];

      setProposalData({
        title,
        description,
        startTime,
        duration,
        yesPower,
        noPower,
        ocicatReward,
        bnbReward,
        totalVotes,
        yesvote,
        finalized,
        outcome,
      });
    } catch (error) {
      console.error("Error fetching proposal data:", error);
    }
  }
  // const { _id } = useParams();
  const params = useParams();
  // console.log("route param is :", params)
  const _id = params.id as string; // Extracting the _id parameter from the route
  const { proposals } = useProposals();
  const [creator, setCreator] = useState<string>("");
  // console.log("Route param _id is:", _id);

  useEffect(() => {
    // console.log("Proposals list:", proposals);

    if (_id && proposals?.length > 0) {
      const matchedProposal = proposals.find(
        (proposal) => String(proposal._id) === String(_id)
      );
      if (matchedProposal) {
        const rawId = matchedProposal.proposalId;
        setId(rawId);
        setProposalId(String(rawId)); 
        setCreator(matchedProposal.creator);
        setProposalImage(matchedProposal.image);
      }
    }
  }, [_id, proposals]); 


  // const proposalId =
  // typeof id === "string" ? String(id) : Array.isArray(id) && id.length > 0 ? String(id[0]) : undefined;
  //   get dao power
  async function fetchDAOPower(address: `0x${string}`) {
    if (!address) return;

    try {
      // Fetch DAO power from staking contract
      const stakingPowerBigInt = await readContract(wagmiConfig, {
        address: OCICAT_SPENDER,
        abi: STAKING_CONTRACT_ABI,
        functionName: "daoPower",
        args: [address],
      });

      // Fetch DAO power from NFT contract
      const nftPowerBigInt = await readContract(wagmiConfig, {
        address: NFT_CONTRACT_ADDRESS, // Replace with your NFT contract address
        abi: NFT_CONTRACT_ABI, // Replace with your NFT contract ABI
        functionName: "daoPower",
        args: [address],
      });

      // Fetch DAO power from Liquidity contract
      const liquidityPowerBigInt = await readContract(wagmiConfig, {
        address: LIQUIDITY_ADDRESS, // Replace with your Liquidity contract address
        abi: LIQUIDITY_CONTRACT_ABI, // Replace with your Liquidity contract ABI
        functionName: "daoPower",
        args: [address],
      });

      // Convert BigInt to Number (safe within MAX_SAFE_INTEGER)
      const stakingPower = Number(stakingPowerBigInt);
      const nftPower = Number(nftPowerBigInt);
      const liquidityPower = Number(liquidityPowerBigInt);

      const totalPower = stakingPower + nftPower + liquidityPower;
      setDAOPower(totalPower.toString());
      return totalPower;
    } catch (error) {
      console.error("Error fetching total DAO power:", error);
    }
  }

  //   get dao power required to vote

  async function fetchDaoPowerRequired() {
    try {
      const requiredPower = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: contractabi,
        functionName: "minDaoPowerToVote",
      });

      // console.log(`DAO Power Required:`, requiredPower.toString());

      return requiredPower;
    } catch (error) {
      console.error("Error fetching DAO Power Required:", error);
    }
  }

  async function fetchVoterInfo(
    proposalId: bigint,
    userAddress: `0x${string}`
  ) {
    try {
      const voterInfoRaw = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: contractabi,
        functionName: "getVoterInfo", // Adjust this if your contract uses a different name
        args: [proposalId, userAddress],
      });

      //  [hasVoted, hasClaimed, voterPower, rewardOcicat, rewardBNB]
      const [
        hasVoted,
        hasClaimed,
        voterPower,
        rewardOcicat,
        rewardBNB,
        votedSide,
      ] = voterInfoRaw as [boolean, boolean, bigint, bigint, bigint, string];

      setVoterInfo({
        hasVoted,
        hasClaimed,
        voterPower,
        rewardOcicat,
        rewardBNB,
        votedSide,
      });
    } catch (error) {
      console.error("Error fetching voter info:", error);
    }
  }

  //   set total dao power
  // check user rewards

  useEffect(() => {
    if (!totalDaoPower) {
      setTotalDaoPower(
        Number(proposalData.yesPower) + Number(proposalData.noPower)
      );
    }
   if (
     daoPower &&
     totalDaoPower &&
     (proposalData.ocicatReward || proposalData.bnbReward)
   ) {
     const participationRatio = Number(daoPower) / Number(totalDaoPower);

     const ocicatReward =
       (participationRatio * Number(proposalData.ocicatReward)) / 1e6;
     const bnbReward =
       (participationRatio * Number(proposalData.bnbReward)) / 1e18;

     const totalReward = ocicatReward + bnbReward;

     if (totalReward > 0) {
       setClaimableReward(totalReward);
     }
   }

  }, [daoPower, totalDaoPower, proposalData.ocicatReward]);


const MAX_RUNS = 3;

useEffect(() => {
  let runCount = 0;

  const interval = setInterval(() => {
    if (address && runCount < MAX_RUNS) {
      fetchDAOPower(address as `0x${string}`);
      fetchDaoPowerRequired();
      if (proposalId) {
        fetchVoterInfo(BigInt(proposalId), address as `0x${string}`);
      }
      runCount++;
    } else {
      clearInterval(interval);
    }
  }, 2000); //every 1 second

  return () => clearInterval(interval);
}, [address, proposalId]);


  useEffect(() => {
    if (!address) {
      toast.error("Please connect your wallet");
    }
    fetchProposalData(proposalId!);
  }, [id]);

  // Vote on a Proposal
  async function voteOnProposal(proposalId: string, support: boolean) {
    try {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: contractAddress,
            abi: contractabi,
            functionName: "vote",
            args: [proposalId, support],
          },
          {
            onSuccess: (txHash: `0x${string}`) => {
              toast.success("Signed successfully!");
              fetchVoterInfo(BigInt(proposalId), address as `0x${string}`);
              resolve(txHash); // Return transaction hash
            },
            onError: (error) => {
              console.error("Error submitting vote:", error);
              toast.error(`Failed to submit vote: ${error}`);
              reject(error);
            },
          }
        );
      });
    } catch (error) {
      console.error("Unexpected error submitting vote:", error);
      toast.error(`Unexpected error: ${error}`);
      return null;
    }
  }

  // Confirm Vote Transaction Receipt
  async function getVoteTransactionReceipt(
    proposalId: string,
    support: boolean
  ) {
    if (!proposalId) {
      toast.error("Proposal ID is missing.");
      return;
    }

    const txHash = await voteOnProposal(proposalId, support);

    if (!txHash) {
      console.error("Failed to retrieve vote transaction hash.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Initial delay

    let transactionReceipt;
    for (let i = 0; i < 10; i++) {
      transactionReceipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      });

      if (transactionReceipt) break;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry delay
    }

    if (!transactionReceipt) {
      console.error("Transaction receipt not found after multiple retries.");
      return;
    }

    if (transactionReceipt.status === "success") {
      toast.success("Vote confirmed!");
      fetchVoterInfo(BigInt(proposalId), address as `0x${string}`);
      fetchProposalData(proposalId!);
    } else {
      // Check for specific failure reason
      const failureLog = transactionReceipt.logs.find((log) => log.data);

      if (failureLog) {
        const failureMessage = failureLog.data.toString();

        toast.error(`Vote transaction failed: ${failureMessage}`);
      } else {
        toast.error("Vote transaction failed.");
      }
    }
  }
  // claim button functionality
  function handleClaim() {
    if (address && proposalId) {
      getClaimTransactionReceipt(String(proposalId));
    } else {
      toast.error("Please connect wallet");
    }
  }
  // Vote Button Functionality
  async function handleVote(proposalId: string, support: boolean) {
    if (address && proposalId) {
      if (votingOngoing(proposalData.startTime, proposalData.duration)) {
        const daoPower = await fetchDAOPower(address as `0x${string}`);
        const requiredDaoPower = await fetchDaoPowerRequired();
        if (daoPower && requiredDaoPower) {
          if (Number(daoPower) >= Number(requiredDaoPower)) {
            getVoteTransactionReceipt(proposalId, support);
          } else {
            toast.error("You do no have enough dao power to vote");
          }
        } else {
          toast.error("No Dao Power ,try connecting another wallet to vote");
        }
      } else {
        toast.error("voting has ended");
      }
    } else {
      toast.error("Please connect wallet to vote");
    }
  }

  // Close modal when clicking outside
  function handleModalClick(e: React.MouseEvent<HTMLDivElement>) {
    if (modalRef.current && e.target === modalRef.current) {
      setShowRewardModal(false);
    }
  }

  // open the reward modal
  function openRewardModal() {
    if (address) {
      if (voterInfo.hasVoted) {
        if (proposalData.finalized) {
          if (daoPower) {
            setShowRewardModal(true);
          } else {
            toast.error("No Dao Power");
          }
        } else {
          toast.info("Voting is pending finalizetion");
        }
      } else {
        toast.error("user did not vote");
      }
    } else {
      toast.error("connect wallet to view rewards");
    }
  }

  // claim voting rewards
  async function claimReward(proposalId: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!address) {
        toast.error("Please connect your wallet to claim rewards.");
        reject("Wallet not connected");
        return;
      }

      setClaiming(true);
      console.log("claiming");

      writeContract(
        {
          address: contractAddress,
          abi: contractabi,
          functionName: "claimReward",
          args: [proposalId],
        },
        {
          onSuccess: (txHash: `0x${string}`) => {
            toast.success("signed ");
            resolve(txHash);
            setClaiming(false);
            fetchVoterInfo(BigInt(proposalId), address as `0x${string}`);
          },
          onError: (error) => {
            console.error("Error claiming reward:", error);
            toast.error(`Failed to claim reward: ${error}`);
            setClaiming(false);
            reject(error);
          },
        }
      );
    });
  }

  // Confirm Reward Claim Transaction Receipt
  async function getClaimTransactionReceipt(proposalId: string) {
    if (!proposalId) {
      toast.error("Proposal ID is missing.");
      return;
    }

    const txHash = await claimReward(proposalId);

    if (!txHash) {
      console.error("Failed to retrieve claim transaction hash.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Initial delay

    let transactionReceipt;
    for (let i = 0; i < 10; i++) {
      transactionReceipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      });

      if (transactionReceipt) break;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Retry delay
    }

    if (!transactionReceipt) {
      console.error("Transaction receipt not found after multiple retries.");
      return;
    }

    if (transactionReceipt.status === "success") {
      toast.success("Reward claim confirmed!");
    } else {
      // Check for specific failure reason
      const failureLog = transactionReceipt.logs.find((log) => log.data);

      if (failureLog) {
        const failureMessage = failureLog.data.toString();
        toast.error(`Reward claim transaction failed: ${failureMessage}`);
      } else {
        toast.error("Reward claim transaction failed.");
      }
    }
  }

  //Finalize Proposal

  async function finalizeProposal(proposalId: string): Promise<string | null> {
    if (!isConnected) {
      toast.error("Please connect your wallet to finalize the proposal.");
      return null;
    }

    const isDue = votingOngoing(proposalData.startTime, proposalData.duration);

    if (isDue) {
      toast.info("Voting is still ongoing");

      return null;
    }

    return new Promise((resolve, reject) => {
      writeContract(
        {
          address: contractAddress,
          abi: contractabi,
          functionName: "finalize",
          args: [proposalId],
        },
        {
          onSuccess: (txHash: `0x${string}`) => {
            toast.success("Proposal finalized!");
            setTimeout(() => {
              fetchProposalData(proposalId!);
            }, 3000); // Wait 3 seconds
            resolve(txHash);
          },
          onError: (error) => {
            console.error("Error finalizing proposal:", error);
            toast.error(`Failed to finalize proposal: ${error}`);
            reject(error);
          },
        }
      );
    });
  }

  // Handle error states
  if (!proposalData) {
    return (
      <div className="flex min-h-screen justify-center items-center"></div>
    );
  }

  return (
    <PageTransitionEffect>
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
        toastClassName="!bg-[#222] !text-white rounded-lg" // Custom dark style//
      />
      <div className="flex w-full justify-start items-center px-4 sm:px-8 md:px-12 lg:px-16">
        <BackButton />
      </div>
      <div className="h-full w-full mt-8 flex justify-center items-center gap-4 text-base lg:flex-nowrap flex-wrap px-4 sm:px-8 md:px-12 lg:px-16 mb-16">
        <div className="bg-[#111111] rounded-[20px] py-10 md:px-8 px-6 w-full sm:w-[70%] lg:w-1/2 max-w-[28rem] border border-[#333333]">
          <div className="flex flex-col justify-center pb-4 items-center">
            <ImageModal
              thumbnail={proposalImage || "/cat_bg.jpg"}
              fullImage={proposalImage || "/cat_bg.jpg"}
            />

            <h2 className="text-white font-semibold text-3xl py-3">
              Ocicat DAO
            </h2>
          </div>
          <div>
            <h3 className="text-[#18e254] font-bold text-lg text-left self-start uppercase">
              {proposalData.title || (
                <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
              )}
            </h3>

            <h2 className="text-white font-bold text-base pt-2">Description</h2>
            <p className="text-base text-justify opacity-90 py-2 whitespace-pre-line">
              {proposalData.description || (
                <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
              )}
            </p>
            <div className="flex flex-col justify-start items-start gap-2 py-3">
              <span className="flex justify-start items-start gap-1">
                <h3 className="text-white font-bold text-base">
                  Total Voting reward:
                </h3>{" "}
                <div className="flex flex-col justify-start items-start gap-2">
                  <span>
                    {formatNumberToLocale(
                      (Number(proposalData.ocicatReward) / 1e6).toString()
                    ) || (
                      <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                    )}{" "}
                    Ocicat
                  </span>
                  <span className="flex justify-start items-center gap-1">
                    {formatNumberToLocale(
                      (Number(proposalData.bnbReward) / 1e18).toString()
                    ) || (
                      <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                    )}{" "}
                    BNB{" "}
                    <span className="relative flex items-center justify-center h-5 w-5 ml-1">
                      <Image
                        alt="BNB"
                        src={"/bnb-bnb-logo.png"}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                      />
                    </span>
                  </span>
                </div>
              </span>
              <span className="flex justify-start items-center gap-1">
                <h3 className="text-white font-bold text-base">
                  Your DAO Power:
                </h3>{" "}
                <span>
                  {daoPower ? (
                    daoPower
                  ) : (
                    <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                  )}
                </span>
              </span>
            </div>
          </div>
          <div className="flex pt-4 justify-center items-center w-full gap-4 font-semibold flex-wrap md:flex-nowrap">
            {voterInfo.hasVoted && !proposalData.finalized && (
              <button className="bg-[#304932] py-4 flex w-full justify-center items-center text-[#FFFFFF] rounded-[8px]">
                Vote recorded
              </button>
            )}

            {proposalData.finalized && (
              <button className="bg-[#353533] py-4 flex w-full justify-center items-center text-[#FFFFFF] rounded-[8px]">
                Vote Completed
              </button>
            )}

            {!proposalData.finalized &&
              !voterInfo.hasVoted &&
              votingOngoing(proposalData.startTime, proposalData.duration) && (
                <>
                  <button
                    className="bg-[#00B756] py-4 flex w-full justify-center items-center transition-class hover:opacity-80 cursor-pointer text-white rounded-[8px]"
                    onClick={() => handleVote(String(proposalId), true)}
                  >
                    Vote for
                  </button>
                  <button
                    className="bg-[#CF1B1B] py-4 flex w-full justify-center items-center transition-class hover:opacity-80 cursor-pointer  text-white rounded-[8px]"
                    onClick={() => handleVote(String(proposalId), false)}
                  >
                    Vote against
                  </button>
                </>
              )}
            {!proposalData.finalized &&
              !voterInfo.hasVoted &&
              !votingOngoing(proposalData.startTime, proposalData.duration) && (
                <button className="bg-[#48461E] py-4 flex w-full justify-center items-center transition-class text-white rounded-[8px]">
                  Pending approval
                </button>
              )}
          </div>
          <div className="flex justify-end items-center w-full py-2">
            <span
              className="text-[#FF2727] text-sm font-normal cursor-pointer underline w-fit"
              onClick={openRewardModal}
            >
              view reward
            </span>
          </div>
        </div>

        <div className="flex-col flex gap-3 self-start justify-start items-start sm:w-[70%] max-w-[28rem] lg:w-1/2 w-full">
          <div className="bg-[#111111] flex flex-col gap-3 px-4 py-6 w-full h-fit rounded-[15px]">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Results</h2>
              <span className="text-[#787878]">
                votes {proposalData.totalVotes}
              </span>
            </div>
            <div className="flex w-full gap-3 flex-col">
              <span className="relative transition-class bg-[#FF2727] h-2 rounded-full overflow-hidden w-full">
                <span
                  className="absolute transition-class rounded-full left-0 top-0 bg-[#00B756] h-full"
                  style={{
                    width: `${Number(
                      proposalData.yesPower + proposalData.noPower === BigInt(0)
                        ? BigInt(0)
                        : (proposalData.yesPower * BigInt(100)) /
                            (proposalData.yesPower + proposalData.noPower)
                    )}%`,
                  }}
                ></span>
              </span>
              <div className="flex flex-col gap-2 w-full items-center justify-center">
                <div className="flex justify-between items-center w-full">
                  <span className="flex justify-start items-center gap-1">
                    <span className="h-5 text-base w-5 flex bg-[#00B756] mr-1 rounded-[5px]"></span>{" "}
                    Yes
                  </span>
                  <span className="text-[#787878]">
                    {proposalData.yesPower} (
                    {Number(
                      proposalData.yesPower + proposalData.noPower === BigInt(0)
                        ? BigInt(0)
                        : (proposalData.yesPower * BigInt(100)) /
                            (proposalData.yesPower + proposalData.noPower)
                    )}
                    %)
                  </span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="flex justify-start items-center gap-1">
                    <span className="h-5 text-base w-5 flex bg-[#FF0202] mr-1 rounded-[5px]"></span>{" "}
                    No
                  </span>
                  <span className="text-[#787878]">
                    {" "}
                    {proposalData.noPower}(
                    {Number(
                      proposalData.yesPower + proposalData.noPower === BigInt(0)
                        ? BigInt(0)
                        : (proposalData.noPower * BigInt(100)) /
                            (proposalData.yesPower + proposalData.noPower)
                    )}
                    %)
                  </span>
                </div>
                <div className="flex justify-between items-center w-full mt-3">
                  <span className="flex justify-start items-center gap-1">
                    Your Vote
                  </span>
                  {voterInfo.votedSide === "NO" && voterInfo.hasVoted && (
                    <div className="flex justify-start items-center gap-1">
                      <span className="h-5 text-base w-5 flex bg-[#FF0202] mr-1 rounded-[5px]"></span>
                      <span>No</span>
                    </div>
                  )}
                  {voterInfo.votedSide === "YES" && (
                    <div className="flex justify-start items-center gap-1">
                      <span className="h-5 text-base w-5 flex bg-[#18AB44] mr-1 rounded-[5px]"></span>
                      <span>Yes</span>
                    </div>
                  )}
                  {!voterInfo.hasVoted && (
                    <div className="flex justify-start items-center gap-1">
                      <span className="h-5 text-base w-5 flex bg-[#353533] mr-1 rounded-[5px]"></span>
                      <span>Not voted</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] flex flex-col gap-3 px-4 py-6 w-full h-fit rounded-[15px]">
            <div className="flex justify-start gap-2 items-center">
              <h2 className="font-bold text-lg">Status</h2>
              <ProposalStatus proposalId={proposalId!} />
            </div>

            <div className="flex  justify-start items-start gap-1 flex-col w-full">
              <div className="flex justify-start gap-1 items-center w-full">
                <span className="text-[#787878]">Created by: </span>
                <span className="text-white">
                  {formatWallet(creator) || (
                    <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                  )}
                </span>
              </div>
              <div className="flex justify-start gap-1 items-center w-full">
                <span className="text-[#787878]">Start: </span>
                {proposalData.startTime ? (
                  <span className="text-white">
                    {
                      formatDate(
                        new Date(
                          Number(proposalData.startTime) * 1000
                        ).toISOString()
                      ).monthName
                    }{" "}
                    {
                      new Date(Number(proposalData.startTime) * 1000)
                        .toISOString()
                        .split("-")[2]
                        .split("T")[0]
                    }
                    ,{" "}
                    {
                      new Date(Number(proposalData.startTime) * 1000)
                        .toISOString()
                        .split("-")[0]
                    }{" "}
                    {" , "}
                    {new Date(
                      Number(proposalData.startTime) * 1000
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                ) : (
                  <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                )}
              </div>
              <div className="flex justify-start gap-1 items-center w-full">
                <span className="text-[#787878]">End:</span>{" "}
                <span className="text-white">
                  {proposalData.startTime ? (
                    <span className="text-white">
                      {
                        formatDate(
                          addDays(
                            proposalData.startTime,
                            Number(proposalData.duration) / (60 * 60 * 24)
                          )
                        ).monthName
                      }{" "}
                      {
                        addDays(
                          proposalData.startTime,
                          Number(proposalData.duration) / (60 * 60 * 24)
                        )
                          .split("-")[2]
                          .split("T")[0]
                      }
                      ,{" "}
                      {
                        addDays(
                          proposalData.startTime,
                          Number(proposalData.duration) / (60 * 60 * 24)
                        ).split("-")[0]
                      }{" "}
                      ,{" "}
                      {new Date(
                        (Number(proposalData.startTime) +
                          Number(proposalData.duration)) *
                          1000
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  ) : (
                    <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
                  )}
                </span>
              </div>
            </div>
          </div>
          {!proposalData.finalized && (
            <div className="flex w-full justify-center items-center">
              <button
                className="flex w-full justify-center rounded items-center bg-[#353533] py-3 text-base hover:opacity-80 transition-class font-semibold"
                onClick={() =>
                  proposalId && finalizeProposal(String(proposalId))
                }
              >
                Finalize Proposal
              </button>
            </div>
          )}

          {proposalData.finalized && (
            <div className="bg-[#111111] flex flex-col gap-3 px-4 py-6 w-full h-fit rounded-[15px]">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg ">Outcome</h2>
              </div>
              <div className="flex justify-col items-center justify-center text-lg md:text-xl font-bold">
                {proposalData.outcome === "Pending" && (
                  <>
                    {/* <span className="h-10 text-base w-10 flex bg-[#FFC227] mr-1 rounded-[5px]"></span> */}
                    <div className="bg-[#392D0D] flex items-center justify-center px-10 py-4 rounded-xl">
                      Pending
                    </div>
                  </>
                )}
                {proposalData.outcome === "No Wins" && (
                  <>
                    {/* <span className="h-10 text-base w-10 flex bg-[#FF0202] mr-1 rounded-[5px]"></span> */}
                    <div className="bg-[#390D0D] flex items-center justify-center px-10 py-4 rounded-xl">
                      No Wins
                    </div>
                  </>
                )}
                {proposalData.outcome === "Yes Wins" && (
                  <>
                    {/* <span className="h-10 text-base w-10 flex bg-[#00B756] mr-1 rounded-[5px]"></span> */}
                    <div className="bg-[#083510] flex items-center justify-center px-10 py-4 rounded-xl">
                      Yes Wins
                    </div>
                  </>
                )}
                {proposalData.outcome === "Stalemate" && (
                  <>
                    {/* <span className="h-10 text-base w-10 flex bg-[#353533] rounded-[5px]"></span> */}
                    <div className="bg-[#353533] items-center justify-center px-10 py-4 rounded-xl">
                      Stalemate
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reward Modal */}
      {showRewardModal && proposalData.finalized && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]"
          onClick={handleModalClick}
        >
          <div className="bg-[#181818] flex flex-col justify-center items-center gap-5 rounded-xl px-8 py-20 min-w-[300px] max-w-[90vw] text-white shadow-lg relative">
            <h2 className="text-[#747474] text-base">Your Reward </h2>
            <div className="sm:text-2xl text-xl font-bold mb-2 flex justify-center items-start gap-2 w-full px-4 flex-wrap md:flex-nowrap">
              <div className="flex flex-col justify-start items-start gap-2">
                <span>
                  {(proposalData.ocicatReward &&
                    daoPower &&
                    voterInfo.hasVoted &&
                    !(proposalData.outcome === "Stalemate") &&
                    proposalData.outcome === "Yes Wins" &&
                    voterInfo.votedSide === "YES" &&
                    formatNumberToLocale(
                      (
                        Number(
                          (Number(daoPower) / Number(proposalData.yesPower)) *
                            Number(proposalData.ocicatReward)
                        ) / 1e6
                      ).toString()
                    )) ||
                    (proposalData.ocicatReward &&
                      daoPower &&
                      voterInfo.hasVoted &&
                      !(proposalData.outcome === "Stalemate") &&
                      proposalData.outcome === "No Wins" &&
                      voterInfo.votedSide === "NO" &&
                      formatNumberToLocale(
                        (
                          Number(
                            (Number(daoPower) / Number(proposalData.noPower)) *
                              Number(proposalData.ocicatReward)
                          ) / 1e6
                        ).toString()
                      )) ||
                    "0"}{" "}
                  Ocicat{" "}
                </span>
                <span className="flex justify-start items-center gap-1">
                  {(proposalData.bnbReward &&
                    daoPower &&
                    voterInfo.hasVoted &&
                    Number(
                      ((Number(daoPower) / Number(totalDaoPower)) *
                        Number(proposalData.bnbReward)) /
                        1e18
                    ).toFixed(5)) ||
                    "0"}{" "}
                  BNB{" "}
                  <span className="relative flex items-center justify-center h-5 w-5 ml-1">
                    <Image
                      alt="BNB"
                      src={"/bnb-bnb-logo.png"}
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                    />
                  </span>
                </span>
              </div>
              <span className="relative flex justify-center items-center w-14 h-14">
                <Image
                  alt=" "
                  src="/cat_bg.jpg"
                  objectFit="contain"
                  layout="fill"
                  objectPosition="center"
                ></Image>
              </span>
            </div>
            <div className="flex gap-3 justify-center items-center">
              {claiming && !voterInfo.hasClaimed && (
                <button className="rounded-[4px] bg-[#FF2727] flex items-center justify-center h-12 w-36 transition-class hover:opacity-80 cursor-pointer">
                  Claiming...
                </button>
              )}
              {voterInfo.hasClaimed && (
                <button className="rounded-[4px] bg-[#353533] flex items-center justify-center h-12 w-36 transition-class hover:opacity-80 cursor-pointer">
                  Claimed
                </button>
              )}
              {!voterInfo.hasClaimed &&
                !claiming &&
                proposalData.finalized &&
                claimableReward > 0 &&
                !(proposalData.outcome === "Stalemate") && (
                  <button
                    className="rounded-[4px] bg-[#FF2727] flex items-center justify-center h-12 w-36 transition-class hover:opacity-80 cursor-pointer"
                    onClick={handleClaim}
                  >
                    Claim Rewards
                  </button>
                )}
            </div>
            <div className="flex w-full flex-col justify-center items-center self-baseline text-sm font-bold">
              {proposalData.outcome === "Yes Wins" &&
                voterInfo.votedSide === "NO" && (
                  <div className="text-sm font-bold flex items-center justify-center px-10 py-4 rounded-xl">
                    Yes voters won
                  </div>
                )}
              {proposalData.outcome === "No Wins" &&
                voterInfo.votedSide === "YES" && (
                  <div className="text-sm font-bold flex items-center justify-center px-10 py-4 rounded-xl">
                    No voters won
                  </div>
                )}

              {proposalData.outcome === "Stalemate" && (
                <div className="text-sm font-bold flex items-center justify-center px-10 py-4 rounded-xl">
                  Stalemate {"(no winners)"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageTransitionEffect>
  );
}
