// app/user/profile/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";
import { getFullAvatarUrl } from "@/lib/avatar";
import type { ProfileUpdateDTO } from "@/types/user.dto";

// 國家列表 ISO 3166
const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "DK", name: "Denmark" },
  { code: "EG", name: "Egypt" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NO", name: "Norway" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RU", name: "Russian Federation" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
];

// SVG Icons (UserTagIcon, MapPinIcon, LinkedinIcon, FileTextIcon, SaveIcon ...)
const UserTagIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#purpleGradient)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(168, 85, 247)" />
        <stop offset="100%" stopColor="rgb(236, 72, 153)" />
      </linearGradient>
    </defs>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#purpleGradient2)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="purpleGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(168, 85, 247)" />
        <stop offset="100%" stopColor="rgb(236, 72, 153)" />
      </linearGradient>
    </defs>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const LinkedinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#purpleGradient3)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="purpleGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(168, 85, 247)" />
        <stop offset="100%" stopColor="rgb(236, 72, 153)" />
      </linearGradient>
    </defs>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const FileTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#purpleGradient4)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="purpleGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgb(168, 85, 247)" />
        <stop offset="100%" stopColor="rgb(236, 72, 153)" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const SaveIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const ProfilePage = () => {
  // 從 AuthContext 獲取使用者資料與更新函式
  const { user, isLoading: authLoading, updateUser } = useAuth();

  const [isLoaded, setIsLoaded] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nickname: "",
    countryCode: "TW",
    linkedinUrl: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // 監聽全域 user 狀態：當 AuthContext 拿到資料後，自動填入表單
  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || "",
        countryCode: user.countryCode || "TW",
        linkedinUrl: user.linkedinUrl || "",
        bio: user.bio || "",
      });

      // 改用共用的 getFullAvatarUrl，傳入整個 user 物件
      if (user.avatarUrl) {
        setAvatarPreview(getFullAvatarUrl(user));
      }
      setTimeout(() => setIsLoaded(true), 300);
    }
  }, [user]);

  // 處理頭貼本地預覽 (不直接上傳)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Avatar file size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 儲存邏輯：成功後呼叫 updateUser 同步 Navbar
  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setErrorMessage("");
      let finalAvatarUrl = user.avatarUrl;

      // 1. 如果有選新圖，先上傳
      if (selectedFile) {
        try {
          const uploadRes = await userService.uploadAvatar(selectedFile);
          finalAvatarUrl = uploadRes.data.url;
        } catch (err) {
          setErrorMessage("Failed to upload avatar.");
          setIsSaving(false);
          return;
        }
      }

      // 2. 更新 Profile 資料
      const updateData: ProfileUpdateDTO = {
        nickname: formData.nickname || undefined,
        bio: formData.bio || undefined,
        countryCode: formData.countryCode || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        ...(selectedFile && { avatarUrl: finalAvatarUrl }),
      };

      await userService.updateProfile(updateData);

      // 3. 重要：更新全域 AuthContext，這會讓 Navbar 的頭像立刻改變
      updateUser({
        ...user,
        nickname: formData.nickname,
        avatarUrl: finalAvatarUrl,
      });

      setSuccessMessage("Profile saved successfully!");
      setSelectedFile(null);

      // 更新預覽為正式 URL（改用共用的 getFullAvatarUrl，傳入更新後的 user 物件）
      setAvatarPreview(
        getFullAvatarUrl({ ...user, avatarUrl: finalAvatarUrl }),
      );

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // 如果驗證資訊還在讀取中，顯示簡單的 Loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-gray-900">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(88, 28, 135, 0.2) 0%, rgba(17, 24, 39, 1) 50%, rgba(0, 0, 0, 1) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 pt-24 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
              {successMessage}
            </div>
          )}

          <div
            className={`bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 shadow-2xl transform transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mb-6 flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-4 border-purple-500/30 shadow-lg shadow-purple-500/20">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-white text-sm font-medium">Change</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isSaving}
                  className="hidden"
                />
              </div>
              {selectedFile && !successMessage && (
                <p className="mt-2 text-xs text-purple-400 animate-pulse">
                  New avatar selected (unsaved)
                </p>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <UserTagIcon /> Nickname
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <MapPinIcon /> Country
                </label>
                <div className="relative">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full px-4 pr-10 py-2.5 appearance-none bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                  >
                    {countries.map((country) => (
                      <option
                        key={country.code}
                        value={country.code}
                        className="bg-gray-900"
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
                    <svg
                      className="w-4 h-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <LinkedinIcon /> LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <FileTextIcon /> Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !user}
                  className="w-full group relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(236, 72, 153) 100%)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <SaveIcon />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
