// app/auth/resend-verification/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { authService } from "@/services/authService";
import { useToast } from "@/app/components/toast/ToastProvider";
import AuthLayout from "@/app/auth/components/AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import AuthLink from "@/app/auth/components/AuthLink";

/**
 * 頁面主體內容
 * 拆成獨立 component 是因為 useSearchParams 必須在 Suspense 邊界內使用
 *
 * 兩種進入情境：
 * 1. 從註冊頁跳轉：URL 帶有 ?email=xxx，直接顯示「已寄出」狀態
 * 2. 直接進入：顯示表單讓使用者手動填入 email
 */
function ResendVerificationContent() {
  // 從 URL query string 取得 email（註冊頁跳轉時帶入）
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const { showToast } = useToast();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  // 有初始 email 代表從註冊頁跳轉過來，直接進入已寄出狀態
  const [submitted, setSubmitted] = useState(!!initialEmail);

  /**
   * 送出重寄驗證信請求
   * - 5xx / 網路錯誤：顯示錯誤訊息
   * - 4xx：偽裝成功，防止 email 枚舉攻擊
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "warning");
      return;
    }

    setLoading(true);
    try {
      await authService.resendVerificationEmail(email.trim());
      setSubmitted(true);
      showToast("Request processed. Please check your email.", "success");
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500)
      ) {
        // 伺服器或網路錯誤，明確告知使用者
        showToast("Server error, please try again later.", "error");
      } else {
        // 4xx 偽裝成功，防止 email 枚舉
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={
        submitted
          ? "Check your inbox"
          : "Enter your email to resend the verification link"
      }
    >
      {!submitted ? (
        // 未送出狀態：顯示 email 輸入表單
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingInput
            type="email"
            name="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            animationDelay="0.1s"
          />
          <AuthButton
            isLoading={loading}
            loadingText="Sending..."
            animationDelay="0.2s"
          >
            Resend Verification Email
          </AuthButton>
        </form>
      ) : (
        // 已送出狀態：顯示成功畫面，並提供重寄按鈕
        <div className="text-center py-6 animate-fade-in">
          <div className="mb-4 text-purple-400">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            We&apos;ve sent a verification link to{" "}
            <span className="text-white font-medium">{email}</span>. Please
            check your spam folder if you don&apos;t see it soon.
          </p>
          {/* 沒收到信時可點擊重寄 */}
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={loading}
            className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Didn't receive it? Resend"}
          </button>
        </div>
      )}

      <AuthLink
        text="Already verified?"
        linkText="Back to Login"
        href="/auth/login"
        animationDelay="0.3s"
      />
    </AuthLayout>
  );
}

/**
 * useSearchParams 必須包在 Suspense 內，否則 Next.js build 時會報錯
 * 詳見：https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function ResendVerificationPage() {
  return (
    <Suspense>
      <ResendVerificationContent />
    </Suspense>
  );
}
