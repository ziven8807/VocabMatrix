// app/settings/components/delete-account/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Undo2,
  Loader2,
} from "lucide-react";

const DeleteAccountPage: React.FC = () => {
  const router = useRouter();

  // 狀態管理
  const [isPendingDeletion, setIsPendingDeletion] = useState(false); // 模擬從後端獲取的帳號狀態
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 處理：申請刪除 (POST /api/user/account/delete-request)
  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 這裡對接你的 API
      // const res = await fetch("/api/user/account/delete-request", { ... });

      // 模擬成功
      setTimeout(() => {
        setIsPendingDeletion(true);
        setIsLoading(false);
        setMessage({
          type: "success",
          text: "申請成功，帳號進入 30 天冷卻期。",
        });
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: "密碼錯誤或系統繁忙。" });
      setIsLoading(false);
    }
  };

  // 處理：撤銷刪除 (POST /api/user/account/cancel-deletion)
  const handleCancelDeletion = async () => {
    setIsLoading(true);
    try {
      // 這裡對接你的 API
      // await fetch("/api/user/account/cancel-deletion", { method: "POST" });

      setTimeout(() => {
        setIsPendingDeletion(false);
        setIsLoading(false);
        setMessage({
          type: "success",
          text: "已成功撤銷刪除申請，帳號已恢復正常。",
        });
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: "操作失敗，請稍後再試。" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-gray-900 to-black -z-10" />

      <div className="w-full max-w-md animate-fade-in">
        {/* 返回按鈕 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs tracking-widest uppercase mb-8 group"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Settings
        </button>

        {/* 狀態切換渲染 */}
        {!isPendingDeletion ? (
          <section className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 text-red-400">
              <ShieldAlert size={32} />
              <h1 className="text-2xl font-bold">Delete Account</h1>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-sm text-red-200 leading-relaxed">
              <p className="flex items-start gap-2">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                警告：帳號刪除後將進入 30
                天冷卻期。期間內你可以隨時撤銷申請，否則 30
                天後所有資料將永久移除。
              </p>
            </div>

            <form onSubmit={handleRequestDeletion} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all h-24 resize-none"
                  placeholder="Tell us why you're leaving..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Request Account Deletion"
                )}
              </button>
            </form>
          </section>
        ) : (
          <section className="bg-white/[0.03] border border-purple-500/20 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-purple-400 animate-pulse" />
            </div>

            <h1 className="text-2xl font-bold mb-3">Deletion Pending</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              您的帳號目前處於刪除冷卻期。系統將於{" "}
              <span className="text-white font-bold">30 天後</span>{" "}
              自動清除您的所有數據。
            </p>

            <button
              onClick={handleCancelDeletion}
              disabled={isLoading}
              className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Undo2
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Cancel Deletion Request
                </>
              )}
            </button>
          </section>
        )}

        {/* 提示訊息 */}
        {message.text && (
          <div
            className={`mt-6 text-center text-sm ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
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
      `}</style>
    </div>
  );
};

export default DeleteAccountPage;
