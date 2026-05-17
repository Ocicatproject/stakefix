import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accept images from any HTTPS domain
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
