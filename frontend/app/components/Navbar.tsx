// src/app/components/Navbar.tsx

"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { UserDropdown } from "./navbar/UserDropdown";
import { MobileMenu } from "./navbar/MobileMenu";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logoText?: string;
  navItems?: NavItem[];
  authLinks?: NavItem[];
}

export default function Navbar({
  logoText = "VocabMatrix",
  navItems = [
    { label: "Contest", href: "/contest" },
    { label: "Rank", href: "/rank" },
    { label: "Learning", href: "/learning" },
  ],
  authLinks = [
    { label: "Sign In", href: "/auth/login" },
    { label: "Sign Up", href: "/auth/register" },
  ],
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-purple-600/50 shadow-lg shadow-purple-500/10 bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">&lt;/&gt;</span>
          </div>
          <span className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            {logoText}
          </span>
        </Link>

        {/* 桌機版內容 */}
        <div className="hidden md:flex items-center justify-between flex-1">
          <div className="flex items-center space-x-8 ml-12">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
            ) : user ? (
              <UserDropdown user={user} onLogout={logout} />
            ) : (
              authLinks.map(({ label, href }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    index === authLinks.length - 1
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded font-medium transition-all duration-300 transform hover:scale-105 text-white"
                      : "text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                  }
                >
                  {label}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 手機版漢堡按鈕 */}
        <button
          className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-6 relative flex flex-col justify-center items-center">
            <span
              className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* 呼叫獨立的手機版選單組件 */}
      <MobileMenu
        isOpen={isMenuOpen}
        user={user}
        isLoading={isLoading}
        navItems={navItems}
        authLinks={authLinks}
        onLogout={logout}
        onClose={() => setIsMenuOpen(false)}
      />
    </nav>
  );
}
