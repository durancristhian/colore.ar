import type { NextConfig } from "next";

// Validate env at build time so missing/empty required vars fail fast
import "@/lib/env.server";
import "@/lib/env.client";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/stats.js",
        destination: "https://cloud.umami.is/script.js",
      },
    ];
  },
};

export default nextConfig;
