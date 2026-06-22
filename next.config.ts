import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3znc0tm3cy.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
