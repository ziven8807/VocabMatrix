// frontend/app/auth/components/AuthLayout.tsx

"use client";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700&display=swap");

        .auth-container {
          font-family: "Inter", sans-serif;
          font-weight: 300;
          background: #0a0a0a;
        }

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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .glass-card {
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          animation: fadeIn 1s ease-out;
          box-shadow: 0 25px 50px -12px rgba(168, 85, 247, 0.15);
        }

        .gradient-border {
          background: linear-gradient(
            135deg,
            rgb(168, 85, 247),
            rgb(236, 72, 153)
          );
          padding: 1px;
          border-radius: 8px;
        }

        .gradient-border-inner {
          background: rgba(17, 24, 39, 0.95);
          border-radius: 7px;
        }

        h1 {
          font-weight: 700;
        }

        p {
          font-weight: 300;
        }
      `}</style>

      <div className="auth-container min-h-screen text-white relative overflow-hidden pt-24">
        {/* 動態背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-black" />

        {/* 主要內容 */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-6rem)] p-4">
          <div className="glass-card w-full max-w-md rounded-xl p-8 shadow-2xl">
            {/* 標題 */}
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
