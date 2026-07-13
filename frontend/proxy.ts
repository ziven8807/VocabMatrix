// frontend/proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. 取得 Cookie (由後端發送，httpOnly 應為 false 才能讀取)
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value;
  const hasPassword = request.cookies.get("hasPassword")?.value;

  const { pathname } = request.nextUrl;

  // 定義路徑分類
  const isAuthPage = pathname.startsWith("/auth");
  const isPasswordChangePage = pathname.startsWith(
    "/settings/components/password-change",
  );

  // --- 邏輯 A：保護密碼修改頁面 ---
  if (isPasswordChangePage) {
    // 沒登入的人，踢去登入
    if (isLoggedIn !== "true") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // 是第三方帳號（沒密碼）的人，踢回設定主頁並帶上錯誤訊息參數
    if (hasPassword !== "true") {
      return NextResponse.redirect(
        new URL("/settings?error=no_password", request.url),
      );
    }
  }

  // --- 邏輯 B：已登入者攔截 (不准回登入/註冊頁) ---
  if (isLoggedIn === "true" && isAuthPage) {
    if (!pathname.includes("reset-password")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Matcher 設定
export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/oauth2/redirect",
    "/settings/components/password-change/:path*",
  ],
};
