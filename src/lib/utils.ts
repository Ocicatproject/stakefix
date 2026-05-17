import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertFromFloat(value: number, decimals: number): number {
  return value * Math.pow(10, decimals);
}
export function convertToFloat(value: number, decimals: number): number {
  return value / Math.pow(10, decimals);
}

export function formatWallet(walletAddress: string): string {
    if (!walletAddress || walletAddress.length < 8) {
      return walletAddress; // Return as is if it's too short
    }

    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
  }


  export function formatNumberToLocale(num: string | null) {
    if (!num || isNaN(Number(num))) return ""; // Return an empty string if NaN
    return Number(num).toLocaleString("en-US");
  }
  

export function formatDate (dateString: string) {
    const date = new Date(dateString);

    const monthName = date.toLocaleString("en-US", { month: "long" }); // Full month name (e.g., "April")
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // e.g., "12:00 AM"

    return { monthName, time };
};
export function formatAPIDate(dateString: string) {
  const date = new Date(dateString);

  const formattedDate = `${date.toLocaleString("en-US", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

  export function addDays(dateTimestamp: bigint, daysToAdd: number) {
    const date = new Date(Number(dateTimestamp) * 1000); // convert from seconds to ms
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString();
  }
export function votingOngoing(createdDate: bigint, duration: bigint) {
  const currentDate = new Date();
  const proposalDate = new Date(Number(createdDate) * 1000); // convert seconds to milliseconds
  const timeDiff = currentDate.getTime() - proposalDate.getTime();
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
  const durationInDays = Number(duration) / (60 * 60 * 24); // seconds to days
  // console.log("day differece in days", dayDiff);
  // console.log("duration in days", durationInDays);
  return dayDiff < durationInDays;
}

export function getProposalStatusCode(
  startDate: bigint,
  duration: bigint,
  yesPower: bigint,
  noPower: bigint
): "1" | "2" | "3" {
  const currentDate = new Date();
  const proposalDate = new Date(Number(startDate) * 1000); // convert to ms
  const timeDiff = currentDate.getTime() - proposalDate.getTime();
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24); // milliseconds to days
   const durationInDays = Number(duration) / (60 * 60 * 24);
  const win = Number(yesPower) > Number(noPower);

  if (dayDiff < Number(durationInDays)) {
    return "1"; // Ongoing
  } else {
    return win ? "2" : "3"; // Completed with Win or Loss
  }
}


  