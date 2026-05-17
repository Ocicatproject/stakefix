"use client";
import { readContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import { CONSTANTS } from "@/web3/config/constants";
import { useConfig } from "wagmi";
import contractabi from "@/web3/config/dao-contractabi.json";

interface VotesNumberProps {
  proposalId: string;
}

export default function VotesNumber({ proposalId }: VotesNumberProps) {
  const wagmiConfig = useConfig();
  const contractAddress = CONSTANTS.OCICAT_DAO_ADDRESS as `0x${string}`;
  const [totalVotes, setTotalVotes] = useState<bigint | null>(null);

  useEffect(() => {
    async function fetchTotalVotes() {
      try {
        const raw = await readContract(wagmiConfig, {
          address: contractAddress,
          abi: contractabi,
          functionName: "getProposal",
          args: [proposalId],
        });

        const [, , , , , , , , _totalVotes] = raw as [
          string, // title
          string, // description
          bigint, // startTime
          bigint, // duration
          bigint, // yesPower
          bigint, // noPower
          bigint, // ocicatReward
          bigint, // bnbReward
          bigint // totalVotes
        ];

        setTotalVotes(_totalVotes);
      } catch (error) {
        console.error("Error fetching total votes:", error);
      }
    }

    if (proposalId) {
      fetchTotalVotes();
    }
  }, [proposalId]);

  return (
    <span className="flex text-center justify-start items-center min-w-40">
      {totalVotes !== null ? (
        totalVotes.toString()
      ) : (
        <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-700" />
      )}
    </span>
  );
}
