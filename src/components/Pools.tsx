"use client";

import React, { useState } from "react";

const Pools = () => {
  const [activeActions, setActiveActions] = useState<{
    [key: number]: string | null;
  }>({});
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [totals, setTotals] = useState<{ [key: number]: string | null }>({});
  const [stakingStatus, setStakingStatus] = useState<{ [key: number]: string }>(
    {}
  );

  const poolData = [
    {
      id: 1,
      stackedAmount: "0.000",
      description: " Lock more OCICAT/BNB tokens to increase your voting power and rewards",
      total: "2.67890453",
    },
  ];

  const handleStakeClick = (id: number) => {
    setActiveActions((prev) => ({ ...prev, [id]: "stake" }));
    setInputValues((prev) => ({ ...prev, [id]: "" }));
    setStakingStatus((prev) => ({ ...prev, [id]: "Staking in progress" })); 
  };

  const handleUnstakeClick = (id: number) => {
    setActiveActions((prev) => ({ ...prev, [id]: "unstake" }));
    setTotals((prev) => ({ ...prev, [id]: null }));
    setStakingStatus((prev) => ({ ...prev, [id]: "No unstaking in progress" })); 
  };

  const handleInputChange = (id: number, value: string) => {
    if (!isNaN(Number(value))) {
      setInputValues((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleStake = (id: number) => {
    if (inputValues[id]) {
      setTotals((prev) => ({ ...prev, [id]: inputValues[id] }));
      setActiveActions((prev) => ({ ...prev, [id]: "unstake" }));
      setStakingStatus((prev) => ({
        ...prev,
        [id]: "No unstaking in progress",
      })); // Update message after staking
    }
  };

    const handleMaxClick = (id: number, totalValue: string) => {
      if (activeActions[id] === "stake") {
        const numericValue = totalValue.split(" ")[0];
        setInputValues((prev) => ({ ...prev, [id]: numericValue }));
      }
    };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
        {poolData.map((pool) => (
          <div key={pool.id} className="w-full max-w-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <span className="font-semibold text-xl mr-2">Locked:</span>
                <span className="text-2xl font-semibold text-transparent bg-clip-text mt-1.5 bg-gradient-to-r from-red-400 to-red-600">
                  {totals[pool.id] !== null ? (
                    totals[pool.id] || pool.stackedAmount
                  ) : (
                    <span className="text-2xl font-semibold">0.00</span>
                  )}
                </span>
              </div>
            </div>
            <p className="text-sm mb-4">
              {pool.description}{" "}
              <a
                href="https://ocicat.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-red-500 hover:text-red-600"
              >
                Learn more
              </a>
            </p>
            <div className="bg-[#19232D] p-4 rounded-lg mb-4">
              <div className="flex justify-between text-sm">
                <div className="">
                  <span
                    onClick={() => handleStakeClick(pool.id)}
                    className={`mr-1 cursor-pointer ${
                      activeActions[pool.id] === "stake"
                        ? "text-red-500"
                        : "hover:text-gray-400"
                    }`}
                  >
                    Stake
                  </span>
                  <span
                    onClick={() => handleUnstakeClick(pool.id)}
                    className={`cursor-pointer ${
                      activeActions[pool.id] === "unstake"
                        ? "text-red-500"
                        : "hover:text-gray-400"
                    }`}
                  >
                    Unstake
                  </span>
                </div>
                <div>
                  <span className="total">{pool.total}</span>
                  <button className="bg-red-600 text-white rounded-sm mx-1 p-0.5 font-semibold cursor-pointer">
                    Withdraw
                  </button>
                  <button
                    onClick={() => handleMaxClick(pool.id, pool.total)}
                    className={`bg-red-600 text-white rounded-md px-2 py-1 font-semibold ${
                      activeActions[pool.id] === "stake"
                        ? "hover:bg-red-700"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white text-red-600 p-2 rounded-lg mt-2">
                <input
                  type="text"
                  value={inputValues[pool.id] || ""}
                  onChange={(e) => handleInputChange(pool.id, e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-right text-2xl font-semibold outline-none"
                />
              </div>
            </div>
            <div className="bg-[#19232D] p-4 rounded-lg">
              <button
                onClick={() => handleStake(pool.id)}
                className={`w-full text-center text-white p-2 rounded-lg outline-none focus:ring-2 ${
                  activeActions[pool.id] === "stake"
                    ? "bg-red-600 focus:ring-red-500"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
                disabled={activeActions[pool.id] !== "stake"}
              >
                {activeActions[pool.id] === "stake" ? "Stake" : "Unstake"}
              </button>
            </div>
            <p className="text-center text-sm sm:text-base mt-4 text-gray-400">
              {stakingStatus[pool.id] || "No unstaking in progress"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pools;
