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

type SectionId = "intro" | "nonrestrictive" | "restrictive";

type Section = {
  id: SectionId;
  label: string;
  labelZh: string;
  icon: React.ReactNode;
  tagline: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  Info: () => (
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Comma: () => (
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
      <path d="M3 3h18v18H3z" strokeOpacity="0" />
      <text
        x="4"
        y="19"
        fontSize="20"
        fill="currentColor"
        stroke="none"
        fontFamily="Georgia, serif"
      >
        ,
      </text>
      <circle cx="16" cy="7" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  Lock: () => (
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "intro",
    label: "What is Appositive?",
    labelZh: "同位語是什麼",
    icon: <Icons.Info />,
    tagline: "補充先行詞的名詞片語",
  },
  {
    id: "nonrestrictive",
    label: "Non-restrictive",
    labelZh: "非限定同位語",
    icon: <Icons.Comma />,
    tagline: "加逗號，可拿掉不影響語意",
  },
  {
    id: "restrictive",
    label: "Restrictive",
    labelZh: "限定同位語",
    icon: <Icons.Lock />,
    tagline: "無逗號，拿掉會影響語意",
  },
];

// ─── Annotated sentence component ────────────────────────────────────────────

function AnnotatedSentence({
  parts,
  zh,
}: {
  parts: { text: string; role?: "antecedent" | "appositive" | "plain" }[];
  zh: string;
}) {
  const colors = {
    antecedent: THEME.teal,
    appositive: THEME.amber,
    plain: undefined,
  };

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <p className="text-lg font-mono text-white leading-relaxed mb-3 flex flex-wrap gap-x-1 items-baseline">
        {parts.map((p, i) => (
          <span
            key={i}
            style={{
              color: p.role && p.role !== "plain" ? colors[p.role] : "white",
              fontWeight: p.role && p.role !== "plain" ? 900 : 400,
            }}
          >
            {p.text}
          </span>
        ))}
      </p>
      <p className="text-sm text-gray-500 italic">{zh}</p>
      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <span
          className="flex items-center gap-1.5 text-xs font-bold"
          style={{ color: THEME.teal }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: THEME.teal }}
          />
          先行詞 Antecedent
        </span>
        <span
          className="flex items-center gap-1.5 text-xs font-bold"
          style={{ color: THEME.amber }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: THEME.amber }}
          />
          同位語 Appositive
        </span>
      </div>
    </div>
  );
}

// ─── Removability demo ────────────────────────────────────────────────────────

