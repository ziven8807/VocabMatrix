// frontend/app/learning/grammar/topic/pronouns/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icons = {
  Crown: () => (
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
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"></path>
      <path d="M12 17H12.01"></path>
    </svg>
  ),
  Target: () => (
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
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  Diamond: () => (
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
      <path d="M6 3h12l4 6-10 12L2 9z"></path>
      <path d="M11 3 8 9l3 12"></path>
      <path d="M13 3l3 6-3 12"></path>
    </svg>
  ),
  Mirror: () => (
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
      <path d="M15 8a3 3 0 0 0-6 0v7a3 3 0 0 0 6 0z"></path>
      <path d="M12 2v2"></path>
      <path d="M12 18v2"></path>
      <path d="M12 21v1"></path>
    </svg>
  ),
};

// ─── Types ───────────────────────────────────────────────────────────────────

type PronounRow = {
  person: string;
  subjective: string;
  objective: string;
  possessiveAdj: string;
  possessivePron: string;
  reflexive: string;
};

type ExampleSentence = {
  sentence: string;
  highlight: string;
  note: string;
};

type CommonError = {
  wrong: string;
  right: string;
  tip: string;
};

type PronounSection = {
  id: "subjective" | "objective" | "possessive" | "reflexive";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  usage: string[];
  examples: ExampleSentence[];
  errors: CommonError[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  amber: "#fbbf24",
};

const PRONOUN_TABLE: PronounRow[] = [
  {
    person: "1st sg",
    subjective: "I",
    objective: "me",
    possessiveAdj: "my",
    possessivePron: "mine",
    reflexive: "myself",
  },
  {
    person: "2nd sg",
    subjective: "you",
    objective: "you",
    possessiveAdj: "your",
    possessivePron: "yours",
    reflexive: "yourself",
  },
  {
    person: "3rd sg ♂",
    subjective: "he",
    objective: "him",
    possessiveAdj: "his",
    possessivePron: "his",
    reflexive: "himself",
  },
  {
    person: "3rd sg ♀",
    subjective: "she",
    objective: "her",
    possessiveAdj: "her",
    possessivePron: "hers",
    reflexive: "herself",
  },
  {
    person: "3rd sg ⬡",
    subjective: "it",
    objective: "it",
    possessiveAdj: "its",
    possessivePron: "—",
    reflexive: "itself",
  },
  {
    person: "1st pl",
    subjective: "we",
    objective: "us",
    possessiveAdj: "our",
    possessivePron: "ours",
    reflexive: "ourselves",
  },
  {
    person: "2nd pl",
    subjective: "you",
    objective: "you",
    possessiveAdj: "your",
    possessivePron: "yours",
    reflexive: "yourselves",
  },
  {
    person: "3rd pl",
    subjective: "they",
    objective: "them",
    possessiveAdj: "their",
    possessivePron: "theirs",
    reflexive: "themselves",
  },
];

const PRONOUN_SECTIONS: PronounSection[] = [
  {
    id: "subjective",
    title: "Subjective 主格",
    subtitle: "I · you · he · she · it · we · they",
    icon: <Icons.Crown />,
    color: THEME.amber,
    description: "在句子中擔任「主詞」的角色——即執行動作的人或物。",
    usage: ["置於動詞之前", "可替代作為行為者的名詞"],
    examples: [
      {
        sentence: "I love learning English.",
        highlight: "I",
        note: "句子的主詞",
      },
      {
        sentence: "She went to the store.",
        highlight: "She",
        note: "She = 執行動作的人",
      },
    ],
    errors: [
      {
        wrong: "Me and John went to the park.",
        right: "John and I went to the park.",
        tip: "當主詞時使用主格 'I'。",
      },
    ],
  },
  {
    id: "objective",
    title: "Objective 受格",
    subtitle: "me · you · him · her · it · us · them",
    icon: <Icons.Target />,
    color: THEME.amber,
    description: "作為動詞或介系詞的「受詞」——即接受動作的對象。",
    usage: ["置於動詞之後", "置於介系詞之後"],
    examples: [
      {
        sentence: "Can you help me?",
        highlight: "me",
        note: "動詞 'help' 的受詞",
      },
      {
        sentence: "This is just between you and me.",
        highlight: "me",
        note: "在介系詞之後",
      },
    ],
    errors: [
      {
        wrong: "Between you and I.",
        right: "Between you and me.",
        tip: "介系詞之後一律使用受格。",
      },
    ],
  },
  {
    id: "possessive",
    title: "Possessive 所有格",
    subtitle:
      "my/mine · your/yours · his · her/hers · its · our/ours · their/theirs",
    icon: <Icons.Diamond />,
    color: THEME.amber,
    description: "表示所有權。分為所有格形容詞與所有格代名詞。",
    usage: ["形容詞用法：my book", "代名詞用法：That is mine."],
    examples: [
      { sentence: "This is my bag.", highlight: "my", note: "所有格形容詞" },
      {
        sentence: "That bag is mine.",
        highlight: "mine",
        note: "所有格代名詞",
      },
    ],
    errors: [
      {
        wrong: "The cat licked it's paw.",
        right: "The cat licked its paw.",
        tip: "its = 它的。所有格不加撇號。",
      },
    ],
  },
  {
    id: "reflexive",
    title: "Reflexive 反身代名詞",
    subtitle:
      "myself · yourself · himself · herself · itself · ourselves · yourselves · themselves",
    icon: <Icons.Mirror />,
    color: THEME.amber,
    description: "當主詞與受詞是同一人時，或為了加強語氣時使用。",
    usage: ["反身用法：對自己動作", "強調用法：加強語氣"],
    examples: [
      {
        sentence: "He cut himself while cooking.",
        highlight: "himself",
        note: "與主詞同人",
      },
      {
        sentence: "I did the whole project myself.",
        highlight: "myself",
        note: "增加語氣",
      },
    ],
    errors: [
      {
        wrong: "Myself and Tom will handle it.",
        right: "Tom and I will handle it.",
        tip: "反身代名詞不能當主詞。",
      },
    ],
  },
];

const COLUMNS = [
  { key: "person", label: "Person", color: "#6b7280" },
  { key: "subjective", label: "Subjective", color: THEME.amber },
  { key: "objective", label: "Objective", color: THEME.amber },
  { key: "possessiveAdj", label: "Poss. Adj.", color: THEME.amber },
  { key: "possessivePron", label: "Poss. Pron.", color: THEME.amber },
  { key: "reflexive", label: "Reflexive", color: THEME.amber },
] as const;

// ─── Sub-Components ───────────────────────────────────────────────────────────

function PronounTable({ activeSection }: { activeSection: string | null }) {
  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="grid text-[11px] font-black tracking-widest uppercase border-b border-white/[0.06]"
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr" }}
      >
        {COLUMNS.map((col) => {
          const isActive =
            activeSection === col.key ||
            (activeSection === "possessive" &&
              (col.key === "possessiveAdj" || col.key === "possessivePron"));
          return (
            <div
              key={col.key}
              className="px-4 py-4 text-center transition-all duration-300"
              style={{
                color: isActive ? col.color : "#4b5563",
                background: isActive ? `${THEME.purple}10` : "transparent",
              }}
            >
              {col.label}
            </div>
          );
        })}
      </div>
      {PRONOUN_TABLE.map((row, ri) => (
        <div
          key={ri}
          className="grid transition-all duration-200 border-b border-white/[0.04] last:border-0"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
            background: ri % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
          }}
        >
          {COLUMNS.map((col) => {
            const isActive =
              activeSection === col.key ||
              (activeSection === "possessive" &&
                (col.key === "possessiveAdj" || col.key === "possessivePron"));
            const val = row[col.key as keyof PronounRow];
            return (
              <div
                key={col.key}
                className="px-4 py-4 text-center font-mono transition-all duration-300"
                style={{
                  color: isActive
                    ? col.color
                    : col.key === "person"
                    ? "#4b5563"
                    : "#9ca3af",
                  fontWeight: isActive ? 800 : 500,
                  background: isActive ? `${THEME.purple}08` : "transparent",
                  fontSize: col.key === "person" ? "11px" : "14px",
                  textShadow: isActive ? `0 0 12px ${THEME.amber}30` : "none",
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PronounsPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<PronounSection["id"]>("subjective");
  const activeSection = PRONOUN_SECTIONS.find((s) => s.id === activeId)!;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(35px, 25px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
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
            <span className="text-violet-400">Pronouns</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Pronoun <span className="text-violet-400">Cases</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              代名詞用於替代名詞。根據它在句中的角色，形式會有所改變。
            </p>
          </div>

          {/* Table - 反光改為黃色 */}
          <div
            className="mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            <PronounTable activeSection={activeId} />
          </div>

          {/* Section Picker - 預設紫, 選中黃 */}
          <div
            className="grid grid-cols-4 gap-3 mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.2s" }}
          >
            {PRONOUN_SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="group relative flex flex-col items-center justify-center gap-3 py-6 px-3 rounded-2xl font-black transition-all duration-300 border"
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
                  <span
                    className={`transition-colors duration-300 ${
                      isActive ? "text-black" : "text-violet-400"
                    }`}
                  >
                    {s.icon}
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-tight">
                      {s.title.split(" ")[0]}
                    </span>
                    <span
                      className={`text-[9px] font-bold opacity-50 ${
                        isActive ? "text-black" : ""
                      }`}
                    >
                      {s.id === "subjective"
                        ? "I, he..."
                        : s.id === "objective"
                        ? "me, him..."
                        : s.id === "possessive"
                        ? "my, mine..."
                        : "myself..."}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Content */}
          <div
            key={activeId}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-8"
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            <div className="flex items-center gap-4 mb-6 border-b border-white/[0.05] pb-6">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                {activeSection.icon}
              </div>
              <h3 className="text-white font-black text-2xl">
                {activeSection.title}
              </h3>
            </div>

            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              {activeSection.description}
            </p>

            <div className="space-y-4">
              {activeSection.examples.map((e, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/20 transition-all"
                >
                  <p className="text-white text-lg mb-2">
                    {e.sentence.split(e.highlight)[0]}
                    <span className="text-amber-400 font-black px-1">
                      {e.highlight}
                    </span>
                    {e.sentence.split(e.highlight)[1]}
                  </p>
                  <p className="text-sm text-gray-500 italic">{e.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
