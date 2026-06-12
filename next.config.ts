import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.58.151.46"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ocqptvxaocwgcmahvwzn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