function RemovabilityDemo({
  full,
  removed,
  removedPart,
  ok,
  zh,
  removedZh,
}: {
  full: string;
  removed: string;
  removedPart: string;
  ok: boolean;
  zh: string;
  removedZh: string;
}) {
  const [showRemoved, setShowRemoved] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="px-5 py-3 border-b flex items-center justify-between"
        style={{
          borderColor: "rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
          同位語可移除測試
        </p>
        <button
          onClick={() => setShowRemoved((v) => !v)}
          className="text-xs font-black px-3 py-1 rounded-lg transition-all"
          style={{
            background: showRemoved ? `${THEME.rose}15` : `${THEME.teal}15`,
            color: showRemoved ? THEME.rose : THEME.teal,
          }}
        >
          {showRemoved ? "還原" : "移除同位語"}
        </button>
      </div>
      <div className="p-5">
        <p className="font-mono text-base text-white mb-1">
          {showRemoved
            ? removed
            : full.split(removedPart).map((seg, i, arr) => (
                <span key={i}>
                  {seg}
                  {i < arr.length - 1 && (
                    <span className="font-black" style={{ color: THEME.amber }}>
                      {removedPart}
                    </span>
                  )}
                </span>
              ))}
        </p>
        <p className="text-sm text-gray-500 italic">
          {showRemoved ? removedZh : zh}
        </p>
        {showRemoved && (
          <div
            className="mt-3 flex items-center gap-2 text-xs font-black"
            style={{ color: ok ? THEME.teal : THEME.rose }}
          >
            <span>{ok ? "✅" : "❌"}</span>
            <span>
              {ok ? "語意完整，同位語為非限定性" : "語意不明，同位語為限定性"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Definition */}
      <div
        className="rounded-2xl border p-6"
        style={{
          borderColor: `${THEME.purple}25`,
          background: `${THEME.purple}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-3"
          style={{ color: THEME.purple }}
        >
          定義 Definition
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          同位語（Appositive）是緊接在
          <span className="font-black" style={{ color: THEME.teal }}>
            先行詞（名詞）
          </span>
          之後的名詞或名詞片語， 用來
          <span className="font-black text-white">補充說明</span>
          先行詞的身份、性質或特徵。
          它是閱讀與寫作中非常實用的文法，能讓句子更精準、更豐富，而不需要另起一句話。
        </p>
      </div>

      {/* Example 1 */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-gray-600">
          例句 1
        </p>
        <AnnotatedSentence
          parts={[
            { text: "My brother", role: "antecedent" },
            { text: " " },
            { text: "Allen", role: "appositive" },
            {
              text: " is going to Japan next semester for exchange.",
              role: "plain",
            },
          ]}
          zh="我哥哥 Allen 下學期要去日本交換。"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              background: `${THEME.teal}10`,
              border: `1px solid ${THEME.teal}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.teal }}
            >
              先行詞
            </p>
            <p className="font-mono text-white">My brother</p>
          </div>
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              background: `${THEME.amber}10`,
              border: `1px solid ${THEME.amber}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.amber }}
            >
              同位語
            </p>
            <p className="font-mono text-white">Allen</p>
          </div>
        </div>
      </div>

      {/* Example 2 */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-black mb-3 text-gray-600">
          例句 2
        </p>
        <AnnotatedSentence
          parts={[
            { text: "Mount Everest,", role: "antecedent" },
            { text: " " },
            { text: "the highest mountain in the world,", role: "appositive" },
            { text: " is 8,848 meters above sea level.", role: "plain" },
          ]}
          zh="珠穆朗瑪峰，全世界最高峰，海拔高度為 8,848 公尺。"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              background: `${THEME.teal}10`,
              border: `1px solid ${THEME.teal}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.teal }}
            >
              先行詞
            </p>
            <p className="font-mono text-white">Mount Everest</p>
          </div>
          <div
            className="p-3 rounded-xl text-sm"
            style={{
              background: `${THEME.amber}10`,
              border: `1px solid ${THEME.amber}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.amber }}
            >
              同位語
            </p>
            <p className="font-mono text-white">
              the highest mountain in the world
            </p>
          </div>
        </div>
      </div>

      {/* Rule summary */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[10px] uppercase tracking-widest font-black mb-4 text-gray-600">
          兩種類型快速比較
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              type: "非限定",
              en: "Non-restrictive",
              color: THEME.teal,
              punct: "有逗號",
              remove: "可移除，不影響語意",
              icon: ",",
            },
            {
              type: "限定",
              en: "Restrictive",
              color: THEME.rose,
              punct: "無逗號",
              remove: "不可移除，影響語意",
              icon: "—",
            },
          ].map((t) => (
            <div
              key={t.type}
              className="p-4 rounded-xl border"
              style={{
                background: `${t.color}08`,
                borderColor: `${t.color}25`,
              }}
            >
              <p className="font-black text-sm mb-1" style={{ color: t.color }}>
                {t.type}同位語
              </p>
              <p className="text-xs text-gray-500 mb-3">{t.en}</p>
              <div className="space-y-1.5 text-xs text-gray-400">
                <p>📌 {t.punct}</p>
                <p>🔧 {t.remove}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NonRestrictiveSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Rule */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.teal}25`,
          background: `${THEME.teal}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.teal }}
        >
          規則 Rule
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          非限定性同位語提供的是
          <span className="font-black text-white">額外附加資訊</span>
          ，拿掉不影響句子的核心語意。 使用時前後加上
          <span className="font-black" style={{ color: THEME.amber }}>
            逗號
          </span>
          ，與句子其他部分區隔。
        </p>
      </div>

      {/* Main example with removability */}
      <RemovabilityDemo
        full="Mr. Allen, my Math teacher, is my best friend."
        removed="Mr. Allen is my best friend."
        removedPart="my Math teacher"
        ok={true}
        zh="Allen 先生，我的數學老師，是我最好的朋友。"
        removedZh="Allen 先生是我最好的朋友。（語意仍完整）"
      />

      {/* namely & i.e. */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-4"
          style={{ color: THEME.sky }}
        >
          引導詞 — namely & i.e.
        </p>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          非限定性同位語常搭配引導詞來明確說明，相當於中文的「亦即」或「換句話說」。
        </p>

        <div className="space-y-5">
          {[
            {
              word: "namely",
              color: THEME.teal,
              desc: "用來列舉或具體說明，相當於「也就是」、「即」",
              usage: "列舉 / 具體說明",
              examples: [
                {
                  en: "The company has one major problem, namely a lack of funding.",
                  zh: "這間公司有一個主要問題，亦即資金不足。",
                  highlight: "namely a lack of funding",
                },
              ],
            },
            {
              word: "i.e.",
              color: THEME.sky,
              desc: "來自拉丁文 id est，用來換句話說或澄清，意思與 namely 接近，但更常出現在書面／學術語境，且通常是重新表述而非列舉。",
              usage: "換句話說 / 澄清（書面語）",
              examples: [
                {
                  en: "The exam is open to adults, i.e. anyone over 18.",
                  zh: "這場考試開放給成年人，即任何 18 歲以上的人。",
                  highlight: "i.e. anyone over 18",
                },
              ],
            },
          ].map((item) => (
            <div
              key={item.word}
              className="rounded-xl border p-4"
              style={{
                background: `${item.color}06`,
                borderColor: `${item.color}20`,
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="font-black font-mono text-base px-2.5 py-1 rounded-lg"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.word}
                </span>
                <span className="text-xs text-gray-500">{item.usage}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {item.desc}
              </p>
              {item.examples.map((ex, ei) => {
                const parts = ex.en.split(ex.highlight);
                return (
                  <div
                    key={ei}
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                  >
                    <p className="font-mono text-sm text-white mb-1">
                      {parts.map((seg, si) => (
                        <span key={si}>
                          {seg}
                          {si < parts.length - 1 && (
                            <span
                              className="font-black"
                              style={{ color: item.color }}
                            >
                              {ex.highlight}
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-500 italic">{ex.zh}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RestrictiveSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Rule */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.rose}25`,
          background: `${THEME.rose}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.rose }}
        >
          規則 Rule
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          限定性同位語提供的是
          <span className="font-black text-white">必要資訊</span>
          ，拿掉會讓先行詞的意思變得不明確。 由於是必要的，所以
          <span className="font-black" style={{ color: THEME.rose }}>
            不加逗號
          </span>
          ，與先行詞直接緊鄰。
        </p>
      </div>

      {/* Main example with removability */}
      <RemovabilityDemo
        full="The movie 'Zootopia' won multiple Oscars last year."
        removed="The movie won multiple Oscars last year."
        removedPart="'Zootopia'"
        ok={false}
        zh="電影《動物方城市》去年贏得多項奧斯卡獎。"
        removedZh="那部電影去年贏得多項奧斯卡獎。（讀者不知道是哪部電影）"
      />

      {/* Comparison table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="px-5 py-4 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.05)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p className="font-black text-sm text-white">
            非限定 vs 限定 — 完整對比
          </p>
        </div>
        <div
          className="grid grid-cols-2 divide-x"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {[
            {
              type: "非限定",
              color: THEME.teal,
              items: [
                { label: "標點", val: "前後加逗號" },
                { label: "資訊", val: "額外補充，可省略" },
                { label: "語意", val: "移除後句意仍完整" },
                { label: "例", val: "Mr. Allen, my Math teacher, …" },
              ],
            },
            {
              type: "限定",
              color: THEME.rose,
              items: [
                { label: "標點", val: "不加逗號" },
                { label: "資訊", val: "必要資訊，不可省略" },
                { label: "語意", val: "移除後語意不明" },
                { label: "例", val: "The movie 'Zootopia' …" },
              ],
            },
          ].map((col, ci) => (
            <div
              key={ci}
              className="p-5"
              style={{
                borderRight:
                  ci === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <p
                className="font-black text-sm mb-4"
                style={{ color: col.color }}
              >
                {col.type}同位語
              </p>
              <div className="space-y-3">
                {col.items.map((item, ii) => (
                  <div key={ii}>
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-300 font-mono">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.amber}25`,
          background: `${THEME.amber}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.amber }}
        >
          💡 快速判斷法
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          把同位語拿掉，看看句子是否仍然清楚——如果
          <span className="font-black" style={{ color: THEME.teal }}>
            還是清楚
          </span>
          就用逗號（非限定）， 如果
          <span className="font-black" style={{ color: THEME.rose }}>
            變得模糊
          </span>
          就不加逗號（限定）。
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AppositivesPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<SectionId>("intro");
  const activeSection = SECTIONS.find((s) => s.id === activeId)!;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float  { 0%,100% { transform:translate(0,0); } 50% { transform:translate(35px,25px); } }
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
          <div
            className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.teal}05 0%, transparent 70%)`,
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
            <span className="text-violet-400">Appositives</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Appositive <span className="text-violet-400">同位語</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              閱讀與寫作的好用文法。同位語緊接在先行詞之後，補充說明它的身份或特徵，讓句子更豐富而不冗長。
            </p>
          </div>

          {/* Picker */}
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
                      className={`text-[9px] font-bold opacity-50 ${
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

          {/* Detail card */}
          <div
            key={activeId}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden"
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.05] flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                {activeSection.icon}
              </div>
              <div>
                <h3 className="text-white font-black text-2xl">
                  <span style={{ color: THEME.amber }}>
                    {activeSection.label}
                  </span>
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  {activeSection.labelZh} — {activeSection.tagline}
                </p>
              </div>
            </div>

            {activeId === "intro" && <IntroSection />}
            {activeId === "nonrestrictive" && <NonRestrictiveSection />}
            {activeId === "restrictive" && <RestrictiveSection />}
          </div>
        </div>
      </main>
    </>
  );
}
