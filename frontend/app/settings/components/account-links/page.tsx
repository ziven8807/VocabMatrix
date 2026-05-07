// app/settings/components/account-links/page.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Facebook, PlusCircle } from "lucide-react";
import { useToast } from "@/app/components/toast/ToastProvider";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { tokenManager } from "@/lib/tokenManager";

interface LinkedProvider {
  providerName?: string;
  provider_name?: string;
  providerEmail?: string;
  provider_email?: string;
}

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const SUPPORTED_PROVIDERS = [
  { id: "google", name: "Google", icon: <GoogleIcon size={18} /> },
  { id: "facebook", name: "Facebook", icon: <Facebook size={20} /> },
];

export default function AccountLinksPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [dbLinks, setDbLinks] = useState<LinkedProvider[]>([]);
  const hasFetched = useRef<boolean>(false);
  const hasProcessedUrl = useRef<boolean>(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<LinkedProvider[]>("/user/account/links");
      setDbLinks(Array.isArray(response.data) ? response.data : []);
      hasFetched.current = true;
    } catch (error) {
      showToast("無法取得綁定資料", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (hasProcessedUrl.current) return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const message = params.get("message");

    if (status && message) {
      hasProcessedUrl.current = true;
      const timer = setTimeout(() => {
        showToast(
          decodeURIComponent(message),
          status === "error" ? "error" : "success",
        );
        if (status === "success") fetchLinks();
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showToast, fetchLinks]);

  const handleLink = (providerId: string) => {
    // 修正：從 tokenManager 取得 token
    const token = tokenManager.getToken();

    if (!token) {
      showToast("請先登入", "error");
      return;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

    console.log("Token:", token); // Debug 用
    window.location.href = `${backendUrl}/api/oauth2/authorization/${providerId}?linking=true&token=${encodeURIComponent(
      token,
    )}`;
  };

  const handleUnlink = async (providerId: string) => {
    if (!confirm(`確定要解除 ${providerId} 綁定嗎？`)) return;
    try {
      setLoading(true);
      await api.delete(`/user/account/links/${providerId}`);
      showToast("解除成功", "success");
      fetchLinks();
    } catch (error) {
      const axiosError = error as AxiosError;
      showToast((axiosError.response?.data as string) || "解除失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && !hasFetched.current) fetchLinks();
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, fetchLinks, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-purple-500/20 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-md z-10">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Social Links
          </h1>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-tighter">
            Manage your connected platforms
          </p>
        </header>

        <div className="space-y-4">
          {SUPPORTED_PROVIDERS.map((provider) => {
            const linkedData = dbLinks.find((link) => {
              const name = link?.providerName || link?.provider_name;
              return name?.toLowerCase() === provider.id.toLowerCase();
            });

            const isLinked = !!linkedData;
            const displayEmail =
              linkedData?.providerEmail || linkedData?.provider_email;

            return (
              <div
                key={provider.id}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${
                  isLinked
                    ? "border-pink-500/40 bg-white/[0.04] shadow-[0_0_20px_rgba(236,72,153,0.05)]"
                    : "border-white/5 bg-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      isLinked
                        ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                        : "bg-white/5 text-gray-600"
                    }`}
                  >
                    {provider.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100">{provider.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {isLinked ? displayEmail || "CONNECTED" : "DISCONNECTED"}
                    </p>
                  </div>
                </div>

                {isLinked ? (
                  <button
                    onClick={() => handleUnlink(provider.id)}
                    disabled={loading}
                    className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleLink(provider.id)}
                    disabled={loading}
                    className="p-3 text-pink-500/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] active:scale-90 group"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <PlusCircle
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
