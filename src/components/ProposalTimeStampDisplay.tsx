"use client";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { CONSTANTS } from "@/web3/config/constants";
import contractabi from "@/web3/config/dao-contractabi.json";
// import { formatAPIDate } from "@/lib/utils";

interface ProposalTimestampDisplayProps {
  proposalId: string;
  createdDate: string;
}

export default function ProposalTimestampDisplay({
  proposalId,
  createdDate,
}: ProposalTimestampDisplayProps) {
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const [startTime, setStartTime] = useState<bigint | null>(null);

  useEffect(() => {
    async function fetchStartTime() {
      try {
        const raw = await readContract(wagmiConfig, {
          address: contractAddress,
          abi: contractabi,
          functionName: "getProposal",
          args: [proposalId],
        });

        const [, , _startTime] = raw as [
          string,
          string,
          bigint // startTime
          // ...other fields omitted for brevity
        ];

        setStartTime(_startTime);
      } catch (error) {
        console.error("Error fetching proposal start time:", error);
      }
    }

    if (proposalId) {
      fetchStartTime();
    }
  }, [proposalId]);

  const dateObject = startTime
    ? new Date(Number(startTime) * 1000)
    : new Date(createdDate);

  const month = dateObject.toLocaleString("en-US", { month: "long" });
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();
  const time = dateObject.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex h-10 py-3 flex-col justify-start items-start w-full min-w-40">
      <div className="font-extrabold text-sm">
        {month} {day}, {year}
      </div>
      <div className="text-[#414141] font-extrabold text-xs">{time}</div>
    </div>
  );
}
