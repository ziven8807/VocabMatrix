// frontend/app/auth/components/AuthLink.tsx

"use client";
import React from "react";
import Link from "next/link";

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
  animationDelay?: string;
}

const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  linkText,
  href,
  animationDelay = "0s",
}) => {
  return (
    <div
      className="mt-6 text-center text-sm text-gray-400 animate-fade-in"
      style={{
        animationDelay,
        animationFillMode: "both", // 確保動畫結束後保持顯示
      }}
    >
      {text}{" "}
      <Link
        href={href}
        className="relative font-medium text-purple-400 transition-all duration-300 hover:text-purple-300 group inline-block"
      >
        {linkText}

        {/* 這就是原本 ::after 的漸層下劃線效果 */}
        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
      </Link>
      {/* 依然保留原本的動畫 Keyframes 定義，放在全域或外部 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default AuthLink;
