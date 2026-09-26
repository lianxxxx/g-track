import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // GitHub profile pictures shown on the dashboard.
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
    ],
  },
  async redirects() {
    return [
      // Sign up was the same GitHub OAuth flow as /login; keep old links working.
      { source: "/signup", destination: "/login", permanent: true },
    ];
  },
};

export default nextConfig;
