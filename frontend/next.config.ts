import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://vocabmatrix-production-c443.up.railway.app/api/:path*",
      },
      {
        source: "/login/:path*",
        destination:
          "https://vocabmatrix-production-c443.up.railway.app/login/:path*",
      },
      {
        source: "/oauth2/:path*",
        destination:
          "https://vocabmatrix-production-c443.up.railway.app/oauth2/:path*",
      },
    ];
  },
};

export default nextConfig;
