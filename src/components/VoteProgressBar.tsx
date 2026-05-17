"use client";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { CONSTANTS } from "@/web3/config/constants";
import contractabi from "@/web3/config/dao-contractabi.json";

interface VoteProgressBarProps {
  proposalId: string;
}

export default function VoteProgressBar({ proposalId }: VoteProgressBarProps) {
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const [yesPower, setYesPower] = useState<bigint>(BigInt(0));
  const [noPower, setNoPower] = useState<bigint>(BigInt(0));
  

  useEffect(() => {
    async function fetchVoteData() {
      try {
        const raw = await readContract(wagmiConfig, {
          address: contractAddress,
          abi: contractabi,
          functionName: "getProposal",
          args: [proposalId],
        });

        const [, , , , _yesPower, _noPower] = raw as [
          string, // title
          string, // description
          bigint, // startTime
          bigint, // duration
          bigint, // yesPower
          bigint // noPower
          // ... other fields
        ];

        setYesPower(_yesPower);
        setNoPower(_noPower);
      } catch (error) {
        console.error("Error fetching vote data:", error);
      }
    }

    if (proposalId) {
      fetchVoteData();
    }
  }, [proposalId]);

  const total = Number(yesPower) + Number(noPower);
  const percentage = total === 0 ? 0 : (Number(yesPower) / total) * 100;

  return (
    <span className="relative transition-class bg-[#FF2727] h-2 rounded-full overflow-hidden w-32">
      <span
        className="absolute transition-class rounded-full left-0 top-0 bg-[#00B756] h-full"
        style={{ width: `${percentage}%` }}
      ></span>
    </span>
  );
}
