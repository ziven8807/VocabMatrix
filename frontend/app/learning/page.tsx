// frontend/app/learning/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- 粒子背景效果 ---
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 網格線 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #a855f7 1px, transparent 1px),
            linear-gradient(to bottom, #a855f7 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* 光暈球 */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #9333ea 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* 掃描線動畫 */}
      <div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{
          background:
            "linear-gradient(to right, transparent, #a855f7, transparent)",
          animation: "scanline 6s linear infinite",
          top: "0%",
        }}
      />
    </div>
  );
}

// --- 路徑圖標 ---
const VocabIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="8"
      width="36"
      height="32"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="14"
      y1="18"
      x2="34"
      y2="18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="24"
      x2="34"
      y2="24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="30"
      x2="26"
      y2="30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="36"
      cy="30"
      r="4"
      fill="currentColor"
      fillOpacity="0.3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="39"
      y1="33"
      x2="42"
      y2="36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const GrammarIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 38L20 10L32 38"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="28"
      x2="28"
      y2="28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="34"
      y1="18"
      x2="34"
      y2="38"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M34 18C34 18 37 14 40 18C43 22 40 26 34 26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M34 26C40 26 43 30 40 34C37 38 34 38 34 38"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// --- 統計數據 (裝飾用) ---
const VOCAB_STATS = [
  { label: "CATEGORIES", value: "10" },
  { label: "WORDS", value: "2,400+" },
  { label: "IELTS COVERAGE", value: "95%" },
];

const GRAMMAR_STATS = [
  { label: "TOPICS", value: "12" },
  { label: "EXERCISES", value: "300+" },
  { label: "DIFFICULTY", value: "3 LVL" },
];

// --- 導航卡片 ---
function LearningCard({
  title,
  subtitle,
  description,
  path,
  icon,
  stats,
  accentColor,
  delay,
  tags,
}: {
  title: string;
  subtitle: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  stats: { label: string; value: string }[];
  accentColor: string;
  delay: string;
  tags: string[];
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer"
      style={{ animationDelay: delay, animation: "fadeSlideUp 0.7s ease both" }}
      onClick={() => router.push(path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 外框光暈 */}
      <div
        className="absolute -inset-px rounded-3xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentColor}40, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* 卡片主體 */}
      <div
        className="relative rounded-3xl border overflow-hidden transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(135deg, #111111, #0e0e1a)"
            : "#0d0d0d",
          borderColor: hovered ? `${accentColor}60` : "rgba(255,255,255,0.06)",
          boxShadow: hovered
            ? `0 0 60px ${accentColor}20, 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 ${accentColor}20`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* 頂部掃描線 */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            opacity: hovered ? 1 : 0.3,
          }}
        />

        <div className="p-10">
          {/* 圖標 + 標籤行 */}
          <div className="flex items-start justify-between mb-8">
            <div
              className="p-4 rounded-2xl transition-all duration-300"
              style={{
                background: hovered
                  ? `${accentColor}20`
                  : "rgba(255,255,255,0.04)",
                color: hovered ? accentColor : "#6b7280",
              }}
            >
              {icon}
            </div>

            {/* 標籤 */}
            <div className="flex flex-col gap-2 items-end">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border"
                  style={{
                    borderColor: `${accentColor}30`,
                    color: accentColor,
                    background: `${accentColor}10`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 標題 */}
          <div className="mb-6">
            <p
              className="text-xs font-bold tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
              style={{ color: hovered ? accentColor : "#4b5563" }}
            >
              {subtitle}
            </p>
            <h2
              className="text-5xl font-black tracking-tight text-white leading-none transition-all duration-300"
              style={{
                textShadow: hovered ? `0 0 40px ${accentColor}40` : "none",
              }}
            >
              {title}
            </h2>
          </div>

          {/* 描述 */}
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
            {description}
          </p>

          {/* 統計數據 */}
          <div className="flex gap-6 mb-8 pt-6 border-t border-white/5">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl font-black tracking-tight transition-colors duration-300"
                  style={{ color: hovered ? accentColor : "white" }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA 按鈕 */}
          <div
            className="flex items-center gap-3 transition-all duration-300"
            style={{ color: hovered ? accentColor : "#6b7280" }}
          >
            <span className="text-sm font-bold uppercase tracking-widest">
              Enter Module
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: hovered ? "translateX(6px)" : "translateX(0)",
                transition: "transform 0.3s ease",
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 底部角落裝飾 */}
        <div
          className="absolute bottom-0 right-0 w-32 h-32 opacity-5 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at bottom right, ${accentColor}, transparent)`,
            opacity: hovered ? 0.15 : 0.05,
          }}
        />
      </div>
    </div>
  );
}

// --- 頂部狀態列 ---
function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between mb-16 px-1">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-xs text-gray-600 font-mono uppercase tracking-widest">
          IELTS LEARNING SYSTEM · ONLINE
        </span>
      </div>
      <span className="text-xs text-gray-700 font-mono">{time}</span>
    </div>
  );
}

// --- 主頁面 ---
export default function LearningPage() {
  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          from { top: -2px; }
          to   { top: 102%; }
        }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6 relative">
        <GridBackground />

        <div className="max-w-5xl mx-auto relative z-10">
          <StatusBar />

          {/* 兩張大卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LearningCard
              title="VOCAB"
              subtitle="Module 01"
              description="Dominate 95% of IELTS topics with our 10-category logic matrix. 2,400+ curated words with Chinese definitions, POS, and examples."
              path="/learning/vocabulary"
              icon={<VocabIcon />}
              stats={VOCAB_STATS}
              accentColor="#a855f7"
              delay="0.5s"
              tags={["IELTS", "Word Bank"]}
            />
            <LearningCard
              title="GRAMMAR"
              subtitle="Module 02"
              description="Master tenses, sentence patterns, and advanced structures. 3-tier difficulty system with 300+ interactive exercises and instant feedback."
              path="/learning/grammar"
              icon={<GrammarIcon />}
              stats={GRAMMAR_STATS}
              accentColor="#6366f1"
              delay="0.65s"
              tags={["3 Levels", "Interactive"]}
            />
          </div>

          {/* 底部裝飾文字 */}
          <div
            className="text-center mt-12"
            style={{ animation: "fadeSlideUp 0.6s ease both 0.9s" }}
          >
            <p className="text-xs text-gray-700 font-mono tracking-widest uppercase">
              — Precision-engineered for Band 7.0+ —
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
