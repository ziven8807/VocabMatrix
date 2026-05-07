"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  amber: "#fbbf24",
  teal: "#2dd4bf",
  rose: "#fb7185",
  sky: "#38bdf8",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId = "infinitive" | "preposition" | "summary";

type Example = {
  en: string;
  zh: string;
  highlight: string;
  note?: string;
  isWrong?: boolean;
};

type UsageBlock = {
  title: string;
  titleZh: string;
  color: string;
  formula: string;
  desc: string;
  examples: Example[];
};

type Section = {
  id: SectionId;
  label: string;
  labelZh: string;
  color: string;
  icon: React.ReactNode;
  tagline: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  Rocket: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1-1.5 3-1.5 3s2 0 3-1.5" />
      <path d="M12 2C8 2 5 9 5 13a7 7 0 0 0 14 0c0-4-3-11-7-11z" />
      <circle cx="12" cy="13" r="2" />
    </svg>
  ),
  Link: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Zap: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "infinitive",
    label: "Infinitive to",
    labelZh: "不定詞",
    color: THEME.amber,
    icon: <Icons.Rocket />,
    tagline: "to + 動詞原形",
  },
  {
    id: "preposition",
    label: "Preposition to",
    labelZh: "介系詞 to",
    color: THEME.amber,
    icon: <Icons.Link />,
    tagline: "to + 名詞 / V-ing",
  },
  {
    id: "summary",
    label: "to vs V-ing",
    labelZh: "比較總結",
    color: THEME.amber,
    icon: <Icons.Zap />,
    tagline: "快速分辨法則",
  },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const INFINITIVE_BLOCKS: UsageBlock[] = [
  {
    title: "基本用法",
    titleZh: "to + 動詞原形，表示「要去做」的動作",
    color: THEME.teal,
    formula: "to + 原V",
    desc: "不定詞由 to + 動詞原形構成，代表一個未來、尚未發生或可能發生的動作。最常見的用途是讓一個句子能合法地使用兩個動詞。",
    examples: [
      {
        en: "I want to learn English.",
        zh: "我想學英文。",
        highlight: "to learn",
      },
      {
        en: "She decided to stay home.",
        zh: "她決定待在家。",
        highlight: "to stay",
      },
      {
        en: "He needs to finish the report.",
        zh: "他需要完成報告。",
        highlight: "to finish",
      },
    ],
  },
  {
    title: "否定用法",
    titleZh: "not / never + to V，放在 to 之前",
    color: THEME.rose,
    formula: "not / never + to + 原V",
    desc: "否定不定詞時，將 not 或 never 直接放在 to 前面，不是放在助動詞後面。",
    examples: [
      {
        en: "I don't want to learn English.",
        zh: "我不想學英文。",
        highlight: "don't want to learn",
      },
      {
        en: "I told you never to call me again.",
        zh: "我告訴過你不要再打給我了。",
        highlight: "never to call",
      },
      {
        en: "She asked me not to tell anyone.",
        zh: "她叫我不要告訴任何人。",
        highlight: "not to tell",
      },
    ],
  },
  {
    title: "為什麼需要不定詞？",
    titleZh: "一個句子只能有一個主要動詞",
    color: THEME.purple,
    formula: "動詞 + to + 原V（突破雙動詞限制）",
    desc: "英文規定一個子句只能有一個主要動詞。想在句子裡用第二個動作，就必須用不定詞（to V）或動名詞（V-ing）來「包裝」它，讓它不再算動詞。",
    examples: [
      {
        en: "She doesn't like eat vegetables.",
        zh: "❌ 一個句子不能有兩個動詞",
        highlight: "like eat",
        isWrong: true,
      },
      {
        en: "She doesn't like to eat vegetables.",
        zh: "✅ to eat 讓 eat 變成受詞角色",
        highlight: "to eat",
      },
    ],
  },
];

