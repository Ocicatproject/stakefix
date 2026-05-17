"use client";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { CONSTANTS } from "@/web3/config/constants";
import contractabi from "@/web3/config/dao-contractabi.json";

interface ProposalEndDateDisplayProps {
  proposalId: string;
}

export default function ProposalEndDateDisplay({ proposalId }: ProposalEndDateDisplayProps) {
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;

  const [startTime, setStartTime] = useState<bigint | null>(null);
  const [duration, setDuration] = useState<bigint | null>(null);

  useEffect(() => {
    async function fetchTiming() {
      try {
        const raw = await readContract(wagmiConfig, {
          address: contractAddress,
          abi: contractabi,
          functionName: "getProposal",
          args: [proposalId],
        });

        const [, , _startTime, _duration] = raw as [
          string,  // title
          string,  // description
          bigint,  // startTime
          bigint   // duration
          // ...rest of fields
        ];

        setStartTime(_startTime);
        setDuration(_duration);
      } catch (error) {
        console.error("Error fetching proposal timing:", error);
      }
    }

    if (proposalId) {
      fetchTiming();
    }
  }, [proposalId]);

  if (!startTime || !duration) {
    return (
      <div className="flex h-10 py-3 flex-col justify-start w-full items-start min-w-40">
        <div className="font-extrabold text-sm">
          <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
        </div>
        <div className="text-[#414141] font-extrabold text-xs">
          <span className="inline-block h-4 w-16 animate-pulse rounded bg-gray-700" />
        </div>
      </div>
    );
  }

  const endDate = new Date((Number(startTime) + Number(duration)) * 1000);

  return (
    <div className="flex h-10 py-3 flex-col justify-start w-full items-start min-w-40">
      <div className="font-extrabold text-sm">
        {endDate.toLocaleString("en-US", { month: "long" })} {endDate.getDate()}, {endDate.getFullYear()}
      </div>
      <div className="text-[#414141] font-extrabold text-xs">
        {endDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  );
}
