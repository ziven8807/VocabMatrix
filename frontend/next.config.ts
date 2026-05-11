// frontend/next.config.ts

import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 前端打 /api/xxx 的請求，Next.js server 會幫你轉發到後端
        // 瀏覽器看到的 domain 是前端 domain，所以 cookie 是 same-site
        // 這樣即使 cookie-same-site 是 Lax 也能正常運作
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        // 例如：https://vocabmatrix-production-c443.up.railway.app/api/:path*
      },
    ];
  },
};

module.exports = nextConfig;