const PREPOSITION_BLOCKS: UsageBlock[] = [
  {
    title: "介系詞 to",
    titleZh: "to 後面接名詞或動名詞（V-ing）",
    color: THEME.sky,
    formula: "to（介系詞）+ n / V-ing",
    desc: "這個 to 是介系詞，不是不定詞符號。介系詞後面只能接名詞，所以動詞必須轉化為動名詞（V-ing）才能放在這個 to 的後面。辨別方式：把 to 後面換成一個名詞，如果句意通順，這個 to 就是介系詞。",
    examples: [
      {
        en: "We need a new approach to learning English.",
        zh: "我們需要一個學英文的新方法。（to = 介系詞，learning = 動名詞）",
        highlight: "to learning",
        note: "approach to + V-ing（approach 後的 to 永遠是介系詞）",
      },
      {
        en: "The teacher should change the approach to teaching.",
        zh: "老師應該改變教學方法。",
        highlight: "to teaching",
        note: "teaching 是動名詞，在這裡作名詞用",
      },
      {
        en: "I'm looking forward to seeing you.",
        zh: "我很期待見到你。",
        highlight: "to seeing",
        note: "look forward to 是固定片語，to 後接 V-ing",
      },
      {
        en: "She is used to waking up early.",
        zh: "她習慣早起。",
        highlight: "to waking",
        note: "be used to + V-ing（習慣），≠ used to + V（過去曾經）",
      },
    ],
  },
  {
    title: "常見介系詞 to 片語",
    titleZh: "這些片語中的 to 後面都要接 V-ing",
    color: THEME.purple,
    formula: "固定片語 + to + V-ing",
    desc: "記住這些常見片語，裡面的 to 都是介系詞，千萬不要在後面接動詞原形。",
    examples: [
      { en: "look forward to + V-ing", zh: "期待做某事", highlight: "to" },
      { en: "be used to + V-ing", zh: "習慣做某事", highlight: "to" },
      { en: "be accustomed to + V-ing", zh: "習慣做某事", highlight: "to" },
      { en: "object to + V-ing", zh: "反對做某事", highlight: "to" },
      { en: "when it comes to + V-ing", zh: "說到某件事", highlight: "to" },
      { en: "devote oneself to + V-ing", zh: "致力於做某事", highlight: "to" },
    ],
  },
];

const SUMMARY_DATA = {
  toV: {
    color: THEME.teal,
    label: "to + V",
    labelZh: "不定詞",
    emphasis: "強調「要去做」",
    emphasisZh: "未來、尚未發生、目標",
    examples: [
      { en: "I want to go.", zh: "我想去（還沒去）" },
      { en: "She plans to study.", zh: "她計劃讀書（計劃中）" },
    ],
  },
  ving: {
    color: THEME.rose,
    label: "V-ing",
    labelZh: "動名詞",
    emphasis: "強調「正在做 / 這件事」",
    emphasisZh: "進行中、習慣、一般事實",
    examples: [
      { en: "I enjoy swimming.", zh: "我享受游泳（這件事）" },
      { en: "She likes reading.", zh: "她喜歡閱讀（習慣）" },
    ],
  },
};

const ONLY_VING_VERBS = [
  { verb: "enjoy", zh: "享受", ex: "I enjoy swimming." },
  { verb: "finish", zh: "完成", ex: "I finished doing my homework." },
  { verb: "practice", zh: "練習", ex: "I practice playing the piano." },
  { verb: "avoid", zh: "避免", ex: "Avoid making mistakes." },
  { verb: "consider", zh: "考慮", ex: "She considered leaving." },
  { verb: "suggest", zh: "建議", ex: "He suggested going." },
  { verb: "mind", zh: "介意", ex: "Do you mind waiting?" },
  { verb: "deny", zh: "否認", ex: "He denied stealing it." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormulaBadge({ formula, color }: { formula: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-black font-mono"
      style={{
        background: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {formula}
    </span>
  );
}

function ExampleCard({ ex, color }: { ex: Example; color: string }) {
  const parts = ex.en.split(ex.highlight);
  const cardColor = ex.isWrong ? THEME.rose : color;
  return (
    <div
      className="p-4 rounded-2xl border transition-all"
      style={{
        background: ex.isWrong ? `${THEME.rose}08` : "rgba(255,255,255,0.02)",
        borderColor: ex.isWrong ? `${THEME.rose}30` : "rgba(255,255,255,0.05)",
      }}
    >
      <p className="text-white text-base mb-1 font-mono">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="font-black px-0.5" style={{ color: cardColor }}>
                {ex.highlight}
              </span>
            )}
          </span>
        ))}
      </p>
      <p
        className="text-sm italic"
        style={{ color: ex.isWrong ? THEME.rose : "#6b7280" }}
      >
        {ex.zh}
      </p>
      {ex.note && (
        <p
          className="text-xs mt-1.5 px-2 py-1 rounded-lg inline-block"
          style={{ background: `${color}10`, color: `${color}90` }}
        >
          {ex.note}
        </p>
      )}
    </div>
  );
}

