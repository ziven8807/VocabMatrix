// frontend/app/learning/grammar/topic/articles/page.tsx

"use client";

import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type Example = {
  sentence: string;
  highlight: string;
  note: string;
};

type ArticleRule = {
  id: string;
  title: string;
  symbol: string;
  color: string;
  description: string;
  usage: { label: string; examples: Example[] }[];
};

// ─── Data (Theme Updated to Purple & Gold) ────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  gold: "#fbbf24",
};

const ARTICLE_RULES: ArticleRule[] = [
  {
    id: "a-an",
    title: "a / an (不定冠詞)",
    symbol: "A",
    color: THEME.gold, // 改為金色
    description: "用於可數名詞單數，表示「某一個」，且聽者不確定是哪一個。",
    usage: [
      {
        label: "第一次提到或泛指",
        examples: [
          {
            sentence: "I saw a dog in the park.",
            highlight: "a dog",
            note: "聽者不知道是哪隻狗",
          },
          {
            sentence: "She wants to be a doctor.",
            highlight: "a doctor",
            note: "職業通常用 a/an",
          },
        ],
      },
      {
        label: "發音判斷：a vs an",
        examples: [
          {
            sentence: "It takes an hour to get there.",
            highlight: "an hour",
            note: "h 不發音，開頭音是母音 /aʊ/",
          },
          {
            sentence: "He goes to a university.",
            highlight: "a university",
            note: "u 發音是子音 /j/",
          },
        ],
      },
    ],
  },
  {
    id: "the",
    title: "the (定冠詞)",
    symbol: "The",
    color: THEME.purple, // 維持紫色
    description: "表示「那個特定的」，雙方都知道在指哪一個對象。",
    usage: [
      {
        label: "重複提到或獨一無二",
        examples: [
          {
            sentence: "I saw a dog. The dog was barking.",
            highlight: "The dog",
            note: "第二次提到，變特定了",
          },
          {
            sentence: "The sun rises in the east.",
            highlight: "The sun",
            note: "獨一無二的事物",
          },
        ],
      },
      {
        label: "特定情境與最高級",
        examples: [
          {
            sentence: "Can you close the door?",
            highlight: "the door",
            note: "彼此知道是哪扇門",
          },
          {
            sentence: "She is the best student.",
            highlight: "the best",
            note: "最高級前面必加 the",
          },
        ],
      },
    ],
  },
  {
    id: "zero",
    title: "∅ (零冠詞)",
    symbol: "∅",
    color: "#64748b", // 維持中性灰
    description: "不加任何冠詞。通常用於泛指複數或不可數概念。",
    usage: [
      {
        label: "泛指複數與不可數",
        examples: [
          {
            sentence: "Dogs are loyal animals.",
            highlight: "Dogs",
            note: "泛指「狗」這類動物，非特定",
          },
          {
            sentence: "I love music and coffee.",
            highlight: "music",
            note: "不可數名詞泛指時不加冠詞",
          },
        ],
      },
      {
        label: "專有名詞",
        examples: [
          {
            sentence: "Taiwan is a beautiful island.",
            highlight: "Taiwan",
            note: "地名、城市名通常不加",
          },
          {
            sentence: "The United States is huge.",
            highlight: "The",
            note: "特定複數或組織名加 the",
          },
        ],
      },
    ],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(35px, 25px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
        {/* 背景裝飾 - 改為紫色 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `linear-gradient(${THEME.purple}60 1px, transparent 1px), linear-gradient(90deg, ${THEME.purple}60 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.purple}10 0%, transparent 70%)`,
              filter: "blur(90px)",
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
            <span style={{ color: THEME.purple }}>Articles</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Noun <span style={{ color: THEME.purple }}>Articles</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              冠詞決定了名詞的「遠近親疏」。
              <span className="text-white/70 ml-1">
                基本上只要問自己一個問題：「我和對方都知道是哪一個嗎？」
              </span>
              ，就能解決大部分的冠詞難題。
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {/* Decision Grid */}
            <div
              className="grid grid-cols-3 gap-4"
              style={{ animation: "fadeUp 0.4s ease both 0.2s" }}
            >
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  知道是哪一個嗎？
                </p>
                <p className="text-lg text-white font-bold">知道 (特定)</p>
                <div
                  className="mt-4 text-3xl font-black"
                  style={{ color: THEME.purple }}
                >
                  the
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  不知道 + 可數單數
                </p>
                <p className="text-lg text-white font-bold">不知道 (某個)</p>
                <div
                  className="mt-4 text-3xl font-black"
                  style={{ color: THEME.gold }}
                >
                  a / an
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  不知道 + 複數/不可數
                </p>
                <p className="text-lg text-white font-bold">泛指類別</p>
                <div className="mt-4 text-3xl font-black text-gray-500">∅</div>
              </div>
            </div>

            {/* Rules Sections */}
            <div className="space-y-6">
              {ARTICLE_RULES.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden"
                  style={{
                    animation: "fadeUp 0.4s ease both",
                    animationDelay: `${0.2 + idx * 0.1}s`,
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
                  <div className="p-6 grid grid-cols-2 gap-8">
                    {rule.usage.map((u, i) => (
                      <div key={i} className="space-y-3">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.15em]">
                          {u.label}
                        </p>
                        {u.examples.map((e, ei) => (
                          <div
                            key={ei}
                            className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]"
                          >
                            <p className="text-white text-sm">
                              {e.sentence.split(e.highlight)[0]}
                              <span
                                style={{ color: rule.color }}
                                className="font-bold underline underline-offset-4 mx-0.5"
                              >
                                {e.highlight}
                              </span>
                              {e.sentence.split(e.highlight)[1]}
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
