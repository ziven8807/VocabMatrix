// frontend/app/learning/grammar/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Data & Logic Imports ──────────────────────────────────────────────────
import { TOPICS } from "./constants/topics";
import { LEVEL_ORDER, LEVEL_CONFIG } from "./constants/config";
import { useLocale } from "./hooks/useLocale";
import { Level } from "./types";

// ─── Component Imports ──────────────────────────────────────────────────────
import { GridBackground } from "./components/GridBackground";
import { LevelSection } from "./components/LevelSection";

export default function GrammarPage() {
  const router = useRouter();
  const locale = useLocale();
  const [filterLevel, setFilterLevel] = useState<Level | "all">("all");

  // 根據選擇的等級過濾主題
  const filteredTopics =
    filterLevel === "all"
      ? TOPICS
      : TOPICS.filter((t) => t.level === filterLevel);

  return (
    <>
      {/* 頁面級全局動畫定義 */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-24 px-6 relative">
        {/* 背景網格與發光效果 */}
        <GridBackground />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header 標題區塊 */}
          <div
            className="mb-10"
            style={{ animation: "fadeUp 0.5s ease both 0.1s" }}
          >
            {/* 麵包屑導覽 */}
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-6">
              <span
                className="hover:text-gray-400 cursor-pointer transition-colors"
                onClick={() => router.push("/learning")}
              >
                Learning
              </span>
              <span>/</span>
              <span className="text-indigo-400">Grammar</span>
            </div>

            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold tracking-[0.25em] text-indigo-400 uppercase">
                    Module 02
                  </span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight leading-none">
                  GRAMMAR
                  <span className="text-indigo-500 ml-3">CORE</span>
                </h1>
                <p className="text-gray-500 text-sm mt-3 max-w-lg">
                  21 topics from foundational to advanced. Build a complete
                  understanding of English grammar — one layer at a time.
                </p>
              </div>

              {/* 等級篩選按鈕列 */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setFilterLevel("all")}
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-200"
                  style={{
                    background:
                      filterLevel === "all"
                        ? "rgba(99,102,241,0.2)"
                        : "transparent",
                    borderColor:
                      filterLevel === "all"
                        ? "#6366f150"
                        : "rgba(255,255,255,0.08)",
                    color: filterLevel === "all" ? "#818cf8" : "#4b5563",
                  }}
                >
                  ALL
                </button>
                {LEVEL_ORDER.map((lvl) => {
                  const cfg = LEVEL_CONFIG[lvl];
                  return (
                    <button
                      key={lvl}
                      onClick={() => setFilterLevel(lvl)}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-200"
                      style={{
                        background:
                          filterLevel === lvl ? cfg.bgColor : "transparent",
                        borderColor:
                          filterLevel === lvl
                            ? cfg.borderColor
                            : "rgba(255,255,255,0.08)",
                        color: filterLevel === lvl ? cfg.color : "#4b5563",
                      }}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 各等級文法課程列表區塊 */}
          <div className="flex flex-col gap-12">
            {LEVEL_ORDER.map((level, i) => {
              const topicsAtLevel = filteredTopics.filter(
                (t) => t.level === level,
              );
              if (topicsAtLevel.length === 0) return null;

              return (
                <LevelSection
                  key={level}
                  level={level}
                  topics={topicsAtLevel}
                  baseDelay={400 + i * 100}
                  locale={locale}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
