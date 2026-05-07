"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type TenseId = "simple" | "continuous" | "perfect" | "perfectContinuous";
type TimeId = "present" | "past" | "future";

type TenseCell = {
  formula: string[];
  example: string;
  highlight: string;
  note: string;
  usage: string;
};

type TenseData = {
  [time in TimeId]: TenseCell;
};

type TenseSection = {
  id: TenseId;
  title: string;
  titleZh: string;
  icon: React.ReactNode;
  color: string;
  shortLabel: string;
  hint: string;
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
  Dot: () => (
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
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  Wave: () => (
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
      <path d="M2 12c1.5-3 3-4.5 4.5-4.5S9 9 10.5 9s3-1.5 4.5-1.5S18 9 19.5 9 21 7.5 22 6" />
      <path d="M2 18c1.5-3 3-4.5 4.5-4.5S9 15 10.5 15s3-1.5 4.5-1.5S18 15 19.5 15 21 13.5 22 12" />
    </svg>
  ),
  Check: () => (
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Infinity: () => (
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
      <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" />
      <path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
    </svg>
  ),
};

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEME = {
  purple: "#a78bfa",
  amber: "#fbbf24",
  teal: "#2dd4bf",
  rose: "#fb7185",
};

// ─── Tense Data ───────────────────────────────────────────────────────────────

const TIME_LABELS: {
  id: TimeId;
  label: string;
  labelZh: string;
  color: string;
}[] = [
  { id: "present", label: "Present", labelZh: "現在式", color: THEME.teal },
  { id: "past", label: "Past", labelZh: "過去式", color: THEME.rose },
  { id: "future", label: "Future", labelZh: "未來式", color: THEME.purple },
];

const TENSE_SECTIONS: TenseSection[] = [
  {
    id: "simple",
    title: "Simple",
    titleZh: "簡單式",
    icon: <Icons.Dot />,
    color: THEME.amber,
    shortLabel: "一次性動作",
    hint: "V / Ved / will V",
  },
  {
    id: "continuous",
    title: "Continuous",
    titleZh: "進行式",
    icon: <Icons.Wave />,
    color: THEME.amber,
    shortLabel: "持續進行中",
    hint: "be + V-ing",
  },
  {
    id: "perfect",
    title: "Perfect",
    titleZh: "完成式",
    icon: <Icons.Check />,
    color: THEME.amber,
    shortLabel: "已完成動作",
    hint: "have + Vpp",
  },
  {
    id: "perfectContinuous",
    title: "Perfect Continuous",
    titleZh: "完成進行式",
    icon: <Icons.Infinity />,
    color: THEME.amber,
    shortLabel: "持續到某時點",
    hint: "have been + V-ing",
  },
];

const TENSE_DATA: Record<TenseId, TenseData> = {
  simple: {
    present: {
      formula: ["S", "+", "V / be", "(am, are, is)"],
      example: "She writes every day.",
      highlight: "writes",
      note: "習慣、事實、規律",
      usage: "用於描述日常習慣、不變的事實或反覆發生的動作。",
    },
    past: {
      formula: ["S", "+", "Ved / be", "(was, were)"],
      example: "She wrote a letter yesterday.",
      highlight: "wrote",
      note: "過去某時已完成",
      usage: "表示過去某個特定時間點發生並結束的動作。",
    },
    future: {
      formula: [
        "1.",
        "S",
        "+",
        "am/are/is",
        "+",
        "going to",
        "+",
        "V",
        "  2.",
        "S",
        "+",
        "will",
        "+",
        "V",
      ],
      example: "She will write tomorrow.",
      highlight: "will write",
      note: "未來計劃或預測",
      usage: "表示未來的計劃、意圖或預測將要發生的事。",
    },
  },
  continuous: {
    present: {
      formula: ["S", "+", "be (am, are, is)", "+", "V-ing"],
      example: "She is writing right now.",
      highlight: "is writing",
      note: "此刻正在進行",
      usage: "表示說話當下正在進行的動作，或暫時性的行為。",
    },
    past: {
      formula: ["S", "+", "was / were", "+", "V-ing"],
      example: "She was writing when I called.",
      highlight: "was writing",
      note: "過去某時正在進行",
      usage: "描述過去某個時間點正在持續進行的動作，常與過去簡單式搭配。",
    },
    future: {
      formula: ["S", "+", "will be", "+", "V-ing"],
      example: "She will be writing at 8 PM.",
      highlight: "will be writing",
      note: "未來某時正在進行",
      usage: "表示未來某個特定時間點將正在進行的動作。",
    },
  },
  perfect: {
    present: {
      formula: ["S", "+", "have / has", "+", "Vpp"],
      example: "She has written three books.",
      highlight: "has written",
      note: "過去完成，影響現在",
      usage: "表示過去某動作已完成，且結果或影響延續至現在。",
    },
    past: {
      formula: ["S", "+", "had", "+", "Vpp"],
      example: "She had written the report before noon.",
      highlight: "had written",
      note: "過去的過去已完成",
      usage: "表示在過去某時間點之前已經完成的動作（過去的過去）。",
    },
    future: {
      formula: ["S", "+", "will have", "+", "Vpp"],
      example: "She will have written 10 chapters by June.",
      highlight: "will have written",
      note: "到未來某點將完成",
      usage: "表示到未來某個時間點為止將已經完成的動作。",
    },
  },
  perfectContinuous: {
    present: {
      formula: ["S", "+", "have / has been", "+", "V-ing"],
      example: "She has been writing for two hours.",
      highlight: "has been writing",
      note: "從過去持續到現在",
      usage: "強調從過去某點開始、持續進行到現在的動作，通常帶有時間長度。",
    },
    past: {
      formula: ["S", "+", "had been", "+", "V-ing"],
      example: "She had been writing for an hour when he arrived.",
      highlight: "had been writing",
      note: "持續到過去某時點",
      usage: "表示在過去某時間點之前一直持續進行的動作。",
    },
    future: {
      formula: ["S", "+", "will have been", "+", "V-ing"],
      example: "She will have been writing for 3 hours by 9 PM.",
      highlight: "will have been writing",
      note: "到未來某點將持續完成",
      usage: "表示到未來某時間點為止，將已經持續進行了一段時間的動作。",
    },
  },
};

// ─── Timeline Visual ──────────────────────────────────────────────────────────

function TimelineViz({
  tenseId,
  timeId,
}: {
  tenseId: TenseId;
  timeId: TimeId;
}) {
  const configs: Record<
    TenseId,
    Record<
      TimeId,
      {
        past: number;
        present: number;
        future: number;
        bar?: [number, number];
        label: string;
        dotStyle?: string;
      }
    >
  > = {
    simple: {
      present: {
        past: 0,
        present: 1,
        future: 0,
        label: "NOW",
        dotStyle: "ring",
      },
      past: {
        past: 1,
        present: 0,
        future: 0,
        label: "THEN",
        dotStyle: "solid",
      },
      future: {
        past: 0,
        present: 0,
        future: 1,
        label: "SOON",
        dotStyle: "outline",
      },
    },
    continuous: {
      present: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.3, 0.7],
        label: "NOW →",
        dotStyle: "ring",
      },
      past: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.05, 0.45],
        label: "← THEN →",
        dotStyle: "solid",
      },
      future: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.6, 0.95],
        label: "← SOON →",
        dotStyle: "outline",
      },
    },
    perfect: {
      present: {
        past: 1,
        present: 1,
        future: 0,
        bar: [0, 0.5],
        label: "DONE → NOW",
        dotStyle: "ring",
      },
      past: {
        past: 1,
        present: 0,
        future: 0,
        bar: [0, 0.3],
        label: "DONE → THEN",
        dotStyle: "solid",
      },
      future: {
        past: 0,
        present: 0,
        future: 1,
        bar: [0.5, 1],
        label: "→ DONE",
        dotStyle: "outline",
      },
    },
    perfectContinuous: {
      present: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.1, 0.5],
        label: "SINCE → NOW",
        dotStyle: "ring",
      },
      past: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.05, 0.4],
        label: "SINCE → THEN",
        dotStyle: "solid",
      },
      future: {
        past: 0,
        present: 0,
        future: 0,
        bar: [0.55, 0.95],
        label: "SINCE → DONE",
        dotStyle: "outline",
      },
    },
  };

  const cfg = configs[tenseId][timeId];
  const timeColor = TIME_LABELS.find((t) => t.id === timeId)!.color;
  const WIDTH = 280;
  const H = 48;
  const pastX = 40,
    nowX = 140,
    futureX = 240;

  return (
    <svg width={WIDTH} height={H} viewBox={`0 0 ${WIDTH} ${H}`}>
      {/* Base line */}
      <line
        x1="20"
        y1="24"
        x2="260"
        y2="24"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Filled bar */}
      {cfg.bar && (
        <line
          x1={20 + cfg.bar[0] * 240}
          y1="24"
          x2={20 + cfg.bar[1] * 240}
          y2="24"
          stroke={timeColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}

      {/* Past dot */}
      <circle
        cx={pastX}
        cy="24"
        r="5"
        fill={cfg.past ? timeColor : "#1f2937"}
        stroke={cfg.past ? timeColor : "#374151"}
        strokeWidth="2"
      />

      {/* Now dot */}
      <circle
        cx={nowX}
        cy="24"
        r="6"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
      />
      <circle
        cx={nowX}
        cy="24"
        r="3"
        fill={cfg.present ? timeColor : "#374151"}
      />

      {/* Future dot */}
      <circle
        cx={futureX}
        cy="24"
        r="5"
        fill={cfg.future ? timeColor : "#1f2937"}
        stroke={cfg.future ? timeColor : "#374151"}
        strokeWidth="2"
        strokeDasharray={cfg.dotStyle === "outline" ? "3 2" : "none"}
      />

      {/* Labels */}
      <text
        x={pastX}
        y="10"
        textAnchor="middle"
        fontSize="8"
        fill="#4b5563"
        fontFamily="monospace"
      >
        PAST
      </text>
      <text
        x={nowX}
        y="10"
        textAnchor="middle"
        fontSize="8"
        fill="#6b7280"
        fontFamily="monospace"
      >
        NOW
      </text>
      <text
        x={futureX}
        y="10"
        textAnchor="middle"
        fontSize="8"
        fill="#4b5563"
        fontFamily="monospace"
      >
        FUTURE
      </text>
    </svg>
  );
}

