// frontend/app/auth/components/FloatingInput.tsx

"use client";
import React, { useState } from "react";

interface FloatingInputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  animationDelay?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  error,
  animationDelay = "0s",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <style jsx>{`
        .floating-input-container {
          position: relative;
          height: 48px;
          width: 100%;
        }

        .floating-input {
          width: 100%;
          height: 100%;
          border: 1px solid #4b5563;
          background: rgba(17, 24, 39, 0.8);
          border-radius: 8px;
          padding: 16px 16px 8px 16px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          color: white;
          position: relative;
          z-index: 1;
        }

        .floating-input.has-toggle {
          padding-right: 48px;
        }

        .floating-input:focus {
          border-color: rgb(168, 85, 247);
          background: rgba(17, 24, 39, 0.9);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .floating-input::placeholder {
          color: transparent;
        }

        .floating-label {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #9ca3af;
          background: transparent;
          padding: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .floating-input:focus + .floating-label,
        .floating-input.has-value + .floating-label {
          top: -10px;
          left: 12px;
          transform: translateY(0);
          font-size: 12px;
          font-weight: 500;
          color: rgb(168, 85, 247);
          background: rgba(17, 24, 39, 0.95);
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.95);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: #9ca3af;
          transition: all 0.2s ease;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .password-toggle:hover {
          color: rgb(168, 85, 247);
          background: rgba(168, 85, 247, 0.1);
        }

        .floating-input.error {
          border-color: #ef4444;
        }

        .floating-input.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .floating-input.error + .floating-label {
          color: #ef4444;
        }

        .floating-input.error:focus + .floating-label,
        .floating-input.error.has-value + .floating-label {
          top: -10px;
          background: rgba(17, 24, 39, 0.95);
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.95);
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          margin-left: 4px;
          min-height: 16px;
        }

        @keyframes fadeInUp {
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
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .eye-icon {
          width: 16px;
          height: 16px;
          transition: all 0.2s ease;
        }
      `}</style>

      <div className="animate-fade-in" style={{ animationDelay }}>
        <div className="floating-input-container">
          <input
            type={inputType}
            name={name}
            className={`floating-input ${value ? "has-value" : ""} ${
              error ? "error" : ""
            } ${isPasswordType ? "has-toggle" : ""}`}
            value={value}
            onChange={onChange}
            placeholder=" "
          />
          <label className="floating-label">{label}</label>

          {isPasswordType && (
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="eye-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="eye-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12c1.5 3 4.5 5 9 5s7.5-2 9-5M4 16l1.5-1.5M7 18l1-2M17 18l-1-2M20 16l-1.5-1.5"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        <div className="error-message">{error || ""}</div>
      </div>
    </>
  );
};

export default FloatingInput;
