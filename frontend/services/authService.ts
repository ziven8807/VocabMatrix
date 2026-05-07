// frontend/services/authService.ts

import api from "@/lib/axios";
import type {
  RegisterRequestDTO,
  LoginRequestDTO,
  UserResponseDTO,
  LoginResponseDTO,
  PasswordForgotRequestDTO,
  PasswordResetRequestDTO,
} from "@/types/auth.dto";

/**
 * 認證相關 API 服務
 * 統一管理所有認證相關的 API 請求
 */
export const authService = {
  /**
   * 使用者註冊
   * @param data - 註冊表單資料 (email, username, password, confirmPassword)
   * @returns 註冊成功後的使用者資訊
   */
  register: (data: RegisterRequestDTO) =>
    api.post<UserResponseDTO>("/auth/register", data),

  /**
   * 重新發送驗證信
   * POST /api/auth/resend-registration-email
   */
  resendVerificationEmail: (email: string) =>
    api.post("/auth/resend-registration-email", { email }),

  /**
   * 使用者登入
   * @param data - 登入表單資料 (identifier: email 或 username, password)
   * @returns accessToken, refreshToken 和使用者資訊
   */
  login: (data: LoginRequestDTO) =>
    api.post<LoginResponseDTO>("/auth/login", data),

  /**
   * 刷新 Token 並獲取使用者資訊
   * 瀏覽器會自動帶上 HttpOnly 的 refreshToken Cookie
   * @returns 新的 accessToken 和使用者資訊
   */
  refresh: () => api.post<LoginResponseDTO>("/auth/refresh"), // 這裡會對應後端的 Refresh 端點

  /**
   * 使用者登出
   * 清除後端的 refreshToken (如果存在 HttpOnly Cookie)
   */
  logout: () => api.post("/auth/logout"),

  /**
   * 忘記密碼：發送重置郵件
   * POST /api/auth/forgot-password
   */
  forgotPassword: (data: PasswordForgotRequestDTO) =>
    api.post("/auth/forgot-password", data),

  /**
   * 重置密碼：使用 Token 設定新密碼
   * POST /api/auth/reset-password
   */
  resetPassword: (data: PasswordResetRequestDTO) =>
    api.post("/auth/reset-password", data),

  /**
   * 獲取目前登入的使用者資訊
   * @param token - 可選。在 OAuth 重導向流程中，因為 token 還沒存入 localStorage，需要手動傳入
   */
  getCurrentUser: async (token?: string) => {
    // 這裡統一名稱為 api (對應你 import 的名稱)
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    return api.get<UserResponseDTO>("/auth/me", config);
  },
};
