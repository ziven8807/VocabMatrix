// app/auth/forgot-password/page.tsx

"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useToast } from "@/app/components/toast/ToastProvider";
import AuthLayout from "@/app/auth/components/AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import AuthLink from "@/app/auth/components/AuthLink";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email", "warning");
      return;
    }

    setLoading(true);
    try {
      // 呼叫 API，傳入 DTO 要求的格式 { email }
      await authService.forgotPassword({ email });
      setSubmitted(true);
      showToast("Request processed. Please check your email.", "success");
    } catch (error) {
      // 為了安全，即使失敗也顯示成功訊息（防止 Email 枚舉）
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recover Password"
      subtitle={
        submitted
          ? "Check your inbox"
          : "Enter your email to reset your password"
      }
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingInput
            type="email"
            name="email" // 補上必填屬性 name
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            animationDelay="0.1s"
          />

          <AuthButton
            isLoading={loading}
            loadingText="Sending link..."
            animationDelay="0.2s"
          >
            Send Reset Link
          </AuthButton>
        </form>
      ) : (
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
          {/* 修正 ESLint 撇號報錯：We've -> We&apos;ve / don't -> don&apos;t */}
          <p className="text-gray-400 text-sm leading-relaxed">
            We&apos;ve sent instructions to{" "}
            <span className="text-white font-medium">{email}</span>. Please
            check your spam folder if you don&apos;t see it soon.
          </p>
        </div>
      )}

      <AuthLink
        text="Remember your password?"
        linkText="Back to Login"
        href="/auth/login"
        animationDelay="0.3s"
      />
    </AuthLayout>
  );
}
