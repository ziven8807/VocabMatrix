"use client";

import { useRouter } from "next/navigation";
import React from "react";

// ─── SVG Icons Component ──────────────────────────────────────────────────────
const Icons = {
  Location: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Request: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
  ),
  Idea: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6m-6 4h6m-7.5-6.5a6.5 6.5 0 1 1 9 0 6 6 0 0 0-3 5.5h-3a6 6 0 0 0-3-5.5z"></path>
    </svg>
  ),
  Command: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-1.37l-4.14 4.14a1 1 0 0 1-1.42 0l-4.14-4.14H5a3 3 0 0 1-3-3 3 3 0 0 1 3-3z"></path>
    </svg>
  ),
  Alert: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  Sparkles: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.91 5.82L20 10.73l-4.73 4.14L16.36 21 12 17.27 7.64 21l1.09-6.13L4 10.73l6.09-1.91L12 3z"></path>
    </svg>
  ),
  Mail: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
};

// ─── Types ───────────────────────────────────────────────────────────────────

type Example = {
  sentence: string;
  highlight: string;
  note: string;
};

type ImperativeRule = {
  id: string;
  title: string;
  symbol: string;
  color: string;
  description: string;
  usage: { label: string; examples: Example[] }[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const IMPERATIVE_RULES: ImperativeRule[] = [
  {
    id: "basic",
    title: "基礎結構 (Basic)",
    symbol: "V",
    color: "#fbbf24",
    description: "省略主詞 You，直接以原形動詞開頭，表達直接的動作要求。",
    usage: [
      {
        label: "肯定式",
        examples: [
          {
            sentence: "Close the door.",
            highlight: "Close",
            note: "意為 (You) close the door.",
          },
          {
            sentence: "Be quiet in the library.",
            highlight: "Be",
            note: "Be 動詞也要用原形",
          },
        ],
      },
      {
        label: "否定式",
        examples: [
          {
            sentence: "Don’t forget to call me.",
            highlight: "Don’t forget",
            note: "使用 Don't + 原形動詞",
          },
          {
            sentence: "Never give up.",
            highlight: "Never",
            note: "Never 可加強語氣",
          },
        ],
      },
    ],
  },
  {
    id: "causative",
    title: "使役動詞 (Causative)",
    symbol: "C",
    color: "#a78bfa", // 紫色
    description: "透過使役動詞表達「讓、叫、使」他人去做某事，具備祈使功能。",
    usage: [
      {
        label: "讓/要求他人",
        examples: [
          {
            sentence: "Have the maid clean the room.",
            highlight: "Have",
            note: "要求某人完成某項任務",
          },
          {
            sentence: "Let the teacher explain the lesson.",
            highlight: "Let",
            note: "允許或讓某事發生",
          },
        ],
      },
      {
        label: "句型參考",
        examples: [
          {
            sentence: "Make him do his homework.",
            highlight: "Make",
            note: "強制性的使役口吻",
          },
          {
            sentence: "Help me carry this bag.",
            highlight: "Help",
            note: "Help 後可接原形或 to V",
          },
        ],
      },
    ],
  },
];

const SCENARIOS = [
  { label: "指示", icon: <Icons.Location /> },
  { label: "請求", icon: <Icons.Request /> },
  { label: "建議", icon: <Icons.Idea /> },
  { label: "命令", icon: <Icons.Command /> },
  { label: "警告", icon: <Icons.Alert /> },
  { label: "祝福", icon: <Icons.Sparkles /> },
  { label: "邀請", icon: <Icons.Mail /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ImperativesPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-25px, 30px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
        {/* 背景裝飾 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(167,139,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #a78bfa08 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "float 15s ease-in-out infinite",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 text-sm text-gray-600 font-mono mb-8"
            style={{ animation: "fadeUp 0.4s ease both" }}
          >
            <span
              className="hover:text-gray-400 cursor-pointer transition-colors"
              onClick={() => router.push("/learning")}
            >
              Learning
            </span>
            <span>/</span>
            <span
              className="hover:text-gray-400 cursor-pointer transition-colors"
              onClick={() => router.push("/learning/grammar")}
            >
              Grammar
            </span>
            <span>/</span>
            <span className="text-violet-400">Imperatives</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              The <span className="text-violet-400">Imperative</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              祈使句是溝通中最直接的橋樑。
              <span className="text-white/70 ml-1">
                它省略了那個「你」，因為訊息的箭頭早已筆直地指向了對象。
              </span>
            </p>
          </div>

          {/* Scenarios Grid (Updated with SVG) */}
          <div
            className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.15s" }}
          >
            {SCENARIOS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] group hover:bg-violet-500/10 hover:border-violet-500/20 transition-all cursor-default"
              >
                <span className="text-gray-500 group-hover:text-violet-400 transition-colors mb-2">
                  {s.icon}
                </span>
                <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Logic Tip */}
            <div
              className="p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20"
              style={{ animation: "fadeUp 0.4s ease both 0.2s" }}
            >
              <h4 className="text-violet-400 font-black text-xs uppercase tracking-[0.2em] mb-4">
                Core Concept
              </h4>
              <p className="text-xl text-white font-medium leading-relaxed">
                「在祈使句中，主詞 <span className="text-violet-400">You</span>{" "}
                總是存在，只是被藏進了括號裡。」
              </p>
            </div>

            {/* Rules Cards */}
            <div className="space-y-6">
              {IMPERATIVE_RULES.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden"
                  style={{
                    animation: "fadeUp 0.4s ease both",
                    animationDelay: `${0.3 + idx * 0.1}s`,
                  }}
                >
                  <div className="p-6 border-b border-white/[0.04] flex items-center gap-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
                      style={{
                        background: `${rule.color}15`,
                        color: rule.color,
                      }}
                    >
                      {rule.symbol}
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl">
                        {rule.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {rule.usage.map((u, i) => (
                      <div key={i} className="space-y-3">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.15em]">
                          {u.label}
                        </p>
                        {u.examples.map((e, ei) => (
                          <div
                            key={ei}
                            className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition-colors"
                          >
                            <p className="text-white text-sm">
                              <span
                                style={{ color: rule.color }}
                                className="font-bold"
                              >
                                {e.highlight}
                              </span>
                              {e.sentence.replace(e.highlight, "")}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-2 font-medium">
                              {e.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
