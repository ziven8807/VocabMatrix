// frontend/src/app/contest/page.tsx

"use client";

import { useRouter } from "next/navigation";

// ── SVG：鍵盤圖示（Spell Matrix 用）──
const KeyboardIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <rect
      x="4"
      y="12"
      width="40"
      height="26"
      rx="4"
      fill="#a855f7"
      fillOpacity="0.15"
      stroke="#a855f7"
      strokeWidth="2"
    />
    {/* 第一排按鍵 */}
    <rect
      x="9"
      y="18"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="16"
      y="18"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="23"
      y="18"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="30"
      y="18"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    {/* 第二排按鍵 */}
    <rect
      x="9"
      y="24"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="16"
      y="24"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="23"
      y="24"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    <rect
      x="30"
      y="24"
      width="5"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
    {/* 空白鍵 */}
    <rect
      x="14"
      y="30"
      width="20"
      height="4"
      rx="1"
      fill="#a855f7"
      fillOpacity="0.5"
    />
  </svg>
);

// ── SVG：鎖頭圖示（即將推出的功能用）──
const LockIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <rect
      x="10"
      y="22"
      width="28"
      height="20"
      rx="4"
      fill="#374151"
      stroke="#4b5563"
      strokeWidth="2"
    />
    <path
      d="M16 22v-6a8 8 0 0116 0v6"
      stroke="#4b5563"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="32" r="3" fill="#4b5563" />
    <path d="M24 35v3" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── SVG：右箭頭（按鈕用）──
const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path
      d="M4 10h12M12 6l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ContestPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            CONTEST
          </h1>
          <p className="text-gray-500">
            Test your vocabulary. Compete with others.
          </p>
        </div>

        {/* 遊戲卡片列表 */}
        <div className="space-y-4">
          {/* Spell Matrix（可點擊）*/}
          <button
            onClick={() => router.push("/contest/quiz")}
            className="w-full group bg-gray-900/50 border border-white/10 hover:border-purple-500/50 rounded-3xl p-6 text-left transition-all duration-200 hover:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <KeyboardIcon />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl mb-1">
                    Spell Matrix
                  </h2>
                  <p className="text-gray-500 text-sm">
                    10 questions · 30 sec each · Spelling challenge
                  </p>
                </div>
              </div>
              {/* 右箭頭，hover 時往右移 */}
              <div className="text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                <ArrowIcon />
              </div>
            </div>
          </button>

          {/* 即將推出的功能（灰色不可點）*/}
          {[
            {
              title: "Word Match",
              desc: "Match words to their definitions against the clock",
            },
            {
              title: "Fill in the Blank",
              desc: "Complete sentences with the correct vocabulary",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="w-full bg-gray-900/30 border border-white/5 rounded-3xl p-6 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <LockIcon />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-gray-400 font-black text-xl">
                      {item.title}
                    </h2>
                    <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-500 border border-gray-700 rounded-full font-bold uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
