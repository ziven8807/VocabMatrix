// frontend/src/app/components/toast/Toast.tsx

"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const themeConfig = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    borderColor: "border-emerald-500/50",
    accentColor: "bg-emerald-500",
    shadow: "shadow-emerald-900/20",
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-rose-400" />,
    borderColor: "border-rose-500/50",
    accentColor: "bg-rose-500",
    shadow: "shadow-rose-900/20",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    borderColor: "border-amber-500/50",
    accentColor: "bg-amber-500",
    shadow: "shadow-amber-900/20",
  },
  info: {
    icon: <Info className="w-5 h-5 text-violet-400" />,
    borderColor: "border-violet-500/50",
    accentColor: "bg-violet-500",
    shadow: "shadow-violet-900/20",
  },
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = themeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={`group relative flex items-center gap-4 px-4 py-3 min-w-[320px] max-w-md
        rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300
        ${config.borderColor} ${config.shadow}
        bg-slate-950/80`} // 深色背景，讓紫色網頁看起來更高級
    >
      {/* 左側彩色裝飾條：取代原本跑動的線條，安靜但有質感 */}
      <div
        className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${config.accentColor}`}
      />

      {/* 圖標 */}
      <div className="flex-shrink-0">{config.icon}</div>

      {/* 訊息內容 */}
      <div className="flex-1 text-sm font-medium text-slate-100 antialiased">
        {message}
      </div>

      {/* 關閉按鈕 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>

      {/* 進度條：隱藏式設計，只在底部淡淡地顯示 */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden rounded-b-xl">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`h-full opacity-40 ${config.accentColor}`}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
