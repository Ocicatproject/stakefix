"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { GetProposals } from "@/lib/api/actions";
import { ProposalData } from "@/lib/api/actions";

// Define Context with both proposals and a function to refetch them
interface ProposalsContextType {
  proposals: ProposalData[];
  fetchProposals: () => Promise<void>;
}

const ProposalsContext = createContext<ProposalsContextType | undefined>(
  undefined
);

export function ProposalsProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const retries = useRef(0);
  const maxRetries = 3;

  // Fetch proposals function with retry logic
  const fetchProposals = async () => {
    try {
      const fetchedProposals = await GetProposals();
      if (!fetchedProposals || fetchedProposals.length === 0) {
        throw new Error("Proposals undefined or empty");
      }
      setProposals(fetchedProposals);
      retries.current = 0; // reset retries on success
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching proposals:", error);
      if (retries.current < maxRetries) {
        retries.current += 1;
        setTimeout(fetchProposals, 3000); // retry after 3 seconds
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <ProposalsContext.Provider value={{ proposals, fetchProposals }}>
      {children}
    </ProposalsContext.Provider>
  );
}

// Custom Hook to Access Proposals Context
export function useProposals() {
  const context = useContext(ProposalsContext);
  if (!context) {
    throw new Error("useProposals must be used within a ProposalsProvider");
  }
  return context;
}
