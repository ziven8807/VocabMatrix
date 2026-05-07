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

type SectionId = "intro" | "active" | "passive" | "tips";

type Section = {
  id: SectionId;
  label: string;
  labelZh: string;
  icon: React.ReactNode;
  tagline: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  Bolt: () => (
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
  Play: () => (
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
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  Rotate: () => (
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
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  ),
  AlertTriangle: () => (
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

// ─── Sections ─────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "intro",
    label: "Overview",
    labelZh: "使役動詞概覽",
    icon: <Icons.Bolt />,
    tagline: "make · have · let · get",
  },
  {
    id: "active",
    label: "Active Voice",
    labelZh: "主動用法",
    icon: <Icons.Play />,
    tagline: "S + CV + O + 原V",
  },
  {
    id: "passive",
    label: "Passive Voice",
    labelZh: "被動用法",
    icon: <Icons.Rotate />,
    tagline: "CV + O + p.p",
  },
  {
    id: "tips",
    label: "Watch Out",
    labelZh: "常見混淆",
    icon: <Icons.AlertTriangle />,
    tagline: "易混淆動詞 & 多義字",
  },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOUR_VERBS = [
  {
    verb: "make",
    zh: "強迫、使得",
    color: THEME.teal,
    nuance: "帶有強制感，對方通常沒有選擇",
    active: "原V",
    passive: "p.p",
  },
  {
    verb: "have",
    zh: "安排、指派",
    color: THEME.sky,
    nuance: "中性指派，通常是職責或服務關係",
    active: "原V",
    passive: "p.p",
  },
  {
    verb: "let",
    zh: "允許、讓",
    color: THEME.purple,
    nuance: "給予許可，對方有意願但需要允許",
    active: "原V",
    passive: "be p.p（書面，口語少用）",
  },
  {
    verb: "get",
    zh: "說服、設法讓",
    color: THEME.amber,
    nuance: "花了點力氣說服或安排，比 have 主動",
    active: "to + 原V ⚠️",
    passive: "p.p",
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

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
  const cardColor = isWrong ? THEME.rose : color;
  const parts = highlight ? en.split(highlight) : null;
  return (
    <div
      className="p-4 rounded-2xl border transition-all"
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
                  <span className="font-black" style={{ color: cardColor }}>
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
          style={{ background: `${cardColor}10`, color: `${cardColor}90` }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Overview Section ─────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Definition */}
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
          定義 Definition
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          使役動詞（Causative
          Verbs）用來表達「使／讓某人去做某事」或「使某件事發生」。
          英文中主要有四個：
          <span className="font-black text-white">make、have、let、get</span>。
          它們的共同點是後面都帶有一個「受詞 +
          動詞」的結構，但各自的語氣與後接動詞形式略有不同。
        </p>
      </div>

      {/* Four verbs cards */}
      <div className="grid grid-cols-2 gap-3">
        {FOUR_VERBS.map((v) => (
          <div
            key={v.verb}
            className="rounded-2xl border p-5"
            style={{ borderColor: `${v.color}25`, background: `${v.color}06` }}
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-black text-2xl font-mono"
                style={{ color: v.color }}
              >
                {v.verb}
              </span>
              <span className="text-xs text-gray-500">{v.zh}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              {v.nuance}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span
                className="text-[11px] px-2 py-1 rounded-lg font-black"
                style={{ background: `${v.color}15`, color: v.color }}
              >
                主動：{v.active}
              </span>
              <span
                className="text-[11px] px-2 py-1 rounded-lg font-black"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#6b7280",
                }}
              >
                被動：{v.passive}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Structure overview */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="text-[11px] uppercase tracking-widest font-black mb-4 text-gray-600">
          句型結構一覽
        </p>
        <div className="space-y-3">
          {[
            {
              label: "make / have / let（主動）",
              formula: "S  +  CV  +  O  +  原V",
              color: THEME.teal,
            },
            {
              label: "get（主動）",
              formula: "S  +  get  +  O  +  to + 原V",
              color: THEME.amber,
            },
            {
              label: "make / have / get（被動）",
              formula: "S  +  CV  +  O  +  p.p",
              color: THEME.sky,
            },
            {
              label: "let（被動）",
              formula: "S  +  let  +  O  +  be p.p",
              color: THEME.purple,
            },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span
                className="text-xs w-44 shrink-0 font-black"
                style={{ color: row.color }}
              >
                {row.label}
              </span>
              <span className="font-mono text-sm text-white tracking-wide">
                {row.formula}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Active Section ───────────────────────────────────────────────────────────

function ActiveSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Rule banner */}
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
          主動用法核心規則
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          使役動詞的主動句中，受詞後面要接
          <span className="font-black text-white">動詞原形（原V）</span>—— 不加
          to，不加 ing，直接用原形。 唯一例外是{" "}
          <span className="font-black" style={{ color: THEME.amber }}>
            get
          </span>
          ，它後面要接{" "}
          <span className="font-black" style={{ color: THEME.amber }}>
            to + 原V
          </span>
          。
        </p>
      </div>

      {/* make / have / let */}
      {[
        {
          verb: "make",
          color: THEME.teal,
          desc: "帶有強制語氣，受詞通常沒有選擇餘地。",
          examples: [
            {
              en: "Annie made her boyfriend cut his hair.",
              zh: "安妮逼她男朋友去剪頭髮。",
              highlight: "made her boyfriend cut",
            },
            {
              en: "The noise made me wake up early.",
              zh: "噪音害我提早醒來。",
              highlight: "made me wake",
            },
          ],
        },
        {
          verb: "have",
          color: THEME.sky,
          desc: "中性語氣，通常是安排他人做某事，有點像指派職責或請求服務。",
          examples: [
            {
              en: "The teacher had the school call the student's parents.",
              zh: "老師請校方打電話給家長。",
              highlight: "had the school call",
            },
            {
              en: "I'll have my assistant send you the file.",
              zh: "我會請助理把檔案傳給你。",
              highlight: "have my assistant send",
            },
          ],
        },
        {
          verb: "let",
          color: THEME.purple,
          desc: "給予許可，對方本來有意願，只是需要你允許。",
          examples: [
            {
              en: "Jack let his friend borrow his car.",
              zh: "傑克讓他朋友借他的車。",
              highlight: "let his friend borrow",
            },
            {
              en: "Let me explain what happened.",
              zh: "讓我解釋一下發生了什麼事。",
              highlight: "Let me explain",
            },
          ],
        },
      ].map((block) => (
        <div
          key={block.verb}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: `${block.color}20` }}
        >
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{
              borderColor: `${block.color}15`,
              background: `${block.color}08`,
            }}
          >
            <span
              className="font-black text-xl font-mono"
              style={{ color: block.color }}
            >
              {block.verb}
            </span>
            <span className="font-mono text-sm text-gray-400">+ O + 原V</span>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              {block.desc}
            </p>
            <div className="space-y-2">
              {block.examples.map((ex, i) => (
                <SentenceCard key={i} {...ex} color={block.color} />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* get — special */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${THEME.amber}30` }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3 border-b"
          style={{
            borderColor: `${THEME.amber}20`,
            background: `${THEME.amber}08`,
          }}
        >
          <span
            className="font-black text-xl font-mono"
            style={{ color: THEME.amber }}
          >
            get
          </span>
          <span className="font-mono text-sm text-gray-400">+ O + </span>
          <span
            className="font-mono text-sm font-black"
            style={{ color: THEME.amber }}
          >
            to + 原V
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-black ml-1"
            style={{ background: `${THEME.amber}20`, color: THEME.amber }}
          >
            ⚠️ 特別注意
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            get 雖然是使役動詞，但後面必須接{" "}
            <span className="font-black" style={{ color: THEME.amber }}>
              to + 原V
            </span>
            （不定詞），不是動詞原形。
            語意上帶有「費了點功夫說服或安排」的感覺。
          </p>
          <div className="space-y-2">
            <SentenceCard
              en="Nancy got her sister to sew her a dress."
              zh="南茜說服她姊姊為她縫了一件洋裝。"
              highlight="got her sister to sew"
              color={THEME.amber}
            />
            <SentenceCard
              en="I finally got him to agree."
              zh="我終於說服他同意了。"
              highlight="got him to agree"
              color={THEME.amber}
            />
          </div>
        </div>
      </div>

      {/* Quick review */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.purple}20`,
          background: `${THEME.purple}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-3"
          style={{ color: THEME.purple }}
        >
          快速複習
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.teal}10`,
              border: `1px solid ${THEME.teal}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.teal }}
            >
              make / have / let
            </p>
            <p className="font-mono text-sm text-white">
              + O + <span style={{ color: THEME.teal }}>原V</span>
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.amber}10`,
              border: `1px solid ${THEME.amber}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.amber }}
            >
              get（例外）
            </p>
            <p className="font-mono text-sm text-white">
              + O + <span style={{ color: THEME.amber }}>to + 原V</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Passive Section ──────────────────────────────────────────────────────────

function PassiveSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Rule banner */}
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: `${THEME.sky}25`, background: `${THEME.sky}06` }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-2"
          style={{ color: THEME.sky }}
        >
          被動用法核心規則
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          當我們想表達某人或某物「被要求去做某事」時，使役動詞後的動詞要改為
          <span className="font-black text-white">過去分詞（p.p）</span>。
          字面上可以理解為「使受詞處於被完成的狀態」。 唯一例外是{" "}
          <span className="font-black" style={{ color: THEME.purple }}>
            let
          </span>
          ，被動時要寫成{" "}
          <span className="font-black" style={{ color: THEME.purple }}>
            be p.p
          </span>
          ， 但這種用法在日常口語中很少見，正式書面語境才比較常出現。
        </p>
      </div>

      {/* make / have / get */}
      {[
        {
          verb: "have",
          color: THEME.sky,
          note: "最常見的被動使役用法，表示安排他人做某事（受詞是物品時尤其常用）",
          examples: [
            {
              en: "I had my hair cut.",
              zh: "我去剪了頭髮。（安排他人剪）",
              highlight: "had my hair cut",
              note: "字面：使我的頭髮被剪",
            },
            {
              en: "I had my homework done.",
              zh: "我把作業完成了。",
              highlight: "had my homework done",
            },
          ],
        },
        {
          verb: "get",
          color: THEME.teal,
          note: "與 have 類似，但語氣上更強調主動去安排這件事的過程",
          examples: [
            {
              en: "I got my car fixed.",
              zh: "我叫人把我的車修好了。",
              highlight: "got my car fixed",
              note: "字面：使我的車被修理",
            },
            {
              en: "She got her phone repaired.",
              zh: "她把手機拿去修了。",
              highlight: "got her phone repaired",
            },
          ],
        },
        {
          verb: "make",
          color: THEME.rose,
          note: "被動語意較強烈，帶有「強迫使其處於某狀態」的感覺",
          examples: [
            {
              en: "The manager made the report revised.",
              zh: "經理要求報告被修改。",
              highlight: "made the report revised",
            },
          ],
        },
      ].map((block) => (
        <div
          key={block.verb}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: `${block.color}20` }}
        >
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{
              borderColor: `${block.color}15`,
              background: `${block.color}08`,
            }}
          >
            <span
              className="font-black text-xl font-mono"
              style={{ color: block.color }}
            >
              {block.verb}
            </span>
            <span className="font-mono text-sm text-gray-400">+ O +</span>
            <span
              className="font-mono text-sm font-black"
              style={{ color: block.color }}
            >
              p.p
            </span>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              {block.note}
            </p>
            <div className="space-y-2">
              {block.examples.map((ex, i) => (
                <SentenceCard key={i} {...ex} color={block.color} />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* let — special */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${THEME.purple}30` }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3 border-b"
          style={{
            borderColor: `${THEME.purple}20`,
            background: `${THEME.purple}08`,
          }}
        >
          <span
            className="font-black text-xl font-mono"
            style={{ color: THEME.purple }}
          >
            let
          </span>
          <span className="font-mono text-sm text-gray-400">+ O +</span>
          <span
            className="font-mono text-sm font-black"
            style={{ color: THEME.purple }}
          >
            be p.p
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-black ml-1"
            style={{ background: `${THEME.purple}20`, color: THEME.purple }}
          >
            書面語，口語少用
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            let 的被動形式需要加上 be，但這個結構在日常口語中幾乎不使用。
            如果要表達「被允許做某事」，更自然的說法是{" "}
            <span className="font-black text-gray-300">be allowed to</span>。
          </p>
          <SentenceCard
            en="How could you let your plan be revised like that?"
            zh="你怎麼能讓你的計畫就這樣被改掉？"
            highlight="let your plan be revised"
            color={THEME.purple}
          />
          <div
            className="mt-3 p-3 rounded-xl"
            style={{
              background: `${THEME.teal}08`,
              border: `1px solid ${THEME.teal}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.teal }}
            >
              💡 更自然的替代說法
            </p>
            <p className="font-mono text-sm text-white">
              She was allowed to leave early.
            </p>
            <p className="text-xs text-gray-500 mt-0.5 italic">
              她被允許提早離開。
            </p>
          </div>
        </div>
      </div>

      {/* Quick review */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.purple}20`,
          background: `${THEME.purple}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-3"
          style={{ color: THEME.purple }}
        >
          快速複習
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.sky}10`,
              border: `1px solid ${THEME.sky}20`,
            }}
          >
            <p className="text-xs font-black mb-1" style={{ color: THEME.sky }}>
              make / have / get
            </p>
            <p className="font-mono text-sm text-white">
              + O + <span style={{ color: THEME.sky }}>p.p</span>
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${THEME.purple}10`,
              border: `1px solid ${THEME.purple}20`,
            }}
          >
            <p
              className="text-xs font-black mb-1"
              style={{ color: THEME.purple }}
            >
              let（書面）
            </p>
            <p className="font-mono text-sm text-white">
              + O + <span style={{ color: THEME.purple }}>be p.p</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tips Section ─────────────────────────────────────────────────────────────

function TipsSection() {
  return (
    <div className="p-8 space-y-6">
      {/* Confusing verbs */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${THEME.rose}25` }}
      >
        <div
          className="px-5 py-4 border-b"
          style={{
            borderColor: `${THEME.rose}15`,
            background: `${THEME.rose}08`,
          }}
        >
          <p className="font-black text-sm" style={{ color: THEME.rose }}>
            ⚠️ 易混淆：看起來像使役動詞的普通動詞
          </p>
        </div>
        <div className="p-5">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            want、ask、tell
            等動詞語意上也有「叫某人做某事」的感覺，但它們是普通動詞，
            後面接動詞時用的是一般的{" "}
            <span className="font-black text-white">to + 原V</span>
            ，不是原形動詞。 只要記住四大使役動詞（make / have / let /
            get），其他的都照一般用法處理就對了。
          </p>
          <div className="space-y-2">
            {[
              {
                en: "Father wants me to wash the car tomorrow.",
                zh: "爸爸要我明天去洗車。",
                highlight: "wants me to wash",
                color: THEME.sky,
              },
              {
                en: "Mr. Wang asked them to finish their homework.",
                zh: "王老師叫他們完成作業。",
                highlight: "asked them to finish",
                color: THEME.sky,
              },
              {
                en: "She told him to stop talking.",
                zh: "她叫他停止說話。",
                highlight: "told him to stop",
                color: THEME.sky,
              },
            ].map((ex, i) => (
              <SentenceCard key={i} {...ex} color={THEME.sky} />
            ))}
          </div>
          <div
            className="mt-4 p-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-black mb-2 text-gray-400">
              普通動詞 vs 使役動詞 — 後接形式比較
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-black mb-1" style={{ color: THEME.rose }}>
                  普通動詞（want / ask / tell）
                </p>
                <p className="font-mono text-gray-300">
                  + O + <span style={{ color: THEME.sky }}>to + 原V</span>
                </p>
              </div>
              <div>
                <p className="font-black mb-1" style={{ color: THEME.teal }}>
                  使役動詞（make / have / let）
                </p>
                <p className="font-mono text-gray-300">
                  + O + <span style={{ color: THEME.teal }}>原V</span>（不加
                  to）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* make & have have other meanings */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.amber}25`,
          background: `${THEME.amber}05`,
        }}
      >
        <p
          className="text-[11px] uppercase tracking-widest font-black mb-3"
          style={{ color: THEME.amber }}
        >
          ⚠️ make 和 have 的多重意思
        </p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          make 和 have 除了使役用法之外，在其他語境中有完全不同的意思。
          看到這兩個字，不能直覺認定就是使役句，要根據上下文判斷。
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              verb: "make",
              color: THEME.teal,
              meanings: [
                {
                  meaning: "使役動詞",
                  ex: "She made him cry.",
                  note: "+ O + 原V",
                },
                {
                  meaning: "製造、製作",
                  ex: "She made a cake.",
                  note: "普通動詞",
                },
              ],
            },
            {
              verb: "have",
              color: THEME.sky,
              meanings: [
                {
                  meaning: "使役動詞",
                  ex: "I had him fix it.",
                  note: "+ O + 原V",
                },
                {
                  meaning: "有、吃、喝",
                  ex: "I have a dog. / Have lunch.",
                  note: "普通動詞",
                },
              ],
            },
          ].map((item) => (
            <div key={item.verb} className="space-y-2">
              <p className="text-xs font-black" style={{ color: item.color }}>
                {item.verb} 的不同用法
              </p>
              {item.meanings.map((m, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p
                    className="text-[10px] font-black mb-1"
                    style={{ color: item.color }}
                  >
                    {m.meaning}
                  </p>
                  <p className="font-mono text-xs text-white">{m.ex}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{m.note}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CausativesPage() {
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
            <span className="text-violet-400">Causatives</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Causative <span className="text-violet-400">Verbs</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              使役動詞用來表達「讓／使某人做某事」。 四個核心動詞{" "}
              <span className="font-bold text-white">
                make · have · let · get
              </span>{" "}
              各有不同語氣，後接的動詞形式也略有差異。
            </p>
          </div>

          {/* Picker */}
          <div
            className="grid grid-cols-4 gap-3 mb-10"
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
                      className={`text-[9px] font-bold opacity-50 text-center ${
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
            {activeId === "active" && <ActiveSection />}
            {activeId === "passive" && <PassiveSection />}
            {activeId === "tips" && <TipsSection />}
          </div>
        </div>
      </main>
    </>
  );
}
