// frontend/app/auth/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useToast } from "@/app/components/toast/ToastProvider";
import type { RegisterRequestDTO } from "@/types/auth.dto";
import axios from "axios";

// 引入共用UI元件
import AuthLayout from "@/app/auth/components/AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import SocialLogin from "@/app/auth/components/SocialLogin";
import AuthLink from "@/app/auth/components/AuthLink";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequestDTO>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterRequestDTO, string>>
  >({});

  /** 更新表單欄位值，並清除該欄位的錯誤訊息 */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 清除該欄位的錯誤訊息
    if (errors[name as keyof RegisterRequestDTO]) {
      setErrors((prev: Partial<Record<keyof RegisterRequestDTO, string>>) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /** 提交前的前端驗證，回傳是否通過 */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequestDTO, string>> = {};

    if (!formData.email) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username) {
      newErrors.username = "Please enter your username";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username cannot exceed 20 characters";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 50) {
      newErrors.password = "Password cannot exceed 50 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 送出註冊表單
   * 成功後跳轉至重寄驗證信頁面，並帶入 email 讓該頁面直接顯示「已寄出」狀態
   * （原本是清空表單後 3 秒跳轉至登入頁，已改為此流程）
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData);
      showToast(
        "Registration successful! Please check your email for verification",
        "success",
      );

      // 跳轉至重寄驗證信頁面，帶入 email 讓該頁面直接顯示「已寄出」狀態
      router.push(
        `/auth/resend-verification?email=${encodeURIComponent(formData.email)}`,
      );
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Registration failed, please try again"
        : "Registration failed, please try again";

      showToast(message, "error");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: 串接 Google OAuth
  const handleGoogleLogin = () => {
    showToast("Google login coming soon", "info");
  };

  // TODO: 串接 Facebook OAuth
  const handleFacebookLogin = () => {
    showToast("Facebook login coming soon", "info");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start your journey"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Email 輸入欄 */}
        <FloatingInput
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          animationDelay="0.1s"
        />

        {/* 使用者名稱輸入欄 */}
        <FloatingInput
          type="text"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          animationDelay="0.2s"
        />

        {/* 密碼輸入欄 */}
        <FloatingInput
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          animationDelay="0.3s"
        />

        {/* 確認密碼輸入欄 */}
        <FloatingInput
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          animationDelay="0.4s"
        />

        {/* 註冊按鈕 */}
        <AuthButton
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Registering..."
          animationDelay="0.5s"
        >
          Register
        </AuthButton>
      </form>

      {/* 第三方登入 */}
      <SocialLogin animationDelay="0.6s" />

      {/* 登入連結 */}
      <AuthLink
        text="Already have an account?"
        linkText="Sign In"
        href="/auth/login"
        animationDelay="0.7s"
      />
    </AuthLayout>
  );
}
