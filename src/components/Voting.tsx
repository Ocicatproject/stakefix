/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useConfig } from "wagmi";

// import { CustomBotton } from "./CustomButton";
import ConnectButton from "@/context/connectbutton";
import {
  useLiquidityBalance,
  useTokenBalance,
  useStakeRewardsClaimOcicat,
  useStakeRewardsClaimLiq,
} from "@/web3/useStaking";
import { readContract } from "@wagmi/core";
import {
  useApprovalContract,
  useLiqApprovalContract,
} from "@/web3/useApproval";
import { CONSTANTS } from "@/web3/config/constants";
import tokenabi from "@/web3/config/token_abi.json";
import { convertFromFloat, convertToFloat } from "@/lib/utils";
// token contract addresses and abis
const TOKEN_ABI = tokenabi;
const OCICAT_TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const OCICAT_SPENDER =
  CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const BNBLIQ_SPENDER = CONSTANTS.LIQUIDITY_ADDRESS as `0x${string}`;
import STAKING_CONTRACT_ABI from "@/web3/config/abi.json";
// import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/liquiditystakingabi.json";
import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/liquiditystakingabi.json";
import liqtokenabi from "@/web3/config/liquidity-token-abi.json";
import { useEffect } from "react";
import NFT_CONTRACT_ABI from "@/web3/config/nft-contract-abi.json";

const LIQ_TOKEN_ADDRESS = CONSTANTS.LIQUIDITY_TOKEN as `0x${string}`;




// component switches between different contexts, stake, unstake and claim





