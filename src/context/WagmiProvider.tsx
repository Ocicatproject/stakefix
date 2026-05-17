"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider,} from "@rainbow-me/rainbowkit";
import { http,  WagmiProvider,} from "wagmi";
import {  bsc} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// const TESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

const config = getDefaultConfig({
  appName: "Ocicat Staking",
  // projectId: "182e4ea4b15ddfe7e252571c2a21ad09",
  projectId: "ff18158120e715cf38e4fb9a77821344",
  chains: [bsc],
  ssr: false, // If your dApp uses server side rendering (SSR),
  transports: {
    [bsc.id]: http(process.env.NEXT_PUBLIC_RPC_URL)
    // [56]: http(process.env.NEXT_PUBLIC_RPC_URL),
    // [97]: http(TESTNET_RPC_URL),
  },
});
const queryClient = new QueryClient();
export function AppWagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
