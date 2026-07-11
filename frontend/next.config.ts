// frontend/next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 部署必要設定
  // 讓 Next.js build 時輸出 .next/standalone 資料夾
  // Dockerfile 會用這個資料夾來啟動 server，不加這行 container 會跑不起來
  output: "standalone",

  async rewrites() {
    return [
      {
        // 前端打 /api/xxx 的請求，Next.js server 會幫你轉發到後端
        // 瀏覽器看到的 domain 是前端 domain，所以 cookie 是 same-site
        // 這樣即使 cookie-same-site 是 Lax 也能正常運作
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        // OAuth2 登入流程也需要轉發
        // Google / Facebook 登入的 redirect 會走這條
        source: "/oauth2/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
