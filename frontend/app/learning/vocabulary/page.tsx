// frontend/src/app/learning/vocabulary/page.tsx

// 詞彙主入口頁：提供 General 單字與 Topics 單字兩個入口按鈕

"use client";

import { useRouter } from "next/navigation";

export default function VocabularyLandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ===== 頁面標題 ===== */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            VOCABULARY <span className="text-purple-500">MATRIX</span>
          </h1>
          <p className="text-gray-500">
            Master 95% of IELTS topics with our logic matrix.
          </p>
        </div>

        {/* ===== 兩個入口按鈕：General / Topics ===== */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
          {/* --- General 按鈕：點擊導向 /learning/vocabulary/general --- */}
          <button
            onClick={() => router.push("/learning/vocabulary/general")}
            className="group relative w-full sm:w-72 h-64 bg-gray-900 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.15)]"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-600/10 to-transparent" />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/5 rotate-45 group-hover:rotate-[60deg] transition-transform duration-700"
              style={{ transform: "translate(-50%, -50%) rotate(45deg)" }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 p-6">
              <div className="w-16 h-16 flex items-center justify-center border border-purple-500/30 rounded-2xl group-hover:bg-purple-600/20 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white tracking-tight mb-1">
                  General
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Core vocabulary used across all IELTS topics
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500/70 group-hover:text-purple-400 transition-colors">
                Browse →
              </span>
            </div>
          </button>

          {/* --- Topics 按鈕：點擊導向 /learning/vocabulary/topics --- */}
          <button
            onClick={() => router.push("/learning/vocabulary/topics")}
            className="group relative w-full sm:w-72 h-64 bg-gray-900 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.15)]"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-600/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-40 h-40 border border-white/5 rounded-tl-[80px] group-hover:scale-110 transition-transform duration-700 origin-bottom-right" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 p-6">
              <div className="w-16 h-16 flex items-center justify-center border border-purple-500/30 rounded-2xl group-hover:bg-purple-600/20 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white tracking-tight mb-1">
                  Topics
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Category-specific words for Education, Tech, Health & more
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500/70 group-hover:text-purple-400 transition-colors">
                Browse →
              </span>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
