import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
// import { ethers } from "ethers";
import { CONSTANTS } from "./config/constants";
import { formatUnits } from "viem";
import abi from "./config/abi.json";
import tokenabi from "./config/token_abi.json";
import liquiditytokenabi from "./config/liquidity-token-abi.json";
import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/liquiditystakingabi.json";

// import { convertFromFloat } from "@/lib/utils";
// Replace with your contract address
const STAKING_CONTRACT_ADDRESS = CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const STAKING_CONTRACT_ABI = abi;
const BNBLIQ_SPENDER = CONSTANTS.LIQUIDITY_ADDRESS as `0x${string}`;

const TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const LIQUIDITY_TOKEN = CONSTANTS.LIQUIDITY_TOKEN as `0x${string}`;
const TOKEN_ABI = tokenabi;
const LIQUIDITY_TOKEN_ABI = liquiditytokenabi;

export function useStakingContract() {
  const { address, isConnected } = useAccount();
  const { data: stakeHash, writeContractAsync: writeStakeContract } = useWriteContract();
  // Read stake amount
  const {
    data: stakeAmount,
    error,
    isPending,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getStakeInfo",
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  // console.log(stakeAmount);
  if (error) {
    console.log(error);
  }
  if (isPending) {
    console.log(isPending);
  }
  // Stake function
  const { data: stakeReceiptData, isLoading: isStaking } =
  useWaitForTransactionReceipt({
    hash: stakeHash,
  });
  // const stakeContractFn = async (amount: string) => {
  //   writeContract({
  //     address: STAKING_CONTRACT_ADDRESS,
  //     abi: STAKING_CONTRACT_ABI,
  //     functionName: "stake",
  //     args: [convertFromFloat(Number(amount), 6)], // Replace with user input
  //   });
  //   return stakeReceiptData;
  // };

  // Withdraw function

  return { stakeAmount, isConnected, isStaking, writeStakeContract, stakeReceiptData};
}

export function useWithdrawContract() {
  const { data: withdrawHash, writeContract } = useWriteContract();
  const withdrawContractFn = (stakeId: number) => {
    writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: "withdraw",
      args: [stakeId], // Replace with stake ID
    });
    return withdrawHash;
  };

  return { withdrawContractFn };
}


export function useTokenBalance(walletAddress: string) {
  const { data: rawBalance, isSuccess, isError} = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "decimals",
  });
  if(isSuccess) {
    const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
  }
  if (isError) {
    console.log('errored')
    return 0;
  }
 
}

//  const LIQUIDITY_ADDRESS = CONSTANTS.LIQUIDITY_ADDRESS as `0x${string}`;
// // import liquidityabi from './config/liquidityabi.json'
// import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/abi-liquidity-staking-bnb.json";

export function useLiquidityBalance(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: LIQUIDITY_TOKEN,
    abi: LIQUIDITY_TOKEN_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: LIQUIDITY_TOKEN,
    abi: LIQUIDITY_TOKEN_ABI,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}

// const STAKING_CONTRACT_ADDRESS = CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
// const STAKING_CONTRACT_ABI = abi;
export function useStakeRewardsClaimOcicat(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getPendingRewards",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi:  TOKEN_ABI,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}
export function useStakeRewardsClaimLiq(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: BNBLIQ_SPENDER,
    abi: STAKING_LIQ_CONTRACT_ABI,
    functionName: "getPendingRewards",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}
