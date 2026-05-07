// frontend/app/learning/grammar/topic/modification/page.tsx

"use client";

import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type ModificationPair = {
  from: string;
  to: string;
  example: string;
  highlight: string;
  description: string;
  color: string;
};

type AdvancedItem = {
  from: string;
  to: string;
  example: string;
  highlight: string;
  note: string;
};

type AdvancedSection = {
  title: string;
  items: AdvancedItem[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  gold: "#fbbf24",
};

const BASIC_MODS: ModificationPair[] = [
  {
    from: "Adj",
    to: "Noun",
    example: "She has a beautiful dress.",
    highlight: "beautiful",
    description: "形容詞修飾名詞，描述特質或狀態。通常放在名詞前。",
    color: THEME.gold,
  },
  {
    from: "Adv",
    to: "Verb",
    example: "She runs quickly.",
    highlight: "quickly",
    description: "副詞修飾動詞，描述動作進行的方式、程度或頻率。",
    color: THEME.gold,
  },
];

const ADVANCED_MODS: AdvancedSection[] = [
  {
    title: "副詞 (Adv) 的多功能修飾",
    items: [
      {
        from: "Adv",
        to: "Adj",
        example: "He is very tall.",
        highlight: "very",
        note: "修飾形容詞（程度）",
      },
      {
        from: "Adv",
        to: "Adv",
        example: "She sings incredibly well.",
        highlight: "incredibly",
        note: "修飾另一個副詞",
      },
      {
        from: "Adv",
        to: "Sentence",
        example: "Fortunately, we arrived on time.",
        highlight: "Fortunately",
        note: "修飾整個句子",
      },
    ],
  },
  {
    title: "其他的修飾可能",
    items: [
      {
        from: "Noun",
        to: "Noun",
        example: "Chicken soup",
        highlight: "Chicken",
        note: "名詞修飾名詞（類別）",
      },
      {
        from: "V-ing/pp",
        to: "Noun",
        example: "The crying baby / A broken window",
        highlight: "crying / broken",
        note: "動詞分詞當形容詞用",
      },
      {
        from: "Prep.",
        to: "Noun",
        example: "The book on the table",
        highlight: "on the table",
        note: "介系詞片語修飾名詞",
      },
    ],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ModificationPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 20px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
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
              animation: "float 20s ease-in-out infinite",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb - 確保字重一致 */}
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
            <span style={{ color: THEME.purple }}>Modification</span>
          </div>

          {/* Header - 修正引言字體大小與顏色一致性 */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Word <span style={{ color: THEME.purple }}>Modification</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              修飾語決定了句子的精細度。
              <span className="text-white/70 mx-1">
                我們統一使用黃色標註形容詞與副詞
              </span>
              ，觀察它們如何賦予名詞與動作具體的特質。
            </p>
          </div>

          {/* 基礎規則 */}
          <div
            className="grid grid-cols-2 gap-6 mb-16"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            {BASIC_MODS.map((mod) => (
              <div
                key={mod.from + mod.to}
                className="p-8 rounded-[32px] border relative overflow-hidden group transition-all"
                style={{
                  borderColor: `${THEME.purple}25`,
                  backgroundColor: "#111",
                }}
              >
                <div className="flex items-center justify-between mb-10">
                  <div
                    className="px-5 py-2 rounded-xl font-mono font-black text-sm bg-yellow-500/20"
                    style={{ color: THEME.gold }}
                  >
                    {mod.from}
                  </div>
                  <div className="text-gray-600 text-[11px] font-black tracking-[0.2em]">
                    MODIFIES
                  </div>
                  <div className="px-5 py-2 rounded-xl font-mono font-black text-sm bg-white/10 text-white">
                    {mod.to}
                  </div>
                </div>
                <h3 className="text-white text-2xl font-bold mb-4 tracking-tight">
                  {mod.example.split(mod.highlight)[0]}
                  <span
                    style={{ color: THEME.gold }}
                    className="underline underline-offset-8 decoration-yellow-500/40"
                  >
                    {mod.highlight}
                  </span>
                  {mod.example.split(mod.highlight)[1]}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>

          {/* 進階規則 - 保持易讀性的大標題與亮白色箭頭 */}
          <div className="space-y-16">
            {ADVANCED_MODS.map((section, sIdx) => (
              <div
                key={section.title}
                style={{
                  animation: "fadeUp 0.4s ease both",
                  animationDelay: `${0.2 + sIdx * 0.1}s`,
                }}
              >
                <h2 className="text-base font-black text-gray-200 uppercase tracking-[0.2em] mb-8 flex items-center gap-6">
                  {section.title}
                  <div className="h-px flex-1 bg-white/20" />
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {section.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="group flex items-center justify-between p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                    >
                      <div className="flex items-center gap-10">
                        <div className="flex items-center font-mono text-sm min-w-[140px]">
                          <span className="text-yellow-500 font-bold">
                            {item.from}
                          </span>
                          <span className="mx-4 text-white font-black">→</span>
                          <span className="text-gray-300">{item.to}</span>
                        </div>
                        <div className="text-white font-bold text-lg">
                          {item.example.split(item.highlight)[0]}
                          <span
                            style={{ color: THEME.gold }}
                            className="mx-0.5"
                          >
                            {item.highlight}
                          </span>
                          {item.example.split(item.highlight)[1]}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full font-medium italic">
                        {item.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 特別注意區塊 */}
          <div
            className="mt-20 p-10 rounded-[40px] border relative overflow-hidden"
            style={{
              animation: "fadeUp 0.4s ease both 0.4s",
              borderColor: `${THEME.purple}30`,
              backgroundColor: "#0f0f0f",
            }}
          >
            <h3
              style={{ color: THEME.gold }}
              className="font-black text-xl mb-6 flex items-center gap-3"
            >
              💡 特別注意：連繫動詞
            </h3>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              連繫動詞（Linking Verbs）描述的是主詞的狀態，因此後面接的是
              <b className="text-white px-1">形容詞</b>而非副詞。
            </p>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="p-6 rounded-2xl bg-black border border-white/[0.1] hover:border-yellow-500/30 transition-colors">
                <p
                  style={{ color: THEME.gold }}
                  className="font-black text-xl mb-2"
                >
                  He is happy.
                </p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  happy 修飾主詞 He
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-black border border-white/[0.1] hover:border-yellow-500/30 transition-colors">
                <p
                  style={{ color: THEME.gold }}
                  className="font-black text-xl mb-2"
                >
                  I feel tired.
                </p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  tired 修飾主詞 I
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
