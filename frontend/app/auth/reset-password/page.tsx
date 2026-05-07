// frontend/app/auth/reset-password/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { authService } from "@/services/authService";
import { useToast } from "@/app/components/toast/ToastProvider";
import AuthLayout from "@/app/auth/components/AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import AuthLink from "@/app/auth/components/AuthLink";

/**
 * 重置密碼內容組件
 * 拆分出來是因為 useSearchParams() 必須在 Suspense 邊界內使用
 */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 進入頁面時，若無 Token 則自動踢回登入頁
  useEffect(() => {
    if (!token) {
      showToast("Invalid or missing reset token.", "error");
      router.replace("/auth/login");
    }
  }, [token, router, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 當使用者開始輸入時，清除該欄位的錯誤訊息
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 前端基本驗證
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: "Password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    try {
      // 呼叫後端 API，傳入 DTO 格式數據
      await authService.resetPassword({
        token: token || "",
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      showToast(
        "Password reset successful! Please login with your new password.",
        "success",
      );

      // 延遲跳轉回登入頁面
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      let errorMessage = "Link expired or invalid token.";

      // 安全地處理 Axios 錯誤，不使用 any
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Please enter your new security credentials"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          type="password"
          name="newPassword" // 對應 DTO 中的屬性名
          label="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          animationDelay="0.1s"
        />

        <FloatingInput
          type="password"
          name="confirmPassword" // 對應 DTO 中的屬性名
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          animationDelay="0.2s"
        />

        <div className="pt-4">
          <AuthButton
            isLoading={loading}
            loadingText="Updating password..."
            animationDelay="0.3s"
          >
            Reset Password
          </AuthButton>
        </div>
      </form>

      <AuthLink
        text="Changed your mind?"
        linkText="Back to Login"
        href="/auth/login"
        animationDelay="0.4s"
      />
    </AuthLayout>
  );
}

/**
 * 主頁面入口
 * 使用 Suspense 包裹以支援 Next.js 的客戶端路由參數抓取
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
