// frontend/app/learning/grammar/topic/auxiliary-verbs/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Example = {
  sentence: string;
  note: string;
};

export type ErrorExample = {
  wrong: string;
  right: string;
  tip: string;
};

export type PrimaryVerb = {
  verb: string;
  subtitle: string;
  color: string;
  forms: { form: string; usage: string }[];
  examples: Example[];
  errors: ErrorExample[];
};

// ─── Data (Standardized Theme) ──────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  gold: "#fbbf24",
};

const PRIMARY_VERBS: PrimaryVerb[] = [
  {
    verb: "be",
    subtitle: "am / is / are / was / were",
    color: THEME.purple,
    forms: [
      { form: "am", usage: "I" },
      { form: "is", usage: "He / She / It" },
      { form: "are", usage: "You / We / They" },
      { form: "was", usage: "I / He / She / It (past)" },
      { form: "were", usage: "You / We / They (past)" },
    ],
    examples: [
      { sentence: "I am from Taiwan.", note: "介紹來源" },
      { sentence: "The movie is boring.", note: "描述事物狀態" },
      { sentence: "They were at the park.", note: "過去的地點" },
    ],
    errors: [
      {
        wrong: "He are a doctor.",
        right: "He is a doctor.",
        tip: "He / She / It 永遠搭配 'is'",
      },
      { wrong: "I is happy.", right: "I am happy.", tip: "'I' 永遠搭配 'am'" },
    ],
  },
  {
    verb: "do / does",
    subtitle: "do / does / did",
    color: THEME.purple,
    forms: [
      { form: "do", usage: "I / You / We / They" },
      { form: "does", usage: "He / She / It" },
      { form: "did", usage: "所有主詞 (過去式)" },
    ],
    examples: [
      { sentence: "Do you like coffee?", note: "形成是非問句" },
      { sentence: "She doesn't live here.", note: "形成否定句" },
      { sentence: "Did they call you?", note: "過去式問句" },
    ],
    errors: [
      {
        wrong: "Does she likes coffee?",
        right: "Does she like coffee?",
        tip: "助動詞 does/did 後面一律接原形動詞",
      },
      {
        wrong: "He don't know.",
        right: "He doesn't know.",
        tip: "第三人稱單數使用 doesn't",
      },
    ],
  },
  {
    verb: "have / has",
    subtitle: "have / has / had",
    color: THEME.purple,
    forms: [
      { form: "have", usage: "I / You / We / They" },
      { form: "has", usage: "He / She / It" },
      { form: "had", usage: "所有主詞 (過去式)" },
    ],
    examples: [
      { sentence: "I have two brothers.", note: "表示擁有關係" },
      { sentence: "She has a meeting today.", note: "第三人稱單數" },
      { sentence: "We had a great time.", note: "過去的時間" },
    ],
    errors: [
      {
        wrong: "He have a dog.",
        right: "He has a dog.",
        tip: "He / She / It 一律使用 'has'",
      },
    ],
  },
];

