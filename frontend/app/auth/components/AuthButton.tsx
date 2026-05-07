// frontend/app/auth/components/AuthButton.tsx

"use client";
import React from "react";

interface AuthButtonProps {
  onClick?: () => void;
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  animationDelay?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  isLoading,
  loadingText,
  children,
  animationDelay = "0s",
}) => {
  return (
    <>
      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="mt-6 animate-fade-in" style={{ animationDelay }}>
        <button
          onClick={onClick}
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-base cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              <span className="ml-2">{loadingText}</span>
            </>
          ) : (
            children
          )}
        </button>
      </div>
    </>
  );
};

export default AuthButton;
