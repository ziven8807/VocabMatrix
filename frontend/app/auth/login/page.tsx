// frontend/app/auth/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useToast } from "@/app/components/toast/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequestDTO } from "@/types/auth.dto";
import axios from "axios";

// 引入共用UI元件
import AuthLayout from "@/app/auth/components/AuthLayout";
import FloatingInput from "@/app/auth/components/FloatingInput";
import AuthButton from "@/app/auth/components/AuthButton";
import SocialLogin from "@/app/auth/components/SocialLogin";
import AuthLink from "@/app/auth/components/AuthLink";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequestDTO>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginRequestDTO, string>>
  >({});

  // 處理輸入欄位變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除該欄位的錯誤訊息
    if (errors[name as keyof LoginRequestDTO]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 表單驗證邏輯
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginRequestDTO, string>> = {};

    // identifier 可以是 username 或 email，所以只檢查是否為空
    if (!formData.identifier) {
      newErrors.identifier = "Please enter your username or email";
    } else if (formData.identifier.length < 3) {
      newErrors.identifier = "Must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理提交登入
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 呼叫 API 服務
      const response = await authService.login(formData);

      // 檢查後端回傳資料
      if (response.data.accessToken && response.data.user) {
        // 關鍵步驟：同步狀態到 AuthContext
        // 這會自動處理 tokenManager.setToken 並讓 Navbar 顯示頭像
        login(response.data.user, response.data.accessToken);

        showToast("Login successful! Welcome back", "success");

        // 清空表單並導向首頁
        setFormData({ identifier: "", password: "" });

        // 給予一點點延遲讓使用者看到成功訊息與 Navbar 變化
        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    } catch (error) {
      let message = "Login failed, please try again";

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;

        if (status === 401) {
          message = "Invalid username/email or password";
        } else if (serverMessage) {
          message = serverMessage;
        }
      }

      showToast(message, "error");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your journey"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <FloatingInput
          type="text"
          name="identifier"
          label="Username or Email"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          animationDelay="0.1s"
        />

        <FloatingInput
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          animationDelay="0.2s"
        />

        <div
          className="text-right animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="/auth/forgot-password"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <AuthButton
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Signing in..."
          animationDelay="0.4s"
        >
          Sign In
        </AuthButton>
      </form>

      <SocialLogin animationDelay="0.5s" />

      <AuthLink
        text="Don't have an account?"
        linkText="Sign Up"
        href="/auth/register"
        animationDelay="0.6s"
      />
    </AuthLayout>
  );
}
