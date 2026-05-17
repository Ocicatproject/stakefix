"use server"
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Proposal Types
export type ProposalDataOnBlock = {
  title: string;
  description: string;
  startTime: bigint; // uint256
  duration: bigint; // uint256
  yesPower: bigint; // uint256
  noPower: bigint; // uint256
  ocicatReward: bigint; // uint256
  bnbReward: bigint; // uint256
  totalVotes: bigint; // uint256
  finalized: boolean;
  outcome: string;
};
// Proposal Types
export type ProposalData = {
  title: string;
  image: string;
  distributionAmount: number;
  description: string;
  creator: string;
  proposalId: string;
  createdDate: string;
  _id?: string;
  __v?: number;
};

export async function CreateProposal(
  data: ProposalData
) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/proposals`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("data sent: ", data)

    console.log("creating proposal:", data);
    const result = response.data;
    console.log("The created proposals:", result);


    return { success: true, result };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error creating proposal:", error.response.data);
    } else {
      console.error("Unexpected error creating proposal:", error);
    }
    return {success:false};
  }
}



export async function GetProposals(): Promise<ProposalData[] | undefined> {
  try {
    const response = await axios.get(`${BACKEND_URL}/proposals`);

    const result = response.data;
console.log("The fetched proposals:", result)
      return result;
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching proposal:", error.response.data);
    } else {
      console.error("Unexpected error fetching proposal:", error);
    }
    return undefined; // Explicitly return undefined in case of an error
  }
}