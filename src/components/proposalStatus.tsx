"use client";
import type { JSX } from "react";
import { readContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import { useConfig } from "wagmi";
import { CONSTANTS } from "@/web3/config/constants";
import contractabi from "@/web3/config/dao-contractabi.json";
import { getProposalStatusCode } from "@/lib/utils";
interface ProposalStatusProps {
  proposalId: string;
}

export default function ProposalStatus({ proposalId }: ProposalStatusProps) {
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const [status, setStatus] = useState<JSX.Element | null>(null);

     function getProposalStatus(
        startDate: bigint,
        duration: bigint,
        yesPower: bigint,
        noPower: bigint
      ) {
        const status = getProposalStatusCode(
          startDate,
          duration,
          yesPower,
          noPower
        );
    
        if (status === "1") {
          return (
            <span className="rounded-full border-2 border-[#FFC227] text-[#FFC227] bg-[#392D0D] p-2 font-normal text-sm">
              Ongoing
            </span>
          );
        }
    
        if (status === "2") {
          return (
            <span className="rounded-full border-2 border-[#18AB44] text-[#18AB44] bg-[#083510] p-2 font-normal text-sm">
              Completed
            </span>
          );
        }
    
        return (
          <span className="rounded-full border-2 border-[#FF2727] text-[#FF2727] bg-[#390D0D] p-2 font-normal text-sm">
            Completed
          </span>
        );
    }
    

  useEffect(() => {
    async function fetchProposalStatus() {
      try {
        const raw = await readContract(wagmiConfig, {
          address: contractAddress,
          abi: contractabi,
          functionName: "getProposal",
          args: [proposalId],
        });

        const [, , startTime, duration, yesPower, noPower] = raw as [
          string,     // title
          string,     // description
          bigint,     // startTime
          bigint,     // duration
          bigint,     // yesPower
          bigint,     // noPower
          // ... other unused fields
        ];

        const result = getProposalStatus(startTime, duration, yesPower, noPower);
            setStatus(result);
      } catch (error) {
        console.error("Error fetching proposal status:", error);
      }
    }

    if (proposalId) {
      fetchProposalStatus();
    }
  }, [proposalId]);

  return (
    <div className="text-sm font-semibold text-blue-400">
      {status ?? (
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
      )}
    </div>
  );
}
