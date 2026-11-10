import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.203.231.197', 'localhost', '127.0.0.1'],
  async rewrites() {
    if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:5000/api/:path*",
        },
        {
          source: "/v1/:path*",
          destination: "http://127.0.0.1:5000/v1/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