// ─── Infinitive Section ───────────────────────────────────────────────────────

function InfinitiveSection() {
  return (
    <div className="p-8 space-y-8">
      {INFINITIVE_BLOCKS.map((block, bi) => (
        <div
          key={bi}
          className="rounded-2xl border p-6"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div className="flex items-start gap-4 mb-5">
            <FormulaBadge formula={block.formula} color={block.color} />
            <div>
              <p className="text-white font-bold">{block.title}</p>
              <p className="text-gray-500 text-sm mt-0.5">{block.titleZh}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {block.desc}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {block.examples.map((ex, ei) => (
              <ExampleCard key={ei} ex={ex} color={block.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Preposition Section ──────────────────────────────────────────────────────

function PrepositionSection() {
  return (
    <div className="p-8 space-y-8">
      {/* Key difference banner */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: `${THEME.sky}08`, borderColor: `${THEME.sky}25` }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-3"
          style={{ color: THEME.sky }}
        >
          不定詞 vs 介系詞 — 關鍵差異
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.teal}10`,
              border: `1px solid ${THEME.teal}20`,
            }}
          >
            <p
              className="font-black text-sm mb-1"
              style={{ color: THEME.teal }}
            >
              不定詞 to
            </p>
            <p className="font-mono text-sm text-gray-300">
              to + 動詞原形（V）
            </p>
            <p className="text-xs text-gray-500 mt-1">
              to 是不定詞符號，不是獨立介系詞
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.sky}10`,
              border: `1px solid ${THEME.sky}20`,
            }}
          >
            <p className="font-black text-sm mb-1" style={{ color: THEME.sky }}>
              介系詞 to
            </p>
            <p className="font-mono text-sm text-gray-300">to + 名詞 / V-ing</p>
            <p className="text-xs text-gray-500 mt-1">
              介系詞後只能接名詞，V-ing = 動名詞
            </p>
          </div>
        </div>
      </div>

      {PREPOSITION_BLOCKS.map((block, bi) => (
        <div
          key={bi}
          className="rounded-2xl border p-6"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div className="flex items-start gap-4 mb-5">
            <FormulaBadge formula={block.formula} color={block.color} />
            <div>
              <p className="text-white font-bold">{block.title}</p>
              <p className="text-gray-500 text-sm mt-0.5">{block.titleZh}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {block.desc}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {block.examples.map((ex, ei) => (
              <ExampleCard key={ei} ex={ex} color={block.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Summary Section ──────────────────────────────────────────────────────────

function SummarySection() {
  return (
    <div className="p-8 space-y-8">
      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(SUMMARY_DATA).map(([key, data]) => (
          <div
            key={key}
            className="rounded-2xl border p-6"
            style={{
              borderColor: `${data.color}25`,
              background: `${data.color}06`,
            }}
          >
            <div className="mb-4">
              <FormulaBadge formula={data.label} color={data.color} />
              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                {data.labelZh}
              </p>
            </div>
            <p
              className="font-black text-sm mb-1"
              style={{ color: data.color }}
            >
              {data.emphasis}
            </p>
            <p className="text-xs text-gray-500 mb-4">{data.emphasisZh}</p>
            <div className="space-y-2">
              {data.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                >
                  <p className="text-white text-sm font-mono">{ex.en}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ex.zh}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Only V-ing verbs */}
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="mb-5">
          <p
            className="text-[11px] uppercase tracking-widest font-black mb-1"
            style={{ color: THEME.amber }}
          >
            只能接 V-ing 的動詞
          </p>
          <p className="text-gray-500 text-sm">
            這些動詞後面只能接動名詞（V-ing），不能接不定詞（to V）
          </p>
          <p className="text-xs text-gray-600 mt-1">
            記憶法：Practice / Enjoy / Finish
            這類動詞描述的是持續進行或已在做的事，所以喜歡代表「進行中」的
            -ing。
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ONLY_VING_VERBS.map((v, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border"
              style={{
                background: `${THEME.amber}06`,
                borderColor: `${THEME.amber}15`,
              }}
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <span
                  className="font-black text-sm"
                  style={{ color: THEME.amber }}
                >
                  {v.verb}
                </span>
                <span className="text-xs text-gray-500">{v.zh}</span>
              </div>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                {v.ex}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick rule summary */}
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: `${THEME.purple}25`,
          background: `${THEME.purple}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-4"
          style={{ color: THEME.purple }}
        >
          快速判斷法
        </p>
        <div className="space-y-3">
          {[
            {
              q: "後面接動詞原形 → ",
              a: "不定詞 to（to + V）",
              color: THEME.teal,
            },
            {
              q: "後面接 V-ing → ",
              a: "動名詞（或介系詞 to + V-ing）",
              color: THEME.rose,
            },
            {
              q: "是 look forward to 等片語 →",
              a: "介系詞 to，後面必須接 V-ing",
              color: THEME.sky,
            },
            {
              q: "want / need / decide 等動詞 →",
              a: "接不定詞 to + V",
              color: THEME.teal,
            },
            {
              q: "enjoy / finish / practice 等 →",
              a: "接動名詞 V-ing",
              color: THEME.rose,
            },
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-gray-400">{rule.q}</span>
              <span className="font-black" style={{ color: rule.color }}>
                {rule.a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ToUsagePage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<SectionId>("infinitive");
  const activeSection = SECTIONS.find((s) => s.id === activeId)!;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float  { 0%,100% { transform:translate(0,0); } 50% { transform:translate(35px,25px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(${THEME.purple} 1px, transparent 1px), linear-gradient(90deg, ${THEME.purple} 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.purple}10 0%, transparent 70%)`,
              filter: "blur(100px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.teal}06 0%, transparent 70%)`,
              filter: "blur(80px)",
              animation: "float 25s ease-in-out infinite reverse",
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
            <span className="text-violet-400">to Usage</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              The Word <span className="text-violet-400">&quot;to&quot;</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              「to」在英文中有兩種完全不同的身分：
              <span style={{ color: THEME.teal }} className="font-bold">
                不定詞符號
              </span>
              （to + 動詞原形）與
              <span style={{ color: THEME.sky }} className="font-bold">
                介系詞
              </span>
              （to + 名詞 / V-ing）。搞清楚它在句中的角色，才能不再用錯。
            </p>
          </div>

          {/* Section Picker */}
          <div
            className="grid grid-cols-3 gap-3 mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            {SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-2xl font-black transition-all duration-300 border"
                  style={{
                    background: isActive ? THEME.amber : `${THEME.purple}08`,
                    color: isActive ? "#000" : THEME.purple,
                    borderColor: isActive ? THEME.amber : `${THEME.purple}20`,
                    boxShadow: isActive ? `0 0 25px ${THEME.amber}40` : "none",
                    transform: isActive
                      ? "scale(1.03) translateY(-2px)"
                      : "scale(1)",
                  }}
                >
                  <span className={isActive ? "text-black" : "text-violet-400"}>
                    {s.icon}
                  </span>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] uppercase tracking-tight text-center">
                      {s.label}
                    </span>
                    <span
                      className={`text-[9px] font-bold opacity-60 ${
                        isActive ? "text-black" : ""
                      }`}
                    >
                      {s.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Card */}
          <div
            key={activeId}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden"
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            {/* Card header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.05] flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                {activeSection.icon}
              </div>
              <div>
                <h3 className="text-white font-black text-2xl">
                  <span style={{ color: activeSection.color }}>
                    {activeSection.label}
                  </span>
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  {activeSection.labelZh} — {activeSection.tagline}
                </p>
              </div>
            </div>

            {/* Content */}
            {activeId === "infinitive" && <InfinitiveSection />}
            {activeId === "preposition" && <PrepositionSection />}
            {activeId === "summary" && <SummarySection />}
          </div>
        </div>
      </main>
    </>
  );
}
