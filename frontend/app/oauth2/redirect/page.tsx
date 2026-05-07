// frontend/app/oauth2/redirect/page.tsx

"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { tokenManager } from "@/lib/tokenManager";
import { authService } from "@/services/authService";

function OAuth2RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 防止 React 18 Strict Mode 觸發兩次
    if (hasProcessed.current) return;

    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      hasProcessed.current = true;

      const setupAuth = async () => {
        try {
          // 1. 先將 token 存入記憶體,讓後續 API 請求可以帶上 Authorization header
          tokenManager.setToken(accessToken);

          // 2. 呼叫 refresh API 取得完整的 user 資料
          const response = await authService.refresh();

          if (response.data.user && response.data.accessToken) {
            // 3. 使用 login 方法更新全域狀態
            // 這會同步更新: AuthContext state + localStorage cache + Cookie 標記
            login(response.data.user, response.data.accessToken);

            // 4. 成功後導回首頁
            // 使用 window.location.href 確保整個應用狀態完全刷新
            setTimeout(() => {
              window.location.href = "/";
            }, 200);
          } else {
            throw new Error("User data not found in response");
          }
        } catch (error) {
          console.error("OAuth 同步失敗:", error);
          // 失敗時清理狀態並導回登入頁
          tokenManager.clearToken();
          router.replace("/auth/login?error=auth_sync_failed");
        }
      };

      setupAuth();
    } else {
      // 如果 URL 沒帶 accessToken,視為非法進入
      router.replace("/auth/login");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white font-sans">
      <div className="relative">
        {/* 外圈動畫 */}
        <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/20 animate-pulse"></div>
        {/* 載入圖示 */}
        <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-8"></div>
      </div>

      <h2 className="text-xl font-semibold tracking-wide animate-pulse">
        Syncing your social media accounts...
      </h2>
      <p className="text-gray-400 mt-2 text-sm">
        Please wait, you will be redirected to the homepage shortly.
      </p>
    </div>
  );
}

// 使用 Suspense 包裹以符合 Next.js 13+ 規範 (因為使用了 useSearchParams)
export default function OAuth2RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#030712] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
      }
    >
      <OAuth2RedirectHandler />
    </Suspense>
  );
}
