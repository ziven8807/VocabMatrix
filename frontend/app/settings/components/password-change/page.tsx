// app/settings/components/password-change/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/app/components/toast/ToastProvider";
import axios from "axios";

// 引入共用UI元件
import AuthLayout from "@/app/auth/components//AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import AuthLink from "@/app/auth/components/AuthLink";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 處理未登入跳轉，放在 useEffect 確保只在客戶端執行
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login");
    }
  }, [isLoading, user, router]);

  // 1. 解決殘影：載入中狀態渲染
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  // 2. 如果沒人登入，返回 null (由 useEffect 處理跳轉)
  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "At least 6 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 呼叫 API: /api/user/password/change
      await userService.changePassword(formData);

      showToast("Password updated! Logging out for security...", "success");

      // 密碼變更後，安全起見強制重新登入
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error) {
      let message = "Failed to update password";
      if (axios.isAxiosError(error)) {
        // 如果後端返回 401，通常是舊密碼打錯
        if (error.response?.status === 401) {
          message = "Current password is incorrect";
        } else {
          message = error.response?.data?.message || message;
        }
      }
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Security" subtitle="Keep your VocabMatrix account safe">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <FloatingInput
          type="password"
          name="currentPassword"
          label="Current Password"
          value={formData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          animationDelay="0.1s"
        />

        {/* 分隔線 */}
        <div className="py-2 flex items-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        <FloatingInput
          type="password"
          name="newPassword"
          label="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          animationDelay="0.2s"
        />

        <FloatingInput
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          animationDelay="0.3s"
        />

        <div className="pt-4">
          <AuthButton
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Securing account..."
            animationDelay="0.4s"
          >
            Update Password
          </AuthButton>
        </div>
      </form>

      <AuthLink
        text="Changed your mind?"
        linkText="Back to Home"
        href="/"
        animationDelay="0.5s"
      />
    </AuthLayout>
  );
}
