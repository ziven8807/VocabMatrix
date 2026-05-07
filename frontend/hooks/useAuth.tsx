// src/hooks/useAuth.ts

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";
import { tokenManager } from "@/lib/tokenManager";

// 1. 完整定義使用者資料結構 (避免在其他頁面使用 any)
export interface User {
  username: string;
  nickname: string;
  avatarUrl: string;
  countryCode?: string;
  linkedinUrl?: string;
  bio?: string;
}

//  2. 定義 Context 的型別，包含新增的 updateUser
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void; // 新增此函式以供 Profile 頁面呼叫
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 初始化與刷新驗證狀態
   */
  const initAuth = useCallback(async () => {
    // --- 如果是 OAuth2 重導向頁面，跳過自動初始化，由頁面組件自行處理 ---
    if (
      typeof window !== "undefined" &&
      window.location.pathname.includes("/oauth2/redirect")
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.refresh();

      if (response.data.accessToken) {
        const { user: userData, accessToken } = response.data;

        tokenManager.setToken(accessToken);
        setUser(userData);

        // 緩存到 localStorage 以減少閃爍
        localStorage.setItem("user_cache", JSON.stringify(userData));
        Cookies.set("isLoggedIn", "true", { expires: 7, sameSite: "lax" });
      }
    } catch (error) {
      tokenManager.clearToken();
      setUser(null);
      localStorage.removeItem("user_cache");
      Cookies.remove("isLoggedIn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 組件掛載時執行初始化
  useEffect(() => {
    // 優先從快取讀取，讓 UI 感覺更快
    const cached = localStorage.getItem("user_cache");
    if (cached) {
      setUser(JSON.parse(cached));
    }
    initAuth();
  }, [initAuth]);

  /**
   * 登入處理
   */
  const login = (userData: User, token: string) => {
    tokenManager.setToken(token);
    setUser(userData);
    localStorage.setItem("user_cache", JSON.stringify(userData));
    Cookies.set("isLoggedIn", "true", { expires: 7, sameSite: "lax" });
  };

  /**
   * 3. 實作全域更新函式
   * 當 Profile 頁面存檔成功後，呼叫此函式同步全站狀態
   */
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_cache", JSON.stringify(userData));
  };

  /**
   * 登出處理
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenManager.clearToken();
      setUser(null);
      localStorage.removeItem("user_cache");
      Cookies.remove("isLoggedIn");
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 自定義 Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
