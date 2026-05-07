// app/components/navbar/UserDropdown.tsx

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getFullAvatarUrl } from "@/lib/avatar";

interface User {
  username: string;
  nickname?: string;
  avatarUrl: string | null;
}

export const UserDropdown = ({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const avatarSrc = getFullAvatarUrl(user);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none group flex items-center"
      >
        <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-r from-purple-600 to-pink-600 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
          <img
            key={avatarSrc}
            src={avatarSrc}
            alt="user avatar"
            className="w-full h-full rounded-full object-cover bg-gray-900 border-2 border-gray-900"
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.username,
              )}&background=6366f1&color=fff`;
            }}
          />
        </div>
      </button>

      <div
        className={`absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl transition-all duration-300 transform origin-top-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 border-b border-purple-500/10 bg-gradient-to-br from-purple-600/10 to-transparent rounded-t-xl">
          <p className="text-white font-semibold text-sm truncate">
            {user.nickname || user.username}
          </p>
          <p className="text-purple-400 text-xs truncate">@{user.username}</p>
        </div>

        <div className="py-2 px-1.5">
          <Link
            href="/user/profile"
            className="group flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5 mr-3 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </Link>

          <Link
            href="/notebooks"
            className="group flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5 mr-3 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
              <path d="M2 6h4" />
              <path d="M2 10h4" />
              <path d="M2 14h4" />
              <path d="M2 18h4" />
              <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
            </svg>
            My Notebooks
          </Link>

          <Link
            href="/settings"
            className="group flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5 mr-3 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </Link>

          <div className="my-1 border-t border-purple-500/10" />

          <button
            onClick={onLogout}
            className="group flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5 mr-3 text-red-400 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