// ─── Formula Pill ─────────────────────────────────────────────────────────────

function FormulaPill({ parts, timeId }: { parts: string[]; timeId: TimeId }) {
  const timeColor = TIME_LABELS.find((t) => t.id === timeId)!.color;

  // Keywords that should be highlighted in amber
  const KEYWORDS = [
    "V",
    "Vpp",
    "V-ing",
    "be",
    "will",
    "have",
    "has",
    "had",
    "going to",
    "am/are/is",
    "was/were",
    "will be",
    "will have",
    "will have been",
    "have / has",
    "have / has been",
    "had been",
    "be (am, are, is)",
    "was / were",
    "V / be",
    "Ved / be",
  ];

  const isKeyword = (part: string) => KEYWORDS.includes(part);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((part, i) => {
        // "+" operator
        if (part === "+")
          return (
            <span key={i} className="text-gray-600 font-bold text-sm">
              +
            </span>
          );

        // "S" subject pill — coloured by time
        if (part === "S")
          return (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-xs font-black font-mono border"
              style={{
                borderColor: `${timeColor}30`,
                color: timeColor,
                background: `${timeColor}10`,
              }}
            >
              S
            </span>
          );

        // Numbered labels "1." "2."
        if (/^\d+\.$/.test(part.trim()))
          return (
            <span key={i} className="text-gray-500 text-xs font-bold pl-2">
              {part.trim()}
            </span>
          );

        // Everything else — amber if keyword, grey otherwise
        return (
          <span
            key={i}
            className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
            style={{
              background: isKeyword(part)
                ? `${THEME.amber}15`
                : "rgba(255,255,255,0.04)",
              color: isKeyword(part) ? THEME.amber : "#9ca3af",
              border: `1px solid ${
                isKeyword(part) ? `${THEME.amber}25` : "rgba(255,255,255,0.05)"
              }`,
            }}
          >
            {part}
          </span>
        );
      })}
    </div>
  );
}

