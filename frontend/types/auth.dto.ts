// src/types/auth.dto.ts

// 註冊時要送給後端的資料
export interface RegisterRequestDTO {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// 使用者資料格式
export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  status: string;
  emailVerified: boolean;
  hasPassword: boolean;
  createdAt: string;
}

// 登入時要送給後端的資料
export interface LoginRequestDTO {
  identifier: string; // 對應後端的 identifier
  password: string;
}

// 後端登入成功後返回的資料
export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDTO;
}

export interface PasswordForgotRequestDTO {
  email: string;
}

// 重置密碼：提交新密碼
export interface PasswordResetRequestDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
