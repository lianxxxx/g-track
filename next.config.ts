import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // GitHub profile pictures shown on the dashboard.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
    ],
  },
};

export default nextConfig;
