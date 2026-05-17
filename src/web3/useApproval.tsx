import {
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONSTANTS } from "./config/constants";
import tokenabi from "./config/token_abi.json";

const TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const TOKEN_ABI = tokenabi;
// const STAKING_ADDRESS = CONSTANTS.CONTRACT_ADDRESS as `0x${string}`;

export const useApprovalContract = (staker: string, spender: string) => {
  const { data: max_allowance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "totalSupply",
  });
  // console.log(max_allowance);
  const { data: allowance, refetch } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "allowance",
    args: [staker as `0x${string}`, spender as `0x${string}`],
  });
  const { data: simulateApproval } = useSimulateContract({
    address: TOKEN_ADDRESS,
    abi: tokenabi,
    functionName: "approve",
    args: [staker, max_allowance],
  });
  const {
    data: writeContractResult,
    writeContractAsync: writeApprovalContract,
    error: approvalError,
  } = useWriteContract();
  const { data: approvalReceiptData, isLoading: isApproving } =
    useWaitForTransactionReceipt({
      hash: writeContractResult,
    });
  return {
    allowance: Number(allowance),
    refetch,
    simulateApproval,
    isApproving,
    approvalReceiptData,
    writeApprovalContract,
    approvalError,
    max_allowance,
  };
};
const LIQ_TOKEN_ADDRESS = CONSTANTS.LIQUIDITY_TOKEN as `0x${string}`
import liqtokenabi from './config/liquidity-token-abi.json';
export const useLiqApprovalContract = (staker: string, spender: string) => {
  const { data: max_allowance } = useReadContract({
    address: LIQ_TOKEN_ADDRESS,
    abi: liqtokenabi,
    functionName: "totalSupply",
  });
  const { data: allowance, refetch } = useReadContract({
    address: LIQ_TOKEN_ADDRESS,
    abi: liqtokenabi,
    functionName: "allowance",
    args: [staker as `0x${string}`, spender as `0x${string}`],
  });
  const { data: simulateApproval } = useSimulateContract({
    address: LIQ_TOKEN_ADDRESS,
    abi: liqtokenabi,
    functionName: "approve",
    args: [staker, max_allowance],
  });
  const {
    data: writeContractResult,
    writeContractAsync: writeApprovalContract,
    error: approvalError,
  } = useWriteContract();
  const { data: approvalReceiptData, isLoading: isApproving } =
    useWaitForTransactionReceipt({
      hash: writeContractResult,
    });
  return {
    allowance: Number(allowance),
    refetch,
    simulateApproval,
    isApproving,
    approvalReceiptData,
    writeApprovalContract,
    approvalError,
    max_allowance,
  };
};


































// function ApproveOrReviewButton({
//   taker,
//   onClick,
//   sellTokenAddress,
//   disabled,
//   price,
// }: {
//   taker: Address;
//   onClick: () => void;
//   sellTokenAddress: Address;
//   disabled?: boolean;
//   price: any;
// }) {
//   // If price.issues.allowance is null, show the Review Trade button

//   console.log("checked spender approval");

//   // 2. (only if no allowance): write to erc20, approve token allowance for the determined spender
//   const { data } = useSimulateContract({
//     address: sellTokenAddress,
//     abi: erc20Abi,
//     functionName: "approve",
//     args: [spender, MAX_ALLOWANCE],
//   });
//   if (price?.issues.allowance === null) {
//     return (
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => {
//           // fetch data, when finished, show quote view
//           // onClick();
//         }}
//         className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-25"
//       >
//         {disabled ? "Insufficient Balance" : "Review Trade"}
//       </button>
//     );
//   }
//   // export default ApproveOrReviewButton;

//   // Determine the spender from price.issues.allowance
//   const spender = price?.issues.allowance.spender;

//   // 1. Read from erc20, check approval for the determined spender to spend sellToken

//   // Define useWriteContract for the 'approve' operation
//   const {
//     data: writeContractResult,
//     writeContractAsync: writeContract,
//     error,
//   } = useWriteContract();

//   // useWaitForTransactionReceipt to wait for the approval transaction to complete
//   const { data: approvalReceiptData, isLoading: isApproving } =
//     useWaitForTransactionReceipt({
//       hash: writeContractResult,
//     });

//   // Call `refetch` when the transaction succeeds
//   useEffect(() => {
//     if (data) {
//       refetch();
//     }
//   }, [data, refetch]);

//   if (error) {
//     return <div>Something went wrong: {error.message}</div>;
//   }

//   if (allowance === 0n) {
//     return (
//       <>
//         <button
//           type="button"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
//           onClick={async () => {
//             await writeContract({
//               abi: erc20Abi,
//               address: sellTokenAddress,
//               functionName: "approve",
//               args: [spender, MAX_ALLOWANCE],
//             });
//             console.log("approving spender to spend sell token");

//             refetch();
//           }}
//         >
//           {isApproving ? "Approving…" : "Approve"}
//         </button>
//       </>
//     );
//   }

//   return (
//     <button
//       type="button"
//       disabled={disabled}
//       onClick={() => {
//         // fetch data, when finished, show quote view
//         onClick();
//       }}
//       className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-25"
//     >
//       {disabled ? "Insufficient Balance" : "Review Trade"}
//     </button>
//   );
// }
