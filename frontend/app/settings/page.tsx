// frontend/app/settings/page.tsx

"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Link as LinkIcon,
  TableOfContents,
} from "lucide-react";
import { useToast } from "@/app/components/toast/ToastProvider";

// --- 型別定義 ---
type SectionView = "main" | "password" | "account";

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

interface SubMenuButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

// 內部組件：負責處理設定頁的邏輯與 UI
const SettingsContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [view, setView] = useState<SectionView>("main");

  // 使用 useRef 確保在一次頁面生命週期中，Toast 訊息只會觸發一次
  // 這可以徹底解決 "Maximum update depth exceeded" 的無限迴圈問題
  const hasNotified = useRef(false);

  useEffect(() => {
    const error = searchParams.get("error");

    // 判斷條件：網址有錯誤參數，且在此次載入中尚未彈出過通知
    if (error === "no_password" && !hasNotified.current) {
      // 1. 立即標記為已通知
      hasNotified.current = true;

      // 2. 觸發 Toast 訊息
      showToast(
        "Third-party accounts (Google) do not have a local password to change.",
        "error",
      );

      // 3. 使用 setTimeout 處理 UI 狀態更新，避免與目前的渲染週期衝突 (Cascading Renders)
      const timer = setTimeout(() => {
        // 自動切換到密碼分頁
        setView("password");

        // 清理網址參數，讓網址變回乾淨的 /settings
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams, showToast]);

  const navigateToChangePassword = (): void => {
    router.push("/settings/components/password-change");
  };

  const navigateToAccountLinks = (): void => {
    router.push("/settings/components/account-links");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-black -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative h-[400px]">
        {/* === 主選單 (Main View) === */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            view === "main"
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12 pointer-events-none"
          }`}
        >
          <header className="mb-10 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-400 font-light text-sm tracking-wide">
              Security and account preferences
            </p>
          </header>

          <div className="space-y-4">
            <MenuButton
              icon={<Lock size={22} />}
              title="Password"
              onClick={() => setView("password")}
            />
            <MenuButton
              icon={<TableOfContents size={22} />}
              title="Accounts"
              onClick={() => setView("account")}
            />
          </div>
        </div>

        {/* === Password 子選單 === */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            view === "password"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          <div className="mb-8">
            <button
              onClick={() => setView("main")}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs tracking-widest uppercase mb-4 group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-100">
              Password Settings
            </h2>
          </div>

          <div className="space-y-4">
            <SubMenuButton
              icon={<KeyRound size={20} />}
              title="Change Password"
              description="Protect your account with a new password"
              onClick={navigateToChangePassword}
            />
          </div>
        </div>

        {/* === Account Links 子選單 === */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            view === "account"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          <div className="mb-8">
            <button
              onClick={() => setView("main")}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs tracking-widest uppercase mb-4 group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-100">
              Account Settings
            </h2>
          </div>

          <div className="space-y-4">
            <SubMenuButton
              icon={<LinkIcon size={20} />}
              title="Connected Accounts"
              description="Link or unlink your Google/GitHub accounts"
              onClick={navigateToAccountLinks}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// --- 主頁面導出 (使用 Suspense 包裹以支援 useSearchParams) ---
export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

// --- 介面元件 ---
const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.06] transition-all duration-300 flex items-center justify-between group shadow-xl"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <span className="text-lg font-medium tracking-wide">{title}</span>
    </div>
    <ChevronRight
      size={20}
      className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all"
    />
  </button>
);

const SubMenuButton: React.FC<SubMenuButtonProps> = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full p-5 rounded-2xl bg-gradient-to-r from-purple-600/10 to-pink-600/5 border border-purple-500/20 hover:border-purple-500/50 transition-all flex items-center gap-4 group text-left shadow-lg"
  >
    <div className="p-3 rounded-full bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-110">
      {icon}
    </div>
    <div>
      <div className="font-bold text-gray-100 group-hover:text-purple-300 transition-colors">
        {title}
      </div>
      <div className="text-xs text-gray-400 font-light">{description}</div>
    </div>
  </button>
);
