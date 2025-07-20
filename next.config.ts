import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.S3_ENDPOINT!,
        port: process.env.S3_PORT!,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**.ico",
      },
    ],
  },
};

export default nextConfig;