// ─── Tense Grid Table ─────────────────────────────────────────────────────────

function TenseGrid({
  activeTense,
  activeTime,
  onCellClick,
}: {
  activeTense: TenseId;
  activeTime: TimeId;
  onCellClick: (tense: TenseId, time: TimeId) => void;
}) {
  return (
    <div
      className="rounded-3xl overflow-hidden border"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {/* Header row */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "150px 1fr 1fr 1fr" }}
      >
        <div
          className="px-5 py-5 border-b border-r"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        />
        {TIME_LABELS.map((t) => (
          <div
            key={t.id}
            className="px-4 py-5 text-center border-b border-r last:border-r-0 transition-colors"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              color: activeTime === t.id ? t.color : "#4b5563",
            }}
          >
            <div className="text-[13px] font-black tracking-widest uppercase">
              {t.label}
            </div>
            <div className="text-[11px] mt-1 opacity-60">{t.labelZh}</div>
          </div>
        ))}
      </div>

      {/* Rows */}
      {TENSE_SECTIONS.map((section) => (
        <div
          key={section.id}
          className="grid border-b last:border-b-0"
          style={{
            gridTemplateColumns: "150px 1fr 1fr 1fr",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {/* Row header */}
          <div
            className="px-5 py-6 border-r flex flex-col justify-center"
            style={{
              borderColor: "rgba(255,255,255,0.05)",
              background:
                activeTense === section.id
                  ? `${THEME.purple}08`
                  : "transparent",
            }}
          >
            <div
              className="text-[13px] font-black tracking-widest uppercase"
              style={{
                color: activeTense === section.id ? THEME.amber : "#4b5563",
              }}
            >
              {section.title}
            </div>
            <div
              className="text-[11px] mt-1"
              style={{
                color:
                  activeTense === section.id ? `${THEME.amber}80` : "#374151",
              }}
            >
              {section.titleZh}
            </div>
          </div>

          {/* Cells */}
          {TIME_LABELS.map((time) => {
            const cell = TENSE_DATA[section.id][time.id];
            const isActive =
              activeTense === section.id && activeTime === time.id;
            const isRowActive = activeTense === section.id;
            const isColActive = activeTime === time.id;
            return (
              <button
                key={time.id}
                onClick={() => onCellClick(section.id, time.id)}
                className="px-4 py-5 border-r last:border-r-0 text-left transition-all duration-200 hover:bg-white/[0.03] group"
                style={{
                  borderColor: "rgba(255,255,255,0.05)",
                  background: isActive
                    ? `${THEME.amber}08`
                    : isRowActive || isColActive
                    ? "rgba(255,255,255,0.01)"
                    : "transparent",
                  outline: isActive ? `1.5px solid ${THEME.amber}40` : "none",
                  outlineOffset: "-1px",
                }}
              >
                <div
                  className="text-[13px] font-mono leading-relaxed mb-2"
                  style={{
                    color: isActive
                      ? THEME.amber
                      : isRowActive || isColActive
                      ? "#6b7280"
                      : "#4b5563",
                  }}
                >
                  {cell.formula
                    .filter((f) => f !== "+")
                    .map((f, i) => {
                      if (/^\d+\.$/.test(f.trim()))
                        return (
                          <span key={i} className="block mt-0.5">
                            {f.trim()}{" "}
                          </span>
                        );
                      return <span key={i}>{f} </span>;
                    })}
                </div>
                <div
                  className="text-[12px] leading-snug"
                  style={{
                    color: isActive ? `${time.color}90` : "#374151",
                    whiteSpace: "normal",
                  }}
                >
                  {cell.example}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TensesPage() {
  const router = useRouter();
  const [activeTense, setActiveTense] = useState<TenseId>("simple");
  const [activeTime, setActiveTime] = useState<TimeId>("present");

  const activeCell = TENSE_DATA[activeTense][activeTime];
  const activeTimeInfo = TIME_LABELS.find((t) => t.id === activeTime)!;
  const activeTenseInfo = TENSE_SECTIONS.find((s) => s.id === activeTense)!;

  function handleCellClick(tense: TenseId, time: TimeId) {
    setActiveTense(tense);
    setActiveTime(time);
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(35px, 25px); } }
        @keyframes pulse-soft { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
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
            className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.teal}06 0%, transparent 70%)`,
              filter: "blur(80px)",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
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
            <span className="text-violet-400">Tenses</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              English <span className="text-violet-400">Tenses</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              英語共有 12
              種時態，由「時間」（現在、過去、未來）與「態」（簡單、進行、完成、完成進行）組合而成。點擊表格中的任一格，深入了解每種時態。
              實際優先順序建議：
              第一優先（一定要精通）：現在簡單式、過去簡單式、未來簡單式、現在完成式
              第二優先（要會用）：過去完成式、現在進行式、過去進行式
              第三優先（看懂即可，高分才需主動用）：未來完成式、現在完成進行式、過去完成進行式、未來進行式、未來完成進行式
            </p>
          </div>

          {/* Tense Picker row */}
          <div
            className="grid grid-cols-4 gap-3 mb-6"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            {TENSE_SECTIONS.map((s) => {
              const isActive = activeTense === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTense(s.id)}
                  className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-black transition-all duration-300 border"
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
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-tight">
                      {s.title}
                    </span>
                    <span className="text-[9px] font-bold opacity-50">
                      {s.titleZh}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time picker row */}
          <div
            className="flex gap-3 mb-8"
            style={{ animation: "fadeUp 0.4s ease both 0.18s" }}
          >
            {TIME_LABELS.map((t) => {
              const isActive = activeTime === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTime(t.id)}
                  className="flex-1 py-3 rounded-xl font-black text-sm transition-all duration-300 border"
                  style={{
                    background: isActive
                      ? `${t.color}18`
                      : "rgba(255,255,255,0.02)",
                    color: isActive ? t.color : "#4b5563",
                    borderColor: isActive
                      ? `${t.color}50`
                      : "rgba(255,255,255,0.06)",
                    boxShadow: isActive ? `0 0 20px ${t.color}20` : "none",
                  }}
                >
                  {t.label}{" "}
                  <span className="text-xs opacity-60 font-normal">
                    {t.labelZh}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive grid */}
          <div
            className="mb-8"
            style={{ animation: "fadeUp 0.4s ease both 0.22s" }}
          >
            <TenseGrid
              activeTense={activeTense}
              activeTime={activeTime}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Detail Panel */}
          <div
            key={`${activeTense}-${activeTime}`}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-8"
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-6 mb-8 pb-6 border-b border-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                  {activeTenseInfo.icon}
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">
                    {activeTimeInfo.label}{" "}
                    <span style={{ color: THEME.amber }}>
                      {activeTenseInfo.title}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {activeTimeInfo.labelZh} {activeTenseInfo.titleZh}
                  </p>
                </div>
              </div>
              {/* Timeline visual */}
              <div className="shrink-0 opacity-80">
                <TimelineViz tenseId={activeTense} timeId={activeTime} />
              </div>
            </div>

            {/* Formula */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black mb-3">
                公式 Formula
              </p>
              <div
                className="p-4 rounded-2xl border"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <FormulaPill parts={activeCell.formula} timeId={activeTime} />
              </div>
            </div>

            {/* Example */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black mb-3">
                範例 Example
              </p>
              <div
                className="p-5 rounded-2xl border hover:border-violet-500/20 transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-white text-lg mb-2">
                  {activeCell.example
                    .split(activeCell.highlight)
                    .map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span
                            style={{ color: THEME.amber }}
                            className="font-black px-1"
                          >
                            {activeCell.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                </p>
                <p className="text-sm text-gray-500 italic">
                  {activeCell.note}
                </p>
              </div>
            </div>

            {/* Usage */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black mb-3">
                使用時機 Usage
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                {activeCell.usage}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
