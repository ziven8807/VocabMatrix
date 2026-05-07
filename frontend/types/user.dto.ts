// src/types/user.dto.ts

/**
 * 修改密碼請求 (對應後端 PasswordChangeRequest)
 */
export interface PasswordChangeRequestDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 使用者個人檔案回應 (對應後端 UserProfileResponse)
 */
export interface UserProfileResponse {
  username: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  countryCode: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  hasPassword: boolean; // 用於判斷是否為 OAuth2 帳號
  status: string; // "ACTIVE", "INACTIVE" 等
}

/**
 * 更新個人檔案請求 (對應後端 ProfileUpdateDTO)
 */
export interface ProfileUpdateDTO {
  nickname?: string;
  bio?: string;
  countryCode?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
}
