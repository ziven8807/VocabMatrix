// app/components/navbar/MobileMenu.tsx

"use client";
import Link from "next/link";
import { getFullAvatarUrl } from "@/lib/avatar";

interface User {
  username: string;
  nickname?: string;
  avatarUrl: string | null;
}

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  isLoading: boolean;
  navItems: NavItem[];
  authLinks: NavItem[];
  onLogout: () => void;
  onClose: () => void;
}

export const MobileMenu = ({
  isOpen,
  user,
  isLoading,
  navItems,
  authLinks,
  onLogout,
  onClose,
}: MobileMenuProps) => {
  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-gray-900/95 backdrop-blur-sm border-t border-purple-600/30 ${
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-6 pb-6 space-y-2 pt-4">
        {/* 主要導覽連結 */}
        {navItems.map(({ label, href }, index) => (
          <Link
            key={href}
            href={href}
            className={`block text-gray-300 hover:text-purple-400 transition-all duration-300 py-2.5 transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: isOpen ? `${index * 70}ms` : "0ms" }}
            onClick={onClose}
          >
            {label}
          </Link>
        ))}

        <div className="pt-4 mt-2 border-t border-purple-600/30 space-y-2">
          {isLoading ? (
            <div className="h-10 w-full bg-gray-800 animate-pulse rounded" />
          ) : user ? (
            <>
              {/* 使用者簡介區塊 */}
              <div
                className={`flex items-center space-x-3 py-3 mb-2 transition-all duration-300 transform ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen ? `${navItems.length * 70}ms` : "0ms",
                }}
              >
                <img
                  src={getFullAvatarUrl(user)}
                  className="w-10 h-10 rounded-full border-2 border-purple-500/50 object-cover"
                  alt="avatar"
                />
                <div>
                  <p className="text-white text-sm font-bold">
                    {user.nickname || user.username}
                  </p>
                  <p className="text-purple-400 text-xs">@{user.username}</p>
                </div>
              </div>

              {/* 使用者功能選單 - 同步 UserDropdown 的項目 */}
              {[
                { label: "Profile", href: "/user/profile" },
                { label: "My Notebooks", href: "/notebooks" },
                { label: "Settings", href: "/settings" },
              ].map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-gray-300 py-2.5 hover:text-white transition-all duration-300 transform ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isOpen
                      ? `${(navItems.length + 1 + idx) * 70}ms`
                      : "0ms",
                  }}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={`block w-full text-left text-red-400 py-2.5 font-medium transition-all duration-300 transform ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen
                    ? `${(navItems.length + 4) * 70}ms`
                    : "0ms",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            /* 未登入狀態的按鈕 */
            authLinks.map(({ label, href }, index) => (
              <Link
                key={href}
                href={href}
                className={`block font-medium transition-all duration-300 transform ${
                  index === authLinks.length - 1
                    ? "w-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 rounded-lg text-white text-center shadow-lg shadow-purple-500/20"
                    : "text-gray-300 hover:text-white py-2.5"
                } ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen
                    ? `${(navItems.length + index) * 70}ms`
                    : "0ms",
                }}
                onClick={onClose}
              >
                {label}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