const SCENARIOS = [
  {
    id: "possibility",
    emoji: "🌧️",
    question: "也許會發生某件事…",
    subtitle: "Possibility",
    verbs: [
      {
        verb: "might",
        translation: "可能（極不確定）",
        certainty: 20,
        example: "It might rain later.",
        note: "把握度約 20%",
        color: THEME.gold,
      },
      {
        verb: "may",
        translation: "可能（普通）",
        certainty: 50,
        example: "It may rain later.",
        note: "把握度約 50%",
        color: THEME.gold,
      },
      {
        verb: "will",
        translation: "一定會（確定）",
        certainty: 95,
        example: "It will rain tomorrow.",
        note: "非常有把握",
        color: THEME.gold,
      },
    ],
  },
  {
    id: "obligation",
    emoji: "📋",
    question: "需要做某件事…",
    subtitle: "Obligation",
    verbs: [
      {
        verb: "should",
        translation: "應該（建議）",
        certainty: 40,
        example: "You should see a doctor.",
        note: "軟性建議",
        color: THEME.gold,
      },
      {
        verb: "have to",
        translation: "必須（規則）",
        certainty: 80,
        example: "I have to finish this.",
        note: "外部規定的義務",
        color: THEME.gold,
      },
      {
        verb: "must",
        translation: "絕對必須",
        certainty: 98,
        example: "You must not smoke.",
        note: "最強烈的命令或決心",
        color: THEME.gold,
      },
    ],
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function CertaintyBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
          確信度
        </span>
        <span className="text-xs font-black font-mono" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${THEME.gold}60, ${THEME.gold})`,
          }}
        />
      </div>
    </div>
  );
}

function ScenarioSection({
  scenario,
}: {
  scenario: typeof SCENARIOS[0];
  index: number;
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="rounded-[32px] border overflow-hidden transition-all mb-6"
      style={{
        borderColor: `${THEME.purple}20`,
        background: `linear-gradient(135deg, ${THEME.purple}06 0%, #0d0d0d 65%)`,
      }}
    >
      <div className="p-6 border-b border-white/[0.04] flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/5">
          {scenario.emoji}
        </div>
        <div>
          <h3 className="text-white font-black text-xl">{scenario.question}</h3>
          <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
            {scenario.subtitle}
          </span>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {scenario.verbs.map((v, i) => (
          <button
            key={v.verb}
            onClick={() => setActive(active === i ? null : i)}
            className="p-5 rounded-2xl text-left transition-all border"
            style={{
              background:
                active === i ? `${THEME.gold}15` : "rgba(255,255,255,0.02)",
              borderColor: active === i ? `${THEME.gold}40` : "transparent",
            }}
          >
            <p
              className="text-xl font-black font-mono mb-1"
              style={{ color: active === i ? THEME.gold : "white" }}
            >
              {v.verb}
            </p>
            <p className="text-xs text-gray-500">{v.translation}</p>
            {active === i && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-lg text-white font-bold mb-1 tracking-tight">
                  &ldquo;{v.example}&rdquo;
                </p>
                <p className="text-xs text-gray-400 mb-4">{v.note}</p>
                {v.certainty && (
                  <CertaintyBar value={v.certainty} color={THEME.gold} />
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PrimaryVerbCard({ v }: { v: PrimaryVerb; index: number }) {
  const [tab, setTab] = useState<"forms" | "examples" | "errors">("forms");

  return (
    <div
      className="rounded-[32px] border overflow-hidden mb-8 transition-all"
      style={{
        borderColor: `${THEME.purple}20`,
        background: `linear-gradient(135deg, ${THEME.purple}06 0%, #0d0d0d 65%)`,
      }}
    >
      <div className="p-8 flex items-baseline gap-4">
        <h2
          className="text-3xl font-black font-mono tracking-tighter"
          style={{ color: THEME.purple }}
        >
          {v.verb}
        </h2>
        <span className="text-gray-500 font-mono text-sm">{v.subtitle}</span>
      </div>
      <div className="px-8 flex gap-6 mb-6">
        {(["forms", "examples", "errors"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-xs font-black tracking-widest transition-all py-1"
            style={{
              color: tab === t ? THEME.gold : "#4b5563",
              borderBottom: `2px solid ${
                tab === t ? THEME.gold : "transparent"
              }`,
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="px-8 pb-8">
        {tab === "forms" && (
          <div className="grid grid-cols-1 gap-2">
            {v.forms.map((f) => (
              <div
                key={f.form}
                className="flex items-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]"
              >
                <span
                  className="w-24 text-lg font-black font-mono"
                  style={{ color: THEME.gold }}
                >
                  {f.form}
                </span>
                <span className="text-gray-400 font-medium text-sm">
                  {f.usage}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "examples" && (
          <div className="space-y-4">
            {v.examples.map((e, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.03] border-l-4"
                style={{ borderColor: THEME.gold }}
              >
                <p className="text-xl text-white font-bold tracking-tight mb-2">
                  {e.sentence}
                </p>
                <p className="text-xs text-gray-500 italic">{e.note}</p>
              </div>
            ))}
          </div>
        )}
        {tab === "errors" && (
          <div className="space-y-4">
            {v.errors.map((e, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-red-500/[0.03] border border-red-500/10"
              >
                <p className="text-red-400/60 text-lg line-through mb-1">
                  ✗ {e.wrong}
                </p>
                <p className="text-emerald-400 text-xl font-bold mb-3">
                  ✓ {e.right}
                </p>
                <p className="text-xs text-gray-500 font-black tracking-widest uppercase">
                  Tip: {e.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuxiliaryVerbsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"primary" | "modal">(
    "primary",
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${THEME.purple}50 1px, transparent 1px), linear-gradient(90deg, ${THEME.purple}50 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 font-mono mb-8">
          <span
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => router.push("/learning")}
          >
            Learning
          </span>
          <span>/</span>
          <span
            className="hover:text-gray-400 cursor-pointer"
            onClick={() => router.push("/learning/grammar")}
          >
            Grammar
          </span>
          <span>/</span>
          <span style={{ color: THEME.purple }}>Auxiliary Verbs</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white tracking-tight mb-6">
            Auxiliary <span style={{ color: THEME.purple }}>Verbs</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            助動詞協助主要動詞表達時態與語氣。
            <span className="text-white/70 mx-1">
              它們是建構正確英文句子的重要支架。
            </span>
          </p>
        </div>

        {/* Switcher - Unified Theme */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveSection("primary")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all border ${
              activeSection === "primary"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            Primary
          </button>
          <button
            onClick={() => setActiveSection("modal")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all border ${
              activeSection === "modal"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            Modals
          </button>
        </div>

        {/* Content */}
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          {activeSection === "primary"
            ? PRIMARY_VERBS.map((v, i) => (
                <PrimaryVerbCard key={v.verb} v={v} index={i} />
              ))
            : SCENARIOS.map((s, i) => (
                <ScenarioSection key={s.id} scenario={s} index={i} />
              ))}
        </div>
      </div>
    </main>
  );
}
