// frontend/app/learning/grammar/topic/conjunctions/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type ConjunctionItem = {
  word: string;
  meaning: string;
  usage: string;
  example: string;
};

type ConjunctionData = {
  [key: string]: ConjunctionItem[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  gold: "#fbbf24",
};

const CONJUNCTION_CATEGORIES = [
  { id: "transition", label: "轉折/對比", title: "Transition & Contrast" },
  { id: "sequence", label: "層次/並列", title: "Sequence & Parallel" },
  { id: "additive", label: "層遞/強調", title: "Addition & Emphasis" },
  { id: "result", label: "因果", title: "Cause & Effect" },
  { id: "comparison", label: "比較/舉例", title: "Comparison & Examples" },
];

const CONJUNCTION_DATA: ConjunctionData = {
  transition: [
    {
      word: "However",
      meaning: "然而",
      usage: "語氣強轉折，置於句首或句中",
      example:
        "The team worked hard; however, the results were not as expected.",
    },
    {
      word: "On the contrary",
      meaning: "相反地",
      usage: "強調與前述完全相反",
      example: "He is not arrogant; on the contrary, he is quite humble.",
    },
    {
      word: "Nevertheless",
      meaning: "儘管如此",
      usage: "表示讓步後的轉折",
      example: "It was a dangerous journey; nevertheless, they continued.",
    },
    {
      word: "By contrast",
      meaning: "相比之下",
      usage: "純粹對照兩者差異",
      example: "He is very quiet. By contrast, his brother is very outgoing.",
    },
  ],
  sequence: [
    {
      word: "First... Second...",
      meaning: "第一...第二...",
      usage: "條列清晰的論點",
      example: "First, save your work. Second, close the application.",
    },
    {
      word: "On one hand",
      meaning: "一方面",
      usage: "引出對立論點的前者",
      example:
        "On one hand, tech is useful. On the other hand, it can be addictive.",
    },
    {
      word: "As well as",
      meaning: "以及/也",
      usage: "用於並列兩者地位相同",
      example: "He likes swimming as well as running.",
    },
  ],
  additive: [
    {
      word: "Moreover",
      meaning: "此外/而且",
      usage: "層遞補充，語氣正式",
      example: "The app is free. Moreover, it is very easy to use.",
    },
    {
      word: "Furthermore",
      meaning: "再者",
      usage: "進一步推論或補充",
      example: "Smoking is bad for health. Furthermore, it is expensive.",
    },
    {
      word: "In fact",
      meaning: "事實上",
      usage: "用於強調真實情況",
      example: "He seems shy, but in fact, he is very talkative.",
    },
    {
      word: "Undoubtedly",
      meaning: "毫無疑問地",
      usage: "強烈肯定某個事實",
      example: "Undoubtedly, this is the best coffee in town.",
    },
  ],
  result: [
    {
      word: "Therefore",
      meaning: "因此",
      usage: "因果邏輯推導",
      example: "I was sick; therefore, I stayed home.",
    },
    {
      word: "Hence",
      meaning: "由此/因此",
      usage: "較正式的因果銜接",
      example: "The costs are rising; hence, we must cut spending.",
    },
    {
      word: "Due to",
      meaning: "由於",
      usage: "接名詞，解釋起因",
      example: "The game was canceled due to heavy rain.",
    },
  ],
  comparison: [
    {
      word: "Similarly",
      meaning: "同樣地",
      usage: "比較兩者相似處",
      example: "The first film was great. Similarly, the sequel is excellent.",
    },
    {
      word: "In comparison with",
      meaning: "與...相比",
      usage: "具體的對象比較",
      example: "He is tall in comparison with his classmates.",
    },
    {
      word: "For instance",
      meaning: "例如",
      usage: "舉出特定實例",
      example: "She has many hobbies; for instance, she loves hiking.",
    },
  ],
};

// ─── Helper Component ───────────────────────────────────────────────────────

function HighlightConjunctions({ text }: { text: string }) {
  const keywords = [
    "However",
    "On the contrary",
    "Nevertheless",
    "By contrast",
    "First",
    "Second",
    "On one hand",
    "As well as",
    "Moreover",
    "Furthermore",
    "In fact",
    "Undoubtedly",
    "Therefore",
    "Hence",
    "Due to",
    "Similarly",
    "In comparison with",
    "For instance",
  ];

  const regex = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = keywords.some(
          (k) => k.toLowerCase() === part.toLowerCase(),
        );
        return isMatch ? (
          <span key={i} style={{ color: THEME.gold, fontWeight: 800 }}>
            {part}
          </span>
        ) : (
          part
        );
      })}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConjunctionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("transition");

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative text-gray-300">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(${THEME.purple}50 1px, transparent 1px), linear-gradient(90deg, ${THEME.purple}50 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${THEME.purple}08 0%, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
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
          <span style={{ color: THEME.purple }}>Conjunctions</span>
        </div>

        {/* Header */}
        <div className="mb-14">
          <h1 className="text-6xl font-black text-white tracking-tight mb-6">
            English <span style={{ color: THEME.purple }}>Conjunctions</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-3xl font-medium">
            Conjunctions are the glue of writing. They connect ideas and guide
            your readers through the logic of your text.
            <span className="text-white/70 mx-1">
              Note that yellow text indicates the key connective words.
            </span>
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-10 p-2 rounded-2xl w-fit bg-white/[0.04] border border-white/[0.07]">
          {CONJUNCTION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-6 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background:
                  activeTab === cat.id ? `${THEME.purple}18` : "transparent",
                color: activeTab === cat.id ? THEME.purple : "#6b7280",
                border: `1px solid ${
                  activeTab === cat.id ? `${THEME.purple}30` : "transparent"
                }`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-[32px] border border-white/[0.06] bg-white/[0.01]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th
                  className="p-6 text-sm font-black uppercase tracking-widest"
                  style={{ color: THEME.purple }}
                >
                  Connective
                </th>
                <th
                  className="p-6 text-sm font-black uppercase tracking-widest"
                  style={{ color: THEME.purple }}
                >
                  Meaning
                </th>
                <th
                  className="p-6 text-sm font-black uppercase tracking-widest"
                  style={{ color: THEME.purple }}
                >
                  Usage
                </th>
                <th
                  className="p-6 text-sm font-black uppercase tracking-widest"
                  style={{ color: THEME.purple }}
                >
                  Example Sentence
                </th>
              </tr>
            </thead>
            <tbody>
              {CONJUNCTION_DATA[activeTab].map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-6">
                    <span
                      style={{ color: THEME.purple, fontWeight: 800 }}
                      className="text-lg font-mono"
                    >
                      {item.word}
                    </span>
                  </td>
                  <td className="p-6 text-white font-medium">{item.meaning}</td>
                  <td className="p-6 text-gray-500 text-sm font-medium">
                    {item.usage}
                  </td>
                  <td className="p-6 text-gray-300 italic leading-relaxed">
                    <HighlightConjunctions text={item.example} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
