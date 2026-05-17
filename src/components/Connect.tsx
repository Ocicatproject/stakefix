"use client";
import React from "react";
import { useState, useEffect } from "react";
// import Image from "next/image";
import { useReadContract, useAccount } from "wagmi";
import { CONSTANTS } from "@/web3/config/constants";
import tokenabi from "@/web3/config/token_abi.json";
import daoContractAbi from "@/web3/config/dao-contractabi.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TOKEN_ABI = tokenabi;
const OCICAT_TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const OCICAT_SPENDER =
  CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const OCICAT_DAO_ADDRESS = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
// const BNBLIQ_SPENDER = CONSTANTS.LIQUIDITY_STAKING_ADDRESS as `0x${string}`;
import STAKING_CONTRACT_ABI from "@/web3/config/abi.json";
import { 
  // convertFromFloat,
  convertToFloat,formatNumberToLocale
} from "@/lib/utils";
// import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/liquiditystakingabi.json";
// import liqtokenabi from "@/web3/config/liquidityabi.json";
// const LIQ_TOKEN_ADDRESS = CONSTANTS.LIQUIDITY_TOKEN_ADDRESS as `0x${string}`;
function Connect() {
  const { data: stakedAmount } = useReadContract({
    address: OCICAT_SPENDER,
    abi: STAKING_CONTRACT_ABI,
    functionName: "totalStaked",
  });

  const { data: totalSupply } = useReadContract({
    address: OCICAT_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
  });
  const { data: totalRewardsPaid } = useReadContract({
    address: OCICAT_DAO_ADDRESS,
    abi: daoContractAbi,
    functionName: "totalRewardsPaid",
  });


  const {  address } = useAccount(); // Wallet connection

  type PeriodKey = "24 hr" | "Week" | "Month" | "Year";
  const [calculatorIsOpen, setCalculatorIsOpen] = useState(false);
  const [rewardPerMinute, setRewardPerMinute] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [reward, setReward] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("24 hr");
  
  const circulatingSupply = "335050000000165";
  const totalStakedInMillions =
    typeof stakedAmount === "number"
      ? stakedAmount / 1e6
      : stakedAmount
      ? Number(stakedAmount) / 1e6
      : 0;



      const stakingStartDate = new Date("2025-05-02");
      const today = new Date();

      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const daysStaked = Math.floor(
        (today.getTime() - stakingStartDate.getTime()) / millisecondsPerDay
      );

      // More modest base reward and growth model
      const baseDailyReward = 1440; // daily base reward
      const maxMultiplier = 2; // cap total multiplier
      const growthRate = 0.0015; // 0.15% daily growth
      const multiplier = Math.min(1 + growthRate * daysStaked, maxMultiplier);

      const rewardPerUnitToday = baseDailyReward * multiplier;


      const totalEstimatedRewards =
        totalStakedInMillions * rewardPerUnitToday * daysStaked;

      const totalWithPaid =
        totalEstimatedRewards + Number(totalRewardsPaid || 0);

     

  const timeMultiplier: Record<PeriodKey, number> = {
    "24 hr": 60 * 24,
    Week: 60 * 24 * 7,
    Month: 60 * 24 * 30,
    Year: 60 * 24 * 365,
  };
  function openCalculator() {


      setRewardPerMinute(Number(userInput));
      setReward(rewardPerMinute * timeMultiplier[selectedPeriod]);
      // setSelectedPeriod("24 hr");
      setCalculatorIsOpen(true);

  }

 
  useEffect(() => {
    if (address) {
      setReward(rewardPerMinute * timeMultiplier["24 hr"]);
      setSelectedPeriod("24 hr");
    } else {
      return;
    }
  }, [address]);

  return (
    <>
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
      <div className="bg-[#0c0c0c] bg-cover bg-no-repeat w-full overflow-hidden transition-all relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/10 via-[#0c0c0c]/30 to-[#000000]/80 opacity-80 z-0"></div>
        <div className="container mx-auto px-3 relative z-10">
          <div className="absolute md:-bottom-[55%] -bottom-36 left-1/2 transform -translate-x-1/2 w-[840px] md:w-[950px] h-full">
            <div className="bg-[url('../../public/cat_bg.jpg')] md:bg-center bg-top bg-auto md:bg-cover bg-no-repeat w-full h-screen md:h-full opacity-[0.2]"></div>
          </div>
          <div className="relative text-center mt-9 md:mt-[50px]">
            <h1 className="sm:text-5xl text-3xl md:text-6xl font-extrabold mx-auto text-white tracking-wide">
              OCICAT DAO Staking
            </h1>
            <p className="mt-5 sm:max-w-[547px] mx-auto text-sm sm:text-base md:text-xl text-gray-300">
              The first Cat DAO Staking on Binance Smart-chain
            </p>
            <div className="mt-[30px] mx-auto lg:flex-nowrap flex-wrap flex w-[90%] overflow-x-hidden sm:w-fit items-center gap-3 md:gap-4 justify-center border rounded-3xl border-[#FF3F3F] py-6 md:px-10 px-0 sm:px-6 bg-[#220808]">
              <div className=" w-fit">
                <div className="flex items-center flex-col gap-3 justify-center">
                  <p className="sm:text-[15px] text-xs text-[#FF6666] px-5">
                    Total Staked
                  </p>
                  <span className="sm:text-base text-sm font-semibold text-white flex items-center justify-center gap-2 px-5">
                    {stakedAmount ? (
                      <>
                        <span>
                          {formatNumberToLocale(
                            String(
                              typeof stakedAmount === "number"
                                ? stakedAmount / 1e6
                                : stakedAmount
                                ? Number(stakedAmount) / 1e6
                                : 0
                            )
                          ) || (
                            <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                          )}
                        </span>
                        <span>
                          {`(${
                            isNaN(Number(stakedAmount)) ||
                            isNaN(Number(totalSupply)) ||
                            !totalSupply
                              ? "0.00"
                              : (
                                  (Number(stakedAmount) / Number(totalSupply)) *
                                  100
                                ).toFixed(2)
                          }%)`}
                        </span>
                      </>
                    ) : (
                      <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                    )}
                  </span>
                </div>
              </div>
              <div className=" w-fit">
                <div className="flex items-center flex-col gap-3 justify-center">
                  <p className="sm:text-[15px] text-xs text-[#FF6666] px-5">
                    Circulating Supply
                  </p>
                  <span className="sm:text-base text-sm font-semibold text-white px-5">
                    {totalSupply ? (
                      formatNumberToLocale(String(Number(circulatingSupply)))
                    ) : (
                      <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                    )}
                  </span>
                </div>
              </div>
              <div className=" w-fit">
                <div className="flex items-center flex-col gap-3 justify-center">
                  <p className="sm:text-[15px] text-xs text-[#FF6666] px-5">
                    Total Supply
                  </p>
                  <span className="sm:text-base text-sm font-semibold text-white px-5">
                    {formatNumberToLocale(
                      String(convertToFloat(Number(totalSupply!), 6))
                    ) || (
                      <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-9 md:mt-[50px] flex justify-center gap-5">
              <div className="bg-[#222222] rounded-[10px] p-2 flex justify-between items-center text-xs sm:text-sm gap-2">
                <span className="">Total Rewards emitted</span>
                <span>|</span>
                <span>
                  {formatNumberToLocale(String((totalWithPaid /1000000).toFixed(2))) || (
                    <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-700" />
                  )}{" "}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center mt-4 mb-9 md:mb-[100px]">
              <button
                className="bg-[#FF2727] opacity-80 text-[#fffff] rounded-[9px] px-5 py-2"
                onClick={openCalculator}
              >
                Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Calculator Modal */}
      {calculatorIsOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setCalculatorIsOpen(false)}
        >
          <div
            className="bg-[#202020] p-6 rounded-lg shadow-lg w-[90%] text-[#4B4B4B] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 mt-2 text-[#FFFFFF]">
              Ocicat Calculator
            </h2>

            {/* User input field */}
            <div className="flex justify-between focus:border focus:border-[#FF2727] rounded-[5px] items-center gap-3 px-3 mb-4 h-14 bg-white relative">
              <input
                className="flex font-semibold transparent h-full w-full pt-3"
                type="number"
                value={userInput}
                placeholder="Enter Ocicat amount" // Added for accessibility
                onChange={(e) => {
                  const input = e.target.value;
                  setUserInput(input);
                  const rate = Number(input) / 1_000_000;
                  setRewardPerMinute(rate);
                  setReward(rate * timeMultiplier[selectedPeriod]);
                }}
              />
              <span className="font-medium">Ocicat</span>
            </div>

            {/* Output field */}

            <div className="flex justify-between focus:border focus:border-[#FF2727] rounded-[5px] items-center gap-3 px-3 mb-4 h-14 bg-white relative">
              <input
                className="flex font-semibold transparent h-full w-full pt-3"
                value={reward.toFixed(2)}
                type="text"
                readOnly
                title="Calculated reward in Ocicat" // Added for accessibility
              />

              <span className="font-medium">USD</span>
              <select
                className="absolute right-3 bg-white rounded px-2 py-1"
                aria-label="Select time period"
                onChange={(e) => {
                  const period = e.target.value as PeriodKey;
                  setSelectedPeriod(period);
                  setReward(rewardPerMinute * timeMultiplier[period]);
                }}
                value={selectedPeriod}
              >
                <option value="24 hr">24 hr</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Connect;