const TextSwitch = ({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (option: string) => void;
}) => (
  <div className="flex space-x-4 mb-4">
    {options.map((option) => (
      <button
        key={option}
        className={`text-sm font-medium ${
          active === option
            ? "text-red-500 border-b-2 border-red-500"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
);

// this component reads the cointype and displays content that allwos users to stake. unstake, read their current balance etc.
const StakingContent = ({
  coinType,
}: // balance,
{
  coinType: string;
  // balance: string | number;
}) => {
  const [stakeAction, setStakeAction] = useState("Stake");
  const { isConnected, address } = useAccount();
  const tokenBalance = useTokenBalance(address!);
  // const { data } = useBalance({
  //   address: address!,
  //   chainId: 56, // Binance Smart Chain Mainnet
  // });
  const liquidityBalance = useLiquidityBalance(address!);
  // console.log("liquidityBalance:", liquidityBalance);
  const claimAmount = useStakeRewardsClaimOcicat(address!);
  const claimLiqAmount = useStakeRewardsClaimLiq(address!);
  // console.log("Claim amount:", claimAmount);
  const [number, setNumber] = useState("");
  const { writeContract } = useWriteContract();
  const { data: cooldownStatus } = useReadContract({
  address:
    coinType === "OCICAT"
      ? OCICAT_SPENDER
      : BNBLIQ_SPENDER,
  abi:
    coinType === "OCICAT"
      ? STAKING_CONTRACT_ABI
      : STAKING_LIQ_CONTRACT_ABI,
  functionName: "getCooldownStatus",
  args: [address],
  query: {
    enabled: !!address,
    refetchInterval: 5000,
  },
});

const status = cooldownStatus?.toString().trim();

  //read amount staked of wallet (OCICAT)
  const {
    data: userStakes,
  }: {
    data:
      | [
          {
            [key: string]: any;
          }
        ]
      | undefined;
  } = useReadContract({
    address: OCICAT_SPENDER,
    abi: STAKING_CONTRACT_ABI,
    functionName: "totalUserStaked",
    args: [address],
    query: {
      enabled: true,
    },
  });


  // cooldown info
  
  // const [stakeAmount, setStakeAmount] = useState(0);
  // // console.log(userStakes)
  // if (userStakes) {
  //     setStakeAmount(convertToFloat(Number(userStakes), 6));
  // }
  const [daoPower, setDAOPower] = useState<string | null>("");
    const wagmiConfig = useConfig();
    const NFT_CONTRACT_ADDRESS = CONSTANTS.NFT_ADDRESS as `0x${string}`;

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
        address: NFT_CONTRACT_ADDRESS, 
        abi: NFT_CONTRACT_ABI,
        functionName: "daoPower",
        args: [address],
      });

      // Fetch DAO power from Liquidity contract
      const liquidityPowerBigInt = await readContract(wagmiConfig, {
        address: BNBLIQ_SPENDER,
        abi: STAKING_LIQ_CONTRACT_ABI,
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
  useEffect(() => {
    if (address) {
      fetchDAOPower(address);
    }
  }, [address]);
  //   const { data: stakedAmount } = useReadContract({
  //     address: OCICAT_SPENDER,
  //     abi: STAKING_CONTRACT_ABI,
  //     functionName: "totalStaked",
  //     query: {
  //       enabled: true,
  //     },
  //   });
  // console.log("staked amount:", stakedAmount);
  //read amount staked of wallet (OCICAT/BNB)45
  const { data: liqStakeAmount } = useReadContract({
    address: BNBLIQ_SPENDER,
    abi: STAKING_LIQ_CONTRACT_ABI,
    functionName: "totalUserStaked",
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  // console.log("Liquidity stake amount:", liqStakeAmount);

  const [loading, setLoading] = useState(false);

  //REad allowance of wallet conidtion to read based on what coin is active
  const {
    allowance,

    // writeApprovalContract
  } = useApprovalContract(
    address!,
    // coinType === "OCICAT" ? OCICAT_SPENDER : BNBLIQ_SPENDER
    OCICAT_SPENDER
  );
  // // console.log(max_allowance);

  const {
    allowance: liqallowance,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    max_allowance: liq_max_allowance,
    writeApprovalContract: writeLiqApprovalContract,
  } = useLiqApprovalContract(
    address!,
    coinType === "OCICAT" ? OCICAT_SPENDER : BNBLIQ_SPENDER
  );
  // console.log(liqallowance);
  //handle change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };

  return (
    <div className="">
      {/* Text switch component */}
      <div className="flex justify-between gap-3 items-center">
        <div className="flex justify-start items-center gap-3 mb-3 sm:gap-4">
          <span className="text-base sm:text-lg">Your DAO Power:</span>
          <span className="text-xl sm:text-2xl font-bold">
            {daoPower ? daoPower : "0"}
          </span>
        </div>
        <ConnectButton />
      </div>
      <TextSwitch
        options={["Stake", "Unstake", "Claim", "Emergency"]}
        active={stakeAction}
        onChange={setStakeAction}
      />

      {stakeAction === "Claim" && (
        // if stake action is currently claim
        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg">Your Rewards:</span>
          <span className="text-2xl font-bold">
            {coinType === "OCICAT"
              ? claimAmount
                ? claimAmount.toString()
                : "0"
              : claimLiqAmount
              ? claimLiqAmount.toString()
              : "0"}{" "}
            {coinType}
          </span>
          <Button
            className="w-full bg-red-700 hover:bg-red-800"
            size="lg"
            disabled={
              Number(coinType === "OCICAT" ? claimAmount : claimLiqAmount) <= 0
            }
            onClick={async () => {
              setLoading(true);
              const contractAddress =
                coinType === "OCICAT" ? OCICAT_SPENDER : BNBLIQ_SPENDER;
              const contractAbi =
                coinType === "OCICAT"
                  ? STAKING_CONTRACT_ABI
                  : STAKING_LIQ_CONTRACT_ABI;
              const amountToClaim =
                coinType === "OCICAT" ? claimAmount : claimLiqAmount;

              if (Number(amountToClaim) <= 0) {
                alert("You don't have any rewards to claim");
                setLoading(false);
                return;
              }

              writeContract(
                {
                  address: contractAddress,
                  abi: contractAbi,
                  functionName: "claimRewards",
                },
                {
                  onSuccess(data) {
                    console.log(data);
                    setLoading(false);
                  },
                  onError(err) {
                    console.error(err);
                    setLoading(false);
                  },
                }
              );
            }}
          >
            {loading ? "Claiming..." : "Claim Rewards"}
          </Button>
        </div>
      )}
      <>
        {/* regular component with stake, unstake */}
        {stakeAction !== "Claim" && (
          <div className="flex items-center justify-between">
            <span>
              {stakeAction === "Stake"
                ? "Available to stake:"
                : "Staked balance:"}
            </span>
            <div className="flex items-center gap-2">
              <span>
                {stakeAction === "Stake"
                  ? coinType === "OCICAT"
                    ? tokenBalance
                      ? Number(tokenBalance).toFixed(2).toString()
                      : 0
                    : liquidityBalance
                    ? Number(liquidityBalance).toFixed(4).toString()
                    : 0
                  : coinType === "OCICAT"
                  ? Number(
                      parseInt(
                        convertToFloat(Number(userStakes || 0), 6).toString(),
                        10
                      ) *
                        (95 / 100)
                    ).toString() || 0
                  : convertToFloat(Number(liqStakeAmount), 18) || 0}
              </span>
              {/* button to stake max available token */}
              {/* {stakeAction === "Unstake" && (
              <Button
                onClick={() => {
                  if (coinType === "OCICAT") {
                    setNumber((Number(stakeAmount) / 1000000).toString());
                  } else {
                    setNumber(Number(liqStakeAmount) / (1 * Math.pow(10, 18)));
                  }
                }}
                disabled={!isConnected}
                variant="destructive"
                size="sm"
              >
                Max
              </Button>
            )} */}
            </div>
          </div>
        )}
        {/* input field */}
        {stakeAction === "Stake" && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="0.00"
              value={number}
              className="bg-white text-black text-xl h-10 overflow-hidden w-full rounded-md px-2 my-2"
              onChange={handleChange}
            ></input>
            <Button
              onClick={() => {
                if (coinType === "OCICAT") {
                  if (tokenBalance) {
                    setNumber(Math.floor(Number(tokenBalance)).toString());
                  } else {
                    setNumber("0");
                  }
                } else {
                  setNumber(liquidityBalance.toString() || "0");
                }
              }}
              disabled={!isConnected}
              variant="destructive"
              size="sm"
            >
              Max
            </Button>
          </div>
        )}
      </>
      {/* if wallet is connected, check for allowance, else show connnect button. If there is allowance show stake/unstake button. If none, show allowance button */}
      {isConnected ? (
        <>
          {(coinType === "OCICAT" && !isNaN(allowance) && allowance !== 0) ||
          (coinType !== "OCICAT" && !isNaN(liqallowance) && liqallowance !== 0)
            ? stakeAction !== "Claim" &&
              stakeAction !== "Emergency" &&
              stakeAction !== "Unstake" && (
                // stake/unstake button
                <Button
                  className={`w-full bg-red-700 ${
                    stakeAction === "Stake"
                      ? " hover:bg-red-700"
                      : " hover:bg-red-700"
                  }`}
                   size="lg"
                   disabled={
                  !isConnected || status?.includes("Cooldown")
                  }
                onClick={async () => {
                  // console.log("staking amount  : " ,convertFromFloat(Number(parseFloat(number)), 18));
                    // console.log(Number(number));
                    if (Number(number) <= 0) return;
                    setLoading(true);
                    if (stakeAction === "Stake") {
                      writeContract(
                        {
                          address:
                            coinType === "OCICAT"
                              ? OCICAT_SPENDER
                              : BNBLIQ_SPENDER,
                          abi:
                            coinType === "OCICAT"
                              ? STAKING_CONTRACT_ABI
                              : STAKING_LIQ_CONTRACT_ABI,
                          functionName: "stake",
                          args: [
                            coinType === "OCICAT"
                              ? convertFromFloat(
                                  Number(parseFloat(number).toFixed(0)),
                                  6
                                )
                              : convertFromFloat(
                                  Number(parseFloat(number)),
                                  18
                                ),
                          ], // Replace with user input
                        },
                        {
                          onSuccess(data) {
                            console.log(data);
                            setLoading(false);
                          },
                          onError() {
                            setLoading(false);
                          },
                        }
                      );
                    } else {
                      writeContract(
                        {
                          address:
                            coinType === "OCICAT"
                              ? OCICAT_SPENDER
                              : BNBLIQ_SPENDER,
                          abi:
                            coinType === "OCICAT"
                              ? STAKING_CONTRACT_ABI
                              : STAKING_LIQ_CONTRACT_ABI,
                          functionName: "unstake",
                        },
                        
                          
                        
                      );
                    }
                  }}
                >
                  {loading
                    ? stakeAction === "Stake"
                      ? "Staking...."
                      : "Unstaking...."
                    : status?.includes("Cooldown")
                     ? "Cooldown Active"
                    : stakeAction}
                </Button>
              )
            : // getting allowance button
              stakeAction === "Stake" && (
                <Button
                  className={`w-full bg-red-700 ${
                    stakeAction === "Stake"
                      ? " hover:bg-red-700"
                      : " hover:bg-red-700"
                  }`}
                  size="lg"
                  onClick={async () => {
                    //hello
                    if (coinType === "OCICAT") {
                      // console.log('here');
                      // console.log(convertFromFloat(stakeAmount || 1_000_000_000_000, 6))
                      writeContract({
                        abi: TOKEN_ABI,
                        address: OCICAT_TOKEN_ADDRESS,
                        functionName: "approve",
                        args: [
                          // coinType === "OCICAT" ? OCICAT_SPENDER : BNBLIQ_SPENDER,
                          OCICAT_SPENDER,
                          convertFromFloat(
                            convertToFloat(Number(userStakes || 0), 6) ||
                              10_000_000_000_000,
                            6
                          ),
                        ],
                      });
                    } else {
                      await writeLiqApprovalContract({
                        abi: liqtokenabi,
                        address: LIQ_TOKEN_ADDRESS,
                        functionName: "approve",
                        args: [BNBLIQ_SPENDER, 1e30], // Set a high allowance
                      });
                    }
                  }}
                >
                  Approve
                </Button>
              )}
              
         
  



      {stakeAction === "Unstake" && (
  <>
    {status?.includes("Ready") ? (
      <Button
        className="w-full bg-green-600 hover:bg-green-700 mt-2"
        onClick={() => {
          setLoading(true);

          writeContract(
            {
              address:
                coinType === "OCICAT"
                  ? OCICAT_SPENDER
                  : BNBLIQ_SPENDER,
              abi:
                coinType === "OCICAT"
                  ? STAKING_CONTRACT_ABI
                  : STAKING_LIQ_CONTRACT_ABI,
              functionName: "withdrawAfterCooldown",
            },
            {
              onSuccess(data) {
                console.log(data);
                setLoading(false);
              },
              onError() {
                setLoading(false);
              },
            }
          );
        }}
      >
        {loading ? "Withdrawing..." : "Withdraw"}
      </Button>
    ) : status?.includes("Cooldown") ? (
      <Button
        disabled
        className="w-full bg-red-600 hover:bg-red-600 mt-2 opacity-100"
      >
        Cooldown On
      </Button>
    ) : (
      <Button
        className="w-full bg-red-600 hover:bg-red-700 mt-2"
        onClick={() => {
          setLoading(true);

          writeContract(
            {
              address:
                coinType === "OCICAT"
                  ? OCICAT_SPENDER
                  : BNBLIQ_SPENDER,
              abi:
                coinType === "OCICAT"
                  ? STAKING_CONTRACT_ABI
                  : STAKING_LIQ_CONTRACT_ABI,
              functionName: "unstake",
            },
            {
              onSuccess(data) {
                console.log(data);
                setLoading(false);
              },
              onError() {
                setLoading(false);
              },
            }
          );
        }}
      >
        {loading ? "Starting Cooldown..." : "Start Cooldown"}
      </Button>
    )}
  </>
)}
    
  


          {stakeAction === "Claim" &&
            (Number(claimAmount) <= 0 ? (
              <div className="text-center text-sm text-gray-400">
                No rewards to claim
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400">
                Claim your rewards
              </div>
            ))}
        </>
      ) : (
        ""
        // <CustomBotton className="w-full" />
      )}
      {stakeAction === "Emergency" && (
        <Button
          className="w-full bg-red-700 hover:bg-red-700"
          size="lg"
          disabled={
            isNaN(
              Number(
                convertToFloat(
                  parseInt(
                    convertToFloat(Number(userStakes || 0), 6).toString(),
                    10
                  ),
                  6
                )
              )
            ) ||
            Number(
              convertToFloat(
                parseInt(
                  convertToFloat(Number(userStakes || 0), 6).toString(),
                  10
                ),
                6
              )
            ) <= 0
          }
          onClick={async () => {
            if (
              Number(
                convertToFloat(
                  parseInt(
                    convertToFloat(Number(userStakes || 0), 6).toString(),
                    10
                  ),
                  6
                )
              ) <= 0 ||
              isNaN(
                Number(
                  convertToFloat(
                    parseInt(
                      convertToFloat(Number(userStakes || 0), 6).toString(),
                      10
                    ),
                    6
                  )
                )
              )
            )
              return;
            setLoading(true);
            writeContract(
              {
                address:
                  coinType === "OCICAT" ? OCICAT_SPENDER : BNBLIQ_SPENDER,
                abi:
                  coinType === "OCICAT"
                    ? STAKING_CONTRACT_ABI
                    : STAKING_LIQ_CONTRACT_ABI,
                functionName: "emergencyUnstake",
              },
              {
                onSuccess(data) {
                  console.log(data);
                  setLoading(false);
                },
                onError() {
                  setLoading(false);
                },
              }
            );
          }}
        >
          {loading ? "Unstaking...." : "Emergency Unstake"}
        </Button>
      )}
    </div>
  );
};
const Voting = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("coinA");

  // console.log(stakeAmount as string);
  // console.log(tokenBalance);

  return (
    <Card className="w-full max-w-3xl sm:px-4 mx-auto bg-[#0a0b14] text-white">
      <CardHeader>
        <Tabs
          defaultValue="coinA"
          className="w-full "
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md transition"
              value="coinA"
            >
              Stake Ocicat.
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md transition"
              value="coinB"
            >
              Stake Ocicat/BNB
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coinA" className="mt-4">
            <StakingContent coinType="OCICAT" />
          </TabsContent>

          <TabsContent value="coinB" className="mt-4">
            <StakingContent coinType="OCICAT/BNB" />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default Voting;
