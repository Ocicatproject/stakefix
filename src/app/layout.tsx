import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
// import{ AppWagmiProvider} from '@/context/WagmiProvider';
import ContextProvider from "@/context/AppkitProvider";
import { headers } from "next/headers";
import { ProposalsProvider } from "@/context/proposalsContext";





export const metadata: Metadata = {
  metadataBase: new URL("https://your-production-domain.com"),
  title: "Ocicat Staking",
  description: "Stake Ocicat and earn rewards",
  icons: {
    icon: "/public/favicon.ico",
  },
  openGraph: {
    title: "Ocicat Staking",
    description: "Stake Ocicat and Earn Rewards",
    url: "https://your-site-url.com",
    siteName: "Stake Ocicat",
    images: [
      {
        url: "/public/logo.svg",
        width: 800,
        height: 600,
        alt: "Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@your-twitter-handle",
    creator: "@your-twitter-handle",
    title: "Ocicat Staking",
    description: "Stake Ocicat and earn rewards",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  

  return (
    <html lang="en">
     
      <body className="font-ClashDisplay bg-black">
        {/* <AppWagmiProvider> */}
        <ContextProvider cookies={cookies}>
          
          <Navbar />
          <main className="relative overflow-x-hidden text-white">
            <ProposalsProvider>
              {children}
            </ProposalsProvider>
          </main>
        </ContextProvider>
        {/* </AppWagmiProvider> */}
      </body>
    </html>
  );
}
