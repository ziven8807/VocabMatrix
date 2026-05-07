// frontend/services/userService.ts

import api from "@/lib/axios";
import type {
  PasswordChangeRequestDTO,
  UserProfileResponse,
  ProfileUpdateDTO,
} from "@/types/user.dto";

/**
 * 使用者資料與帳戶安全相關 API 服務
 */
export const userService = {
  /**
   * 1. 修改密碼 (優先處理)
   * 需在 Header 帶入 Access Token
   */
  changePassword: (data: PasswordChangeRequestDTO) =>
    api.post("/user/password/change", data),

  /**
   * 2. 獲取個人資料
   */
  getProfile: () => api.get<UserProfileResponse>("/user/profile"),

  /**
   * 3. 更新個人資料 (暱稱、Bio、LinkedIn 等文字資訊)
   */
  updateProfile: (data: ProfileUpdateDTO) =>
    api.patch<UserProfileResponse>("/user/profile", data),

  /**
   * 4. 上傳頭像實體檔案
   * 回傳該檔案在伺服器上的存取 URL
   */
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<{ url: string }>("/user/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
