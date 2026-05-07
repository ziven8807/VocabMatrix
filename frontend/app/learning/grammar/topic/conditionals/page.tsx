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
  green: "#4ade80",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId = "zero" | "first" | "second" | "third";

type Section = {
  id: SectionId;
  label: string;
  labelZh: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  Zero: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="12" rx="6" ry="10" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  ),
  One: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="4" x2="12" y2="20" />
      <polyline points="8 8 12 4 16 8" />
    </svg>
  ),
  Two: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 8a5 5 0 0 1 10 0c0 3-5 6-5 6" />
      <line x1="12" y1="20" x2="12" y2="20" />
    </svg>
  ),
  Three: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7a5 5 0 0 1 9.9-1M7 17a5 5 0 0 0 9.9 1" />
      <line x1="12" y1="11" x2="16" y2="11" />
    </svg>
  ),
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "zero",
    label: "Zero",
    labelZh: "零類條件句",
    icon: <Icons.Zero />,
    color: THEME.green,
    tagline: "100% 事實 · 物理定律",
  },
  {
    id: "first",
    label: "1st",
    labelZh: "第一類",
    icon: <Icons.One />,
    color: THEME.amber,
    tagline: "未來可能發生",
  },
  {
    id: "second",
    label: "2nd",
    labelZh: "第二類",
    icon: <Icons.Two />,
    color: THEME.sky,
    tagline: "與現在事實相反",
  },
  {
    id: "third",
    label: "3rd",
    labelZh: "第三類",
    icon: <Icons.Three />,
    color: THEME.rose,
    tagline: "與過去事實相反",
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

function FormulaRow({
  label,
  val,
  color,
}: {
  label: string;
  val: string;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <span className="text-xs font-black w-24 shrink-0" style={{ color }}>
        {label}
      </span>
      <span className="font-mono text-sm text-white tracking-wide">{val}</span>
    </div>
  );
}

function SentenceCard({
  en,
  zh,
  highlight,
  color,
  note,
  isWrong,
}: {
  en: string;
  zh: string;
  highlight?: string;
  color: string;
  note?: string;
  isWrong?: boolean;
}) {
  const c = isWrong ? THEME.rose : color;
  const parts = highlight ? en.split(highlight) : null;
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        background: isWrong ? `${THEME.rose}08` : "rgba(255,255,255,0.02)",
        borderColor: isWrong ? `${THEME.rose}30` : "rgba(255,255,255,0.05)",
      }}
    >
      <p className="font-mono text-sm text-white mb-1">
        {parts
          ? parts.map((seg, i) => (
              <span key={i}>
                {seg}
                {i < parts.length - 1 && (
                  <span className="font-black" style={{ color: c }}>
                    {highlight}
                  </span>
                )}
              </span>
            ))
          : en}
      </p>
      <p
        className="text-xs italic"
        style={{ color: isWrong ? THEME.rose : "#6b7280" }}
      >
        {zh}
      </p>
      {note && (
        <p
          className="text-[11px] mt-2 px-2 py-1 rounded-lg inline-block"
          style={{ background: `${c}10`, color: `${c}90` }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Overview Section (now always visible above tabs) ─────────────────────────

const OVERVIEW_ROWS = [
  {
    type: "零類 Zero",
    time: "任何時間",
    prob: "100%",
    color: THEME.green,
    en: "If you drop a glass, it breaks.",
    zh: "如果你摔破玻璃，它會碎。",
  },
  {
    type: "第一類 1st",
    time: "未來",
    prob: "高（可能）",
    color: THEME.amber,
    en: "If it is sunny, I will go out.",
    zh: "如果明天晴天，我就出門。",
  },
  {
    type: "第二類 2nd",
    time: "現在",
    prob: "極低（假設）",
    color: THEME.sky,
    en: "If I won the lottery, I would quit.",
    zh: "如果我中大獎，我就辭職。",
  },
  {
    type: "第三類 3rd",
    time: "過去",
    prob: "0%（已發生）",
    color: THEME.rose,
    en: "If I had slept more, I would have been energetic.",
    zh: "如果我那時多睡點，我就有精神了。",
  },
];

function OverviewTable({
  onRowClick,
}: {
  onRowClick: (id: SectionId) => void;
}) {
  const ids: SectionId[] = ["zero", "first", "second", "third"];

  return (
    <div className="space-y-5 mb-10">
      {/* Intro blurb */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.purple}25`,
          background: `${THEME.purple}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.purple }}
        >
          條件句是什麼？
        </p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          條件句（Conditionals）是帶有「假如、如果」含義的句型，由{" "}
          <span className="font-black text-white">if 子句</span>（條件）和
          <span className="font-black text-white">主要子句</span>（結果）組成。
          根據情境的時間點與可能性，英文條件句分為四種類型。
        </p>
        <div
          className="p-4 rounded-xl"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <p className="font-mono text-base text-white mb-1">
            If I were you, I would accept that offer.
          </p>
          <p className="text-xs text-gray-500 italic">
            如果我是你，我會接受那個提案。（第二類：與現在事實相反）
          </p>
        </div>
      </div>

      {/* Overview table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Header */}
        <div
          className="grid text-[10px] font-black uppercase tracking-widest border-b"
          style={{
            gridTemplateColumns: "1.2fr 0.8fr 1fr 2fr",
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["類型", "時間點", "可能性", "例句"].map((h) => (
            <div key={h} className="px-4 py-3 text-gray-600">
              {h}
            </div>
          ))}
        </div>
        {OVERVIEW_ROWS.map((row, i) => (
          <div
            key={i}
            className="grid border-b last:border-0 items-start hover:bg-white/[0.03] transition-colors cursor-pointer group"
            style={{
              gridTemplateColumns: "1.2fr 0.8fr 1fr 2fr",
              borderColor: "rgba(255,255,255,0.04)",
            }}
            onClick={() => onRowClick(ids[i])}
            title={`點擊查看${row.type}詳細說明`}
          >
            <div
              className="px-4 py-4 font-black text-sm flex items-center gap-1.5"
              style={{ color: row.color }}
            >
              {row.type}
              <span
                className="opacity-0 group-hover:opacity-60 transition-opacity text-[10px]"
                style={{ color: row.color }}
              >
                →
              </span>
            </div>
            <div className="px-4 py-4 text-xs text-gray-400">{row.time}</div>
            <div className="px-4 py-4 text-xs" style={{ color: row.color }}>
              {row.prob}
            </div>
            <div className="px-4 py-4">
              <p className="font-mono text-xs text-white mb-1">{row.en}</p>
              <p className="text-[11px] text-gray-500 italic">{row.zh}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="text-center text-[11px] text-gray-600">
        點擊任一列，或使用下方按鈕，查看詳細說明 ↓
      </p>
    </div>
  );
}

// ─── Zero Section ─────────────────────────────────────────────────────────────

function ZeroSection() {
  return (
    <div className="p-8 space-y-5">
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.green}25`,
          background: `${THEME.green}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.green }}
        >
          用途
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          零類條件句呈現一種
          <span className="font-black text-white">必然性</span>
          ——條件一旦觸發，結果必然發生。
          適用於真理、物理法則、科學事實等不可辯駁的客觀情況。
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[11px] uppercase tracking-widest font-black mb-3 text-gray-600">
          公式
        </p>
        <div className="space-y-2">
          <FormulaRow label="If 子句" val="現在簡單式" color={THEME.green} />
          <FormulaRow label="主要子句" val="現在簡單式" color={THEME.green} />
        </div>
      </div>

      <div className="space-y-2">
        {[
          {
            en: "If water reaches 100 degrees, it boils.",
            zh: "如果水到達 100 度，它就會沸騰。",
            highlight: "reaches 100 degrees, it boils",
          },
          {
            en: "If you heat ice, it melts.",
            zh: "如果你加熱冰，它就會融化。",
            highlight: "heat ice, it melts",
          },
          {
            en: "If you drop a glass, it breaks.",
            zh: "如果你把玻璃摔落，它就會碎。",
            highlight: "drop a glass, it breaks",
          },
        ].map((ex, i) => (
          <SentenceCard key={i} {...ex} color={THEME.green} />
        ))}
      </div>

      <div
        className="rounded-2xl border p-4"
        style={{
          borderColor: `${THEME.amber}20`,
          background: `${THEME.amber}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-1"
          style={{ color: THEME.amber }}
        >
          💡 小提醒
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          零類條件句也可以用 <span className="font-black text-white">when</span>{" "}
          替換 if，意思幾乎相同，因為結果是必然的。
        </p>
      </div>
    </div>
  );
}

// ─── First Section ────────────────────────────────────────────────────────────

function FirstSection() {
  return (
    <div className="p-8 space-y-5">
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.amber}25`,
          background: `${THEME.amber}06`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.amber }}
        >
          用途
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          用於
          <span className="font-black text-white">未來真實可能發生的情境</span>
          。
          與現實生活緊密連結，常用來針對潛在情況（天氣變化、突發事件等）進行預測或應變規劃。
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[11px] uppercase tracking-widest font-black mb-3 text-gray-600">
          公式
        </p>
        <div className="space-y-2">
          <FormulaRow
            label="If 子句"
            val="現在簡單式（不用未來式）"
            color={THEME.amber}
          />
          <FormulaRow
            label="主要子句"
            val="will / can / may / shall + 原V"
            color={THEME.amber}
          />
        </div>
        <div
          className="mt-3 px-4 py-3 rounded-xl text-xs text-gray-400 leading-relaxed"
          style={{
            background: `${THEME.amber}08`,
            border: `1px solid ${THEME.amber}15`,
          }}
        >
          ⚠️ 雖然兩個子句都在描述未來，if 子句仍用
          <span className="font-black text-white">現在簡單式</span>，而非 will。
        </div>
      </div>

      <div className="space-y-2">
        {[
          {
            en: "If it rains tomorrow, the basketball game will be canceled.",
            zh: "如果明天下雨，籃球賽就會取消。",
            highlight: "will be canceled",
          },
          {
            en: "If you finish your homework, you can go to the movies.",
            zh: "如果你完成作業，你可以去看電影。",
            highlight: "can go",
            note: "can = 能力/許可",
          },
          {
            en: "If it rains tomorrow, the game may be canceled.",
            zh: "如果明天下雨，比賽可能會取消。",
            highlight: "may be canceled",
            note: "may = 不確定的可能性",
          },
          {
            en: "If we arrive early, shall we grab a coffee?",
            zh: "如果我們提早到，要不要去喝杯咖啡？",
            highlight: "shall we",
            note: "shall = 建議/商量",
          },
        ].map((ex, i) => (
          <SentenceCard key={i} {...ex} color={THEME.amber} />
        ))}
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${THEME.sky}25` }}
      >
        <div
          className="px-5 py-4 border-b"
          style={{
            borderColor: `${THEME.sky}15`,
            background: `${THEME.sky}08`,
          }}
        >
          <p className="font-black text-sm" style={{ color: THEME.sky }}>
            進階：If + should 的用法
          </p>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            在 if 子句中加入{" "}
            <span className="font-black text-white">should</span>
            ，可以降低事件的預期發生機率，語感帶有「萬一」或「倘若」的意味。
            這個 should
            與「應該」無關，語氣較嚴謹客氣，常見於正式公文、合約或公告。
          </p>
          <SentenceCard
            en="If an earthquake should occur, please stay calm and follow the exit signs."
            zh="萬一發生地震，請保持冷靜並依照逃生指標行動。"
            highlight="should occur"
            color={THEME.sky}
            note="should = 萬一（正式書面語）"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Second Section ───────────────────────────────────────────────────────────

function SecondSection() {
  return (
    <div className="p-8 space-y-5">
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: `${THEME.sky}25`, background: `${THEME.sky}06` }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.sky }}
        >
          用途
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          用來描述<span className="font-black text-white">與現在事實相反</span>
          的假設情境，或未來可能性極低的情況。
          常帶有「但實際上並非如此」的語感，例如做白日夢、表達遺憾或給建議。
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[11px] uppercase tracking-widest font-black mb-3 text-gray-600">
          公式
        </p>
        <div className="space-y-2">
          <FormulaRow
            label="If 子句"
            val="過去簡單式（were 取代 was）"
            color={THEME.sky}
          />
          <FormulaRow
            label="主要子句"
            val="would / could / might + 原V"
            color={THEME.sky}
          />
        </div>
        <div
          className="mt-3 px-4 py-3 rounded-xl text-xs text-gray-400 leading-relaxed"
          style={{
            background: `${THEME.sky}08`,
            border: `1px solid ${THEME.sky}15`,
          }}
        >
          ⚠️ 第二類條件句中，不論主詞是 I / he / she，
          <span className="font-black text-white">be 動詞一律用 were</span>
          （正式語法）。
        </div>
      </div>

      <div className="space-y-2">
        {[
          {
            en: "If I won the lottery, I would travel around the world.",
            zh: "如果我中大獎，我就環遊世界。（但我現在沒中）",
            highlight: "won",
            note: "過去式 won 表示與現在事實相反",
          },
          {
            en: "If I were you, I would accept that offer.",
            zh: "如果我是你，我會接受那個提案。",
            highlight: "were you",
            note: "be 動詞用 were，不用 was",
          },
          {
            en: "If she had more time, she could learn Spanish.",
            zh: "如果她有更多時間，她就能學西班牙文了。",
            highlight: "had more time",
          },
        ].map((ex, i) => (
          <SentenceCard key={i} {...ex} color={THEME.sky} />
        ))}
      </div>
    </div>
  );
}

// ─── Third Section ────────────────────────────────────────────────────────────

function ThirdSection() {
  return (
    <div className="p-8 space-y-5">
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
          用途
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          表達<span className="font-black text-white">與過去事實相反</span>
          的假設——即那件事已經發生了，無法改變，
          只能假設「如果當初不一樣，現在的結果就不同」。常用來表達後悔、遺憾，內心
          OS 像是「早知道...就...」。
        </p>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[11px] uppercase tracking-widest font-black mb-3 text-gray-600">
          公式
        </p>
        <div className="space-y-2">
          <FormulaRow
            label="If 子句"
            val="had + Vpp（過去完成式）"
            color={THEME.rose}
          />
          <FormulaRow
            label="主要子句"
            val="would / could / might + have + Vpp"
            color={THEME.rose}
          />
        </div>
      </div>

      <div className="space-y-2">
        {[
          {
            en: "If we had left earlier, we wouldn't have missed the train.",
            zh: "如果我們早點出發，就不會錯過火車了。",
            highlight: "had left",
            note: "had + Vpp → 過去完成式",
          },
          {
            en: "If I had studied harder, I would have passed the exam.",
            zh: "如果我更努力讀書，我就考過了。（但沒有）",
            highlight: "would have passed",
          },
          {
            en: "If she had taken the job, she could have moved to London.",
            zh: "如果她當初接了那份工作，她就能搬去倫敦了。",
            highlight: "had taken",
          },
        ].map((ex, i) => (
          <SentenceCard key={i} {...ex} color={THEME.rose} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConditionalsPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<SectionId>("zero");
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
            <span className="text-violet-400">Conditionals</span>
          </div>

          {/* Header */}
          <div
            className="mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Conditional <span className="text-violet-400">Sentences</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              條件句是帶有「如果⋯就⋯」含義的句型。根據情境的時間點與可能性，分為四種類型，每種的動詞形式都不一樣。
            </p>
          </div>

          {/* ── Overview table (always visible) ── */}
          <div style={{ animation: "fadeUp 0.4s ease both 0.12s" }}>
            <OverviewTable onRowClick={setActiveId} />
          </div>

          {/* ── 4-tab picker ── */}
          <div
            className="grid grid-cols-4 gap-3 mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.16s" }}
          >
            {SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-2xl font-black transition-all duration-300 border"
                  style={{
                    background: isActive ? s.color : `${s.color}08`,
                    color: isActive ? "#000" : s.color,
                    borderColor: isActive ? s.color : `${s.color}20`,
                    boxShadow: isActive ? `0 0 25px ${s.color}40` : "none",
                    transform: isActive
                      ? "scale(1.03) translateY(-2px)"
                      : "scale(1)",
                  }}
                >
                  <span>{s.icon}</span>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] uppercase tracking-tight">
                      {s.label}
                    </span>
                    <span
                      className={`text-[8px] font-bold opacity-50 text-center leading-tight`}
                    >
                      {s.labelZh}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Detail card ── */}
          <div
            key={activeId}
            className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden"
            style={{ animation: "fadeUp 0.45s ease both" }}
          >
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.05] flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{ background: `${activeSection.color}15` }}
              >
                <span style={{ color: activeSection.color }}>
                  {activeSection.icon}
                </span>
              </div>
              <div>
                <h3 className="text-white font-black text-2xl">
                  <span style={{ color: activeSection.color }}>
                    {activeSection.label}
                  </span>{" "}
                  <span className="text-gray-600 font-black text-lg">
                    {activeSection.labelZh}
                  </span>
                </h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  {activeSection.tagline}
                </p>
              </div>
            </div>

            {activeId === "zero" && <ZeroSection />}
            {activeId === "first" && <FirstSection />}
            {activeId === "second" && <SecondSection />}
            {activeId === "third" && <ThirdSection />}
          </div>
        </div>
      </main>
    </>
  );
}
