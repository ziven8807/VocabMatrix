// frontend/src/app/components/toast/ToastProvider.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastType } from "./Toast";
import { AnimatePresence } from "framer-motion";

interface ToastContextType {
  showToast: (message: string | { message: string }, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: ToastType }[]
  >([]);

  const showToast = (
    message: string | { message: string },
    type: ToastType = "info",
  ) => {
    const id = Date.now();

    // 確保 message 是字串
    const finalMessage =
      typeof message === "string" ? message : message.message;

    setToasts((prev) => [...prev, { id, message: finalMessage, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-[9999]">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              type={t.type}
              onClose={() => removeToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
