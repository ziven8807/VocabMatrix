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

type PrepId = "in_on_at" | "by" | "for" | "from";
type SubTabId = "place" | "time";

type Example = {
  en: string;
  zh: string;
  highlight: string;
};

type Usage = {
  rule: string;
  ruleZh: string;
  examples: Example[];
};

type PrepSection = {
  id: PrepId;
  word: string;
  color: string;
  descZh: string;
  icon: React.ReactNode;
  usages: Usage[];
  hasSubTab?: boolean;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
  Map: () => (
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
      <polygon points="3 6 9 3 15 6 21 3 21 21 15 18 9 21 3 18 3 6" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  ),
  Car: () => (
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
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-1" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M9 9h1l2 3h5" />
    </svg>
  ),
  Heart: () => (
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Arrow: () => (
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

// ─── Visual: In/On/At diagram ─────────────────────────────────────────────────

function PlaceDiagram({ active }: { active: "in" | "on" | "at" | null }) {
  return (
    <svg width="260" height="140" viewBox="0 0 260 140">
      {/* City block — IN */}
      <rect
        x="10"
        y="20"
        width="100"
        height="100"
        rx="8"
        fill={active === "in" ? `${THEME.teal}18` : "rgba(255,255,255,0.02)"}
        stroke={active === "in" ? THEME.teal : "#374151"}
        strokeWidth={active === "in" ? 2 : 1}
      />
      <text
        x="60"
        y="14"
        textAnchor="middle"
        fontSize="9"
        fill={active === "in" ? THEME.teal : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        IN
      </text>
      {/* Buildings */}
      <rect
        x="22"
        y="55"
        width="18"
        height="55"
        rx="2"
        fill={active === "in" ? `${THEME.teal}30` : "#1f2937"}
      />
      <rect
        x="46"
        y="40"
        width="22"
        height="70"
        rx="2"
        fill={active === "in" ? `${THEME.teal}30` : "#1f2937"}
      />
      <rect
        x="74"
        y="60"
        width="16"
        height="50"
        rx="2"
        fill={active === "in" ? `${THEME.teal}30` : "#1f2937"}
      />

      {/* Surface — ON */}
      <rect
        x="125"
        y="55"
        width="65"
        height="8"
        rx="3"
        fill={active === "on" ? `${THEME.amber}30` : "#1f2937"}
        stroke={active === "on" ? THEME.amber : "#374151"}
        strokeWidth={active === "on" ? 1.5 : 1}
      />
      <text
        x="157"
        y="42"
        textAnchor="middle"
        fontSize="9"
        fill={active === "on" ? THEME.amber : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        ON
      </text>
      {/* Object on surface */}
      <rect
        x="148"
        y="38"
        width="20"
        height="17"
        rx="2"
        fill={active === "on" ? `${THEME.amber}20` : "#111827"}
        stroke={active === "on" ? THEME.amber : "#374151"}
        strokeWidth="1"
      />
      <line
        x1="125"
        y1="63"
        x2="190"
        y2="63"
        stroke={active === "on" ? THEME.amber : "#374151"}
        strokeWidth={active === "on" ? 2 : 1}
        strokeDasharray="4 2"
      />

      {/* Pin — AT */}
      <circle
        cx="230"
        cy="75"
        r="10"
        fill={active === "at" ? `${THEME.rose}20` : "rgba(255,255,255,0.02)"}
        stroke={active === "at" ? THEME.rose : "#374151"}
        strokeWidth={active === "at" ? 2 : 1}
      />
      <circle
        cx="230"
        cy="75"
        r="3"
        fill={active === "at" ? THEME.rose : "#374151"}
      />
      <line
        x1="230"
        y1="85"
        x2="230"
        y2="105"
        stroke={active === "at" ? THEME.rose : "#374151"}
        strokeWidth={active === "at" ? 2 : 1}
      />
      <text
        x="230"
        y="42"
        textAnchor="middle"
        fontSize="9"
        fill={active === "at" ? THEME.rose : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        AT
      </text>
    </svg>
  );
}

function TimeDiagram({ active }: { active: "in" | "on" | "at" | null }) {
  return (
    <svg width="260" height="140" viewBox="0 0 260 140">
      {/* IN — long bar */}
      <rect
        x="10"
        y="50"
        width="90"
        height="16"
        rx="8"
        fill={active === "in" ? `${THEME.teal}25` : "rgba(255,255,255,0.03)"}
        stroke={active === "in" ? THEME.teal : "#374151"}
        strokeWidth={active === "in" ? 2 : 1}
      />
      <text
        x="55"
        y="38"
        textAnchor="middle"
        fontSize="9"
        fill={active === "in" ? THEME.teal : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        IN — 一段時間
      </text>
      <text
        x="55"
        y="82"
        textAnchor="middle"
        fontSize="9"
        fill={active === "in" ? `${THEME.teal}80` : "#374151"}
        fontFamily="monospace"
      >
        July / winter
      </text>

      {/* ON — mid bar */}
      <rect
        x="115"
        y="50"
        width="45"
        height="16"
        rx="8"
        fill={active === "on" ? `${THEME.amber}25` : "rgba(255,255,255,0.03)"}
        stroke={active === "on" ? THEME.amber : "#374151"}
        strokeWidth={active === "on" ? 2 : 1}
      />
      <text
        x="137"
        y="38"
        textAnchor="middle"
        fontSize="9"
        fill={active === "on" ? THEME.amber : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        ON — 特定日期
      </text>
      <text
        x="137"
        y="82"
        textAnchor="middle"
        fontSize="9"
        fill={active === "on" ? `${THEME.amber}80` : "#374151"}
        fontFamily="monospace"
      >
        Friday
      </text>

      {/* AT — point */}
      <circle
        cx="228"
        cy="58"
        r="9"
        fill={active === "at" ? `${THEME.rose}20` : "rgba(255,255,255,0.02)"}
        stroke={active === "at" ? THEME.rose : "#374151"}
        strokeWidth={active === "at" ? 2 : 1}
      />
      <circle
        cx="228"
        cy="58"
        r="3"
        fill={active === "at" ? THEME.rose : "#374151"}
      />
      <text
        x="228"
        y="38"
        textAnchor="middle"
        fontSize="9"
        fill={active === "at" ? THEME.rose : "#4b5563"}
        fontFamily="monospace"
        fontWeight="700"
      >
        AT — 時刻
      </text>
      <text
        x="228"
        y="82"
        textAnchor="middle"
        fontSize="9"
        fill={active === "at" ? `${THEME.rose}80` : "#374151"}
        fontFamily="monospace"
      >
        7 o&apos;clock
      </text>

      {/* Timeline base */}
      <line
        x1="10"
        y1="110"
        x2="250"
        y2="110"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      <polygon points="250,106 258,110 250,114" fill="#374151" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const IN_ON_AT_PLACE: Usage[] = [
  {
    rule: "in + 內部 / 較大範圍",
    ruleZh: "某地點內部或較大範圍的地點",
    examples: [
      { en: "in the city", zh: "在城市裡", highlight: "in" },
      { en: "in Taiwan", zh: "在台灣", highlight: "in" },
      { en: "in Taipei", zh: "在台北", highlight: "in" },
    ],
  },
  {
    rule: "on + 接觸面",
    ruleZh: "某接觸面或沿線",
    examples: [
      { en: "on the street", zh: "在街上", highlight: "on" },
      { en: "on a farm", zh: "在農場上", highlight: "on" },
      { en: "on the right", zh: "在右邊", highlight: "on" },
    ],
  },
  {
    rule: "at + 特定地點",
    ruleZh: "某個定點或特定地址",
    examples: [
      { en: "at home", zh: "在家", highlight: "at" },
      { en: "at the bus stop", zh: "在公車站", highlight: "at" },
      { en: "at the door", zh: "在門口", highlight: "at" },
    ],
  },
];

const IN_ON_AT_TIME: Usage[] = [
  {
    rule: "in + 一段時間",
    ruleZh: "月份、季節、年份、一天中的某段",
    examples: [
      { en: "in July", zh: "在七月", highlight: "in" },
      { en: "in the winter", zh: "在冬天", highlight: "in" },
      { en: "in the morning", zh: "在早上", highlight: "in" },
    ],
  },
  {
    rule: "on + 特定日期",
    ruleZh: "星期、日期、特定的某天",
    examples: [
      { en: "on Friday", zh: "在星期五", highlight: "on" },
      { en: "on September 16", zh: "在九月十六日", highlight: "on" },
      { en: "on the day I succeed", zh: "在我成功的那天", highlight: "on" },
    ],
  },
  {
    rule: "at + 特定時刻",
    ruleZh: "精確時間點、短暫的瞬間",
    examples: [
      { en: "at that time", zh: "在那個時候", highlight: "at" },
      { en: "at 7 o'clock", zh: "在七點鐘", highlight: "at" },
      { en: "at noon", zh: "在正午", highlight: "at" },
    ],
  },
];

const PREP_SECTIONS: PrepSection[] = [
  {
    id: "in_on_at",
    word: "in / on / at",
    color: THEME.teal,
    descZh: "最常見的三個介系詞，可用於地方與時間，依範圍大小或精確度區分。",
    icon: <Icons.Map />,
    hasSubTab: true,
    usages: IN_ON_AT_PLACE,
  },
  {
    id: "by",
    word: "by",
    color: THEME.sky,
    descZh: "表示方式、手段，或被動語態中的「被」。",
    icon: <Icons.Car />,
    usages: [
      {
        rule: "搭乘交通工具",
        ruleZh: "by + 交通工具（不加冠詞）",
        examples: [
          {
            en: "I go to school by bus.",
            zh: "我搭公車去上學。",
            highlight: "by bus",
          },
          {
            en: "She travels by train.",
            zh: "她搭火車旅行。",
            highlight: "by train",
          },
        ],
      },
      {
        rule: "藉由某方法",
        ruleZh: "by + 方法 / 動名詞",
        examples: [
          {
            en: "I get good grades by studying hard.",
            zh: "我藉由用功讀書來取得好成績。",
            highlight: "by studying hard",
          },
          {
            en: "She learned English by watching films.",
            zh: "她藉由看電影學英文。",
            highlight: "by watching films",
          },
        ],
      },
      {
        rule: "被動語態中的「被」",
        ruleZh: "被 + 人 / 物",
        examples: [
          {
            en: "I was punished by the teacher.",
            zh: "我被老師懲罰。",
            highlight: "by the teacher",
          },
          {
            en: "The book was written by her.",
            zh: "這本書是她寫的。",
            highlight: "by her",
          },
        ],
      },
    ],
  },
  {
    id: "for",
    word: "for",
    color: THEME.amber,
    descZh: "表示目的、對象或方向。",
    icon: <Icons.Heart />,
    usages: [
      {
        rule: "朝著某方向去",
        ruleZh: "for + 地方（動身前往）",
        examples: [
          {
            en: "She leaves for Japan tonight.",
            zh: "她今晚將會去日本。",
            highlight: "for Japan",
          },
          {
            en: "We set sail for Hawaii.",
            zh: "我們啟航前往夏威夷。",
            highlight: "for Hawaii",
          },
        ],
      },
      {
        rule: "為了某人 / 某事",
        ruleZh: "for + 人 / 物（目的、對象）",
        examples: [
          {
            en: "I came here for him.",
            zh: "我是為了他而來這的。",
            highlight: "for him",
          },
          {
            en: "She bought flowers for her mom.",
            zh: "她為她媽媽買了花。",
            highlight: "for her mom",
          },
        ],
      },
    ],
  },
  {
    id: "from",
    word: "from",
    color: THEME.rose,
    descZh: "表示來源、起點，常與 to 搭配表示範圍。",
    icon: <Icons.Arrow />,
    usages: [
      {
        rule: "來自 / 從某處",
        ruleZh: "from + 地點（來源、出發點）",
        examples: [
          {
            en: "I came from Taiwan.",
            zh: "我來自台灣。",
            highlight: "from Taiwan",
          },
          {
            en: "The package is from him.",
            zh: "這個包裹是他寄來的。",
            highlight: "from him",
          },
        ],
      },
      {
        rule: "from ... to ... 範圍",
        ruleZh: "from + 起點 + to + 終點",
        examples: [
          {
            en: "I did my homework from 2 to 3 o'clock.",
            zh: "我兩點到三點在寫作業。",
            highlight: "from 2 to 3",
          },
          {
            en: "The store is open from 9 to 5.",
            zh: "這家店從九點開到五點。",
            highlight: "from 9 to 5",
          },
        ],
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExampleCard({ ex, color }: { ex: Example; color: string }) {
  const parts = ex.en.split(ex.highlight);
  return (
    <div
      className="p-4 rounded-2xl border transition-all hover:border-white/10"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <p className="text-white text-base mb-1">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="font-black px-0.5" style={{ color }}>
                {ex.highlight}
              </span>
            )}
          </span>
        ))}
      </p>
      <p className="text-sm text-gray-500 italic">{ex.zh}</p>
    </div>
  );
}

function InOnAtVisual({
  subTab,
  hovered,
}: {
  subTab: SubTabId;
  hovered: "in" | "on" | "at" | null;
}) {
  return (
    <div className="flex justify-center py-4">
      {subTab === "place" ? (
        <PlaceDiagram active={hovered} />
      ) : (
        <TimeDiagram active={hovered} />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PrepositionsPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<PrepId>("in_on_at");
  const [subTab, setSubTab] = useState<SubTabId>("place");
  const [hovered, setHovered] = useState<"in" | "on" | "at" | null>(null);

  const activeSection = PREP_SECTIONS.find((s) => s.id === activeId)!;
  const usages =
    activeId === "in_on_at"
      ? subTab === "place"
        ? IN_ON_AT_PLACE
        : IN_ON_AT_TIME
      : activeSection.usages;

  const ruleColors: Record<string, string> = {
    in: THEME.teal,
    on: THEME.amber,
    at: THEME.rose,
  };

  function getRuleWord(rule: string): "in" | "on" | "at" | null {
    if (rule.startsWith("in")) return "in";
    if (rule.startsWith("on")) return "on";
    if (rule.startsWith("at")) return "at";
    return null;
  }

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
            <span className="text-violet-400">Prepositions</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Preposition <span className="text-violet-400">Guide</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              介系詞是英文中最容易混淆的詞類之一。掌握 in / on / at / by / for /
              from 的核心原則，讓你不再猜測，直覺就能用對。
            </p>
          </div>

          {/* Prep Picker */}
          <div
            className="grid grid-cols-4 gap-3 mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            {PREP_SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveId(s.id);
                    setSubTab("place");
                    setHovered(null);
                  }}
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
                    <span className="text-[13px] font-black tracking-tight">
                      {s.word}
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
            {/* Card Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                  {activeSection.icon}
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">
                    <span style={{ color: activeSection.color }}>
                      {activeSection.word}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {activeSection.descZh}
                  </p>
                </div>
              </div>

              {/* Sub-tab for in/on/at */}
              {activeSection.hasSubTab && (
                <div className="flex gap-2 mt-4">
                  {(["place", "time"] as SubTabId[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSubTab(tab);
                        setHovered(null);
                      }}
                      className="px-5 py-2 rounded-xl text-sm font-black transition-all duration-200 border"
                      style={{
                        background:
                          subTab === tab
                            ? `${THEME.teal}18`
                            : "rgba(255,255,255,0.02)",
                        color: subTab === tab ? THEME.teal : "#4b5563",
                        borderColor:
                          subTab === tab
                            ? `${THEME.teal}40`
                            : "rgba(255,255,255,0.06)",
                      }}
                    >
                      {tab === "place" ? "📍 地方 Place" : "🕐 時間 Time"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visual diagram for in/on/at */}
            {activeSection.hasSubTab && (
              <div
                className="px-8 py-4 border-b border-white/[0.04]"
                style={{ background: "rgba(255,255,255,0.01)" }}
              >
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black mb-2">
                  概念圖 Visual
                </p>
                <InOnAtVisual subTab={subTab} hovered={hovered} />
              </div>
            )}

            {/* Usage blocks */}
            <div className="p-8 space-y-8">
              {usages.map((usage, ui) => {
                const ruleWord = getRuleWord(usage.rule);
                const blockColor =
                  activeSection.hasSubTab && ruleWord
                    ? ruleColors[ruleWord]
                    : activeSection.color;

                return (
                  <div
                    key={ui}
                    className="rounded-2xl border p-6 transition-all duration-200"
                    style={{
                      borderColor:
                        activeSection.hasSubTab && hovered === ruleWord
                          ? `${blockColor}40`
                          : "rgba(255,255,255,0.05)",
                      background:
                        activeSection.hasSubTab && hovered === ruleWord
                          ? `${blockColor}05`
                          : "rgba(255,255,255,0.01)",
                    }}
                    onMouseEnter={() =>
                      activeSection.hasSubTab &&
                      ruleWord &&
                      setHovered(ruleWord)
                    }
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Rule header */}
                    <div className="flex items-start gap-3 mb-4">
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-black font-mono shrink-0"
                        style={{
                          background: `${blockColor}18`,
                          color: blockColor,
                          border: `1px solid ${blockColor}30`,
                        }}
                      >
                        {usage.rule.split(" ")[0]}
                      </span>
                      <div>
                        <p className="text-white font-bold text-sm">
                          {usage.rule}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {usage.ruleZh}
                        </p>
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {usage.examples.map((ex, ei) => (
                        <ExampleCard key={ei} ex={ex} color={blockColor} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
