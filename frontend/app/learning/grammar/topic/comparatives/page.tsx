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

type SectionId = "rules" | "comparative" | "superlative" | "negative";

type Section = {
  id: SectionId;
  label: string;
  labelZh: string;
  icon: React.ReactNode;
  tagline: string;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icons = {
  Scale: () => (
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
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  ),
  Trophy: () => (
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  BookOpen: () => (
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Minus: () => (
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
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "rules",
    label: "Formation Rules",
    labelZh: "變化規則",
    icon: <Icons.BookOpen />,
    tagline: "如何變成比較級 / 最高級",
  },
  {
    id: "comparative",
    label: "Comparative",
    labelZh: "比較級用法",
    icon: <Icons.Scale />,
    tagline: "比較兩者 —er / more",
  },
  {
    id: "superlative",
    label: "Superlative",
    labelZh: "最高級用法",
    icon: <Icons.Trophy />,
    tagline: "三者以上最 —est / most",
  },
  {
    id: "negative",
    label: "Negative Forms",
    labelZh: "否定用法",
    icon: <Icons.Minus />,
    tagline: "less / least",
  },
];

// ─── Intro visual: Allen comparison ──────────────────────────────────────────

function AllenViz() {
  return (
    <div
      className="rounded-2xl border p-6 mb-8"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest font-black mb-4"
        style={{ color: THEME.purple }}
      >
        概念圖 — Allen 的身高
      </p>
      <div className="flex items-end justify-center gap-8">
        {[
          { label: "Allen", height: 80, color: THEME.teal, tag: "tall" },
          { label: "Brother", height: 55, color: THEME.sky, tag: "shorter" },
          { label: "Family?", height: 40, color: "#374151", tag: "shortest" },
        ].map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="w-10 rounded-t-xl transition-all"
              style={{
                height: p.height,
                background: `${p.color}30`,
                border: `1px solid ${p.color}40`,
              }}
            />
            <span
              className="text-xs font-mono font-bold"
              style={{ color: p.color }}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {[
          { en: "Allen is tall.", zh: "一般寫法", color: "#6b7280" },
          {
            en: "Allen is taller than his brother.",
            zh: "比較級",
            color: THEME.teal,
          },
          {
            en: "Allen is the tallest in the family.",
            zh: "最高級",
            color: THEME.amber,
          },
        ].map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <span
              className="text-xs font-black w-14 shrink-0"
              style={{ color: row.color }}
            >
              {row.zh}
            </span>
            <span className="text-sm font-mono text-white">{row.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Rules Section ────────────────────────────────────────────────────────────

type WordRow = {
  base: string;
  comp: string;
  sup: string;
  note?: string;
  isWrong?: boolean;
};

type RuleBlock = {
  num: string;
  title: string;
  titleZh: string;
  color: string;
  rows: WordRow[];
  note?: string;
};

const RULE_BLOCKS: RuleBlock[] = [
  {
    num: "①",
    title: "單音節",
    titleZh: "比較級 + er，最高級 + est",
    color: THEME.teal,
    rows: [
      { base: "tall", comp: "taller", sup: "tallest" },
      { base: "cold", comp: "colder", sup: "coldest" },
      {
        base: "nice",
        comp: "nicer",
        sup: "nicest",
        note: "字尾是 e → 只加 r / st",
      },
      {
        base: "fat",
        comp: "fatter",
        sup: "fattest",
        note: "單音節短母音 → 重複字尾再加 er / est",
      },
    ],
  },
  {
    num: "②",
    title: "雙音節（字尾 -y）",
    titleZh: "y 改為 i，再加 er / est",
    color: THEME.sky,
    rows: [
      { base: "happy", comp: "happier", sup: "happiest" },
      { base: "easy", comp: "easier", sup: "easiest" },
      { base: "busy", comp: "busier", sup: "busiest" },
    ],
  },
  {
    num: "③",
    title: "雙音節（字尾非 -y）",
    titleZh: "通常用 more / most，是否能加 er 不一定",
    color: THEME.purple,
    rows: [
      {
        base: "simple",
        comp: "more simple / simpler",
        sup: "most simple / simplest",
        note: "兩種都對 ✅",
      },
      {
        base: "famous",
        comp: "more famous",
        sup: "most famous",
        note: "只能用 more / most",
      },
      {
        base: "famous",
        comp: "famouser ❌",
        sup: "famousest ❌",
        isWrong: true,
      },
    ],
  },
  {
    num: "④",
    title: "三音節以上",
    titleZh: "比較級加 more，最高級加 most",
    color: THEME.amber,
    rows: [
      { base: "beautiful", comp: "more beautiful", sup: "most beautiful" },
      {
        base: "interesting",
        comp: "more interesting",
        sup: "most interesting",
      },
      { base: "expensive", comp: "more expensive", sup: "most expensive" },
    ],
  },
  {
    num: "⑤",
    title: "不規則變化",
    titleZh: "需要直接背起來",
    color: THEME.rose,
    rows: [
      { base: "good", comp: "better", sup: "best", note: "好" },
      { base: "bad", comp: "worse", sup: "worst", note: "壞" },
      { base: "many / much", comp: "more", sup: "most", note: "多" },
      { base: "little", comp: "less", sup: "least", note: "少" },
    ],
  },
];

function RulesSection() {
  return (
    <div className="p-8 space-y-6">
      {RULE_BLOCKS.map((block) => (
        <div
          key={block.num}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: `${block.color}20`,
            background: "rgba(255,255,255,0.01)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{
              borderColor: `${block.color}15`,
              background: `${block.color}08`,
            }}
          >
            <span className="text-lg font-black" style={{ color: block.color }}>
              {block.num}
            </span>
            <div>
              <span className="text-white font-black text-sm">
                {block.title}
              </span>
              <span className="text-gray-500 text-xs ml-2">
                {block.titleZh}
              </span>
            </div>
          </div>
          {/* Table */}
          <div>
            <div
              className="grid text-[10px] font-black uppercase tracking-widest border-b"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr 1.5fr",
                borderColor: "rgba(255,255,255,0.04)",
              }}
            >
              {["原形", "比較級", "最高級", "備註"].map((h) => (
                <div key={h} className="px-4 py-2.5 text-gray-600">
                  {h}
                </div>
              ))}
            </div>
            {block.rows.map((row, ri) => (
              <div
                key={ri}
                className="grid border-b last:border-0 items-center"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr 1.5fr",
                  borderColor: "rgba(255,255,255,0.03)",
                  background: row.isWrong
                    ? `${THEME.rose}06`
                    : ri % 2 === 0
                    ? "transparent"
                    : "rgba(255,255,255,0.01)",
                }}
              >
                <div
                  className="px-4 py-3 font-mono text-sm font-bold"
                  style={{ color: row.isWrong ? THEME.rose : "#9ca3af" }}
                >
                  {row.base}
                </div>
                <div
                  className="px-4 py-3 font-mono text-sm font-bold"
                  style={{ color: row.isWrong ? THEME.rose : block.color }}
                >
                  {row.comp}
                </div>
                <div
                  className="px-4 py-3 font-mono text-sm font-bold"
                  style={{ color: row.isWrong ? THEME.rose : block.color }}
                >
                  {row.sup}
                </div>
                <div
                  className="px-4 py-3 text-xs"
                  style={{ color: row.isWrong ? THEME.rose : "#4b5563" }}
                >
                  {row.note ?? ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Comparative Section ──────────────────────────────────────────────────────

function ExBlock({
  title,
  titleZh,
  color,
  items,
  note,
}: {
  title: string;
  titleZh: string;
  color: string;
  items: { en: string; zh: string; highlight?: string; isWrong?: boolean }[];
  note?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-black text-sm" style={{ color }}>
          {title}
        </span>
        <span className="text-xs text-gray-500">{titleZh}</span>
      </div>
      {note && (
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{note}</p>
      )}
      <div className="space-y-2">
        {items.map((item, i) => {
          const cardColor = item.isWrong ? THEME.rose : color;
          const parts = item.highlight
            ? item.en.split(item.highlight)
            : [item.en];
          return (
            <div
              key={i}
              className="px-4 py-3 rounded-xl"
              style={{
                background: item.isWrong
                  ? `${THEME.rose}08`
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  item.isWrong ? `${THEME.rose}25` : "rgba(255,255,255,0.04)"
                }`,
              }}
            >
              <p className="font-mono text-sm text-white mb-0.5">
                {parts.map((part, pi) => (
                  <span key={pi}>
                    {part}
                    {pi < parts.length - 1 && (
                      <span className="font-black" style={{ color: cardColor }}>
                        {item.highlight}
                      </span>
                    )}
                  </span>
                ))}
              </p>
              <p
                className="text-xs italic"
                style={{ color: item.isWrong ? THEME.rose : "#6b7280" }}
              >
                {item.zh}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComparativeSection() {
  return (
    <div className="p-8 space-y-5">
      <ExBlock
        title="基本用法 — than"
        titleZh="比較兩者，後面加 than"
        color={THEME.teal}
        items={[
          {
            en: "The orange is bigger than the kiwi.",
            zh: "橘子比奇異果大。",
            highlight: "bigger than",
          },
          {
            en: "The apple is more delicious than the kiwi.",
            zh: "蘋果比奇異果好吃。",
            highlight: "more delicious than",
          },
        ]}
      />

      <ExBlock
        title="強調用法 — much / way"
        titleZh="口語中表示「更加」"
        color={THEME.sky}
        note="在比較級前加 much 或 way，表示差距很大，語氣更強。"
        items={[
          {
            en: "The orange is much bigger than the kiwi.",
            zh: "橘子比奇異果大多了。",
            highlight: "much bigger",
          },
          {
            en: "This is way more expensive than I thought.",
            zh: "這比我想的貴多了。",
            highlight: "way more expensive",
          },
        ]}
      />

      <ExBlock
        title="代名詞用受格"
        titleZh="than 後面的代名詞用受格（me / him / her…）"
        color={THEME.purple}
        items={[
          {
            en: "My sister is cuter than me.",
            zh: "我妹妹比我可愛。",
            highlight: "than me",
          },
          {
            en: "He runs faster than her.",
            zh: "他跑得比她快。",
            highlight: "than her",
          },
        ]}
      />

      <ExBlock
        title="⚠️ 對稱原則"
        titleZh="比較的兩個對象必須是同類型的東西"
        color={THEME.rose}
        items={[
          {
            en: "❌ The tea in this shop is better than that shop.",
            zh: "that shop 是店，不是茶，無法比較",
            isWrong: true,
          },
          {
            en: "✅ The tea in this shop is better than the tea in that shop.",
            zh: "兩邊都是茶，對稱正確 ✅",
            highlight: "the tea in that shop",
          },
        ]}
      />

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-black text-sm" style={{ color: THEME.amber }}>
            其他句型
          </span>
          <span className="text-xs text-gray-500">進階比較級表達</span>
        </div>
        <div className="space-y-4">
          {[
            {
              pattern: "…er and …er",
              patternZh: "越來越⋯",
              examples: [
                {
                  en: "Your code is getting better and better.",
                  zh: "你的程式碼越來越好了。",
                },
                {
                  en: "The lady grew more and more patient.",
                  zh: "那位女士變得越來越有耐心。",
                },
              ],
            },
            {
              pattern: "the more, the better",
              patternZh: "越⋯越好",
              examples: [
                {
                  en: "Show me your info — the more the better.",
                  zh: "給我看你的資料——越多越好。",
                },
              ],
            },
            {
              pattern: "The …er, the …er",
              patternZh: "越⋯就越⋯",
              examples: [
                {
                  en: "The more water you drink, the healthier you become.",
                  zh: "你喝越多水，就越健康。",
                },
              ],
            },
          ].map((block, bi) => (
            <div key={bi}>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  className="font-mono text-sm font-black px-2 py-0.5 rounded-lg"
                  style={{ background: `${THEME.amber}15`, color: THEME.amber }}
                >
                  {block.pattern}
                </span>
                <span className="text-xs text-gray-500">{block.patternZh}</span>
              </div>
              {block.examples.map((ex, ei) => (
                <div
                  key={ei}
                  className="px-4 py-2.5 rounded-xl mb-1"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <p className="font-mono text-sm text-white">{ex.en}</p>
                  <p className="text-xs text-gray-500 italic mt-0.5">{ex.zh}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Superlative Section ──────────────────────────────────────────────────────

function SuperlativeSection() {
  const vocab = [
    {
      word: "greatest",
      zh: "最偉大的",
      note: "語氣宏大，讚美成就或人格",
      color: THEME.teal,
    },
    {
      word: "most outstanding",
      zh: "最傑出的",
      note: "強調脫穎而出的優秀感",
      color: THEME.sky,
    },
    {
      word: "most charismatic",
      zh: "最有魅力的",
      note: "強調領袖魅力、個人特質",
      color: THEME.purple,
    },
    {
      word: "most remarkable",
      zh: "最非凡的",
      note: "文學感強，正式場合適用",
      color: THEME.amber,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="font-black text-sm mb-1" style={{ color: THEME.amber }}>
          基本結構
        </p>
        <p className="text-xs text-gray-500 mb-4">
          最高級用於三者以上的比較，通常前面加 the
        </p>
        {[
          { en: "You are the greatest.", zh: "你是最偉大的。" },
          {
            en: "You are the most outstanding student in the school.",
            zh: "你是這間學校裡最傑出的學生。",
          },
          {
            en: "You are the most charismatic student of all the classmates.",
            zh: "你是所有同學裡最有魅力的學生。",
          },
          {
            en: "You are the most remarkable student that I have ever encountered.",
            zh: "你是我所遇過最卓越的學生。",
          },
        ].map((ex, i) => (
          <div
            key={i}
            className="px-4 py-3 rounded-xl mb-2"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="font-mono text-sm text-white">{ex.en}</p>
            <p className="text-xs text-gray-500 italic mt-0.5">{ex.zh}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: `${THEME.teal}20`,
          background: `${THEME.teal}05`,
        }}
      >
        <p className="font-black text-sm mb-1" style={{ color: THEME.teal }}>
          進階詞彙替換
        </p>
        <p className="text-xs text-gray-500 mb-4">
          用更精準的詞替換 best，讓語氣更有層次
        </p>
        <div className="grid grid-cols-2 gap-3">
          {vocab.map((v, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border"
              style={{
                background: `${v.color}08`,
                borderColor: `${v.color}20`,
              }}
            >
              <p
                className="font-mono font-black text-sm mb-1"
                style={{ color: v.color }}
              >
                {v.word}
              </p>
              <p className="text-xs text-gray-400">{v.zh}</p>
              <p className="text-xs text-gray-600 mt-1">{v.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Negative Section ─────────────────────────────────────────────────────────

function NegativeSection() {
  return (
    <div className="p-8 space-y-6">
      {/* more vs less */}
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
          <p className="font-black text-sm" style={{ color: THEME.teal }}>
            more 比較 ↔ less 比較不
          </p>
        </div>
        <div
          className="grid grid-cols-2 divide-x"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="p-5"
            style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span
              className="text-xs font-black px-2 py-1 rounded-lg mb-3 inline-block"
              style={{ background: `${THEME.teal}15`, color: THEME.teal }}
            >
              more → 比較
            </span>
            <p className="font-mono text-sm text-white mb-1">
              The orange is{" "}
              <span style={{ color: THEME.teal }} className="font-black">
                more delicious
              </span>{" "}
              than the kiwi.
            </p>
            <p className="text-xs text-gray-500 italic">橘子比奇異果好吃</p>
          </div>
          <div className="p-5">
            <span
              className="text-xs font-black px-2 py-1 rounded-lg mb-3 inline-block"
              style={{ background: `${THEME.rose}15`, color: THEME.rose }}
            >
              less → 比較不
            </span>
            <p className="font-mono text-sm text-white mb-1">
              The orange is{" "}
              <span style={{ color: THEME.rose }} className="font-black">
                less delicious
              </span>{" "}
              than the kiwi.
            </p>
            <p className="text-xs text-gray-500 italic">橘子沒有奇異果好吃</p>
          </div>
        </div>
      </div>

      {/* most vs least */}
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
          <p className="font-black text-sm" style={{ color: THEME.amber }}>
            most 最 ↔ least 最不
          </p>
        </div>
        <div
          className="grid grid-cols-2 divide-x"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="p-5"
            style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span
              className="text-xs font-black px-2 py-1 rounded-lg mb-3 inline-block"
              style={{ background: `${THEME.amber}15`, color: THEME.amber }}
            >
              most → 最
            </span>
            <p className="font-mono text-sm text-white mb-1">
              The apple is the{" "}
              <span style={{ color: THEME.amber }} className="font-black">
                most delicious
              </span>{" "}
              of all.
            </p>
            <p className="text-xs text-gray-500 italic">這顆蘋果是最好吃的</p>
          </div>
          <div className="p-5">
            <span
              className="text-xs font-black px-2 py-1 rounded-lg mb-3 inline-block"
              style={{ background: `${THEME.rose}15`, color: THEME.rose }}
            >
              least → 最不
            </span>
            <p className="font-mono text-sm text-white mb-1">
              The apple is the{" "}
              <span style={{ color: THEME.rose }} className="font-black">
                least delicious
              </span>{" "}
              of all.
            </p>
            <p className="text-xs text-gray-500 italic">這顆蘋果是最不好吃的</p>
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <p className="font-black text-sm mb-4 text-white">快速對照表</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          {[
            { label: "正面比較級", word: "more", color: THEME.teal },
            { label: "正面最高級", word: "most", color: THEME.amber },
            { label: "", word: "", color: "transparent" },
            { label: "負面比較級", word: "less", color: THEME.rose },
            { label: "負面最高級", word: "least", color: THEME.rose },
            { label: "", word: "", color: "transparent" },
          ].map((item, i) =>
            item.word ? (
              <div
                key={i}
                className="p-3 rounded-xl"
                style={{
                  background: `${item.color}10`,
                  border: `1px solid ${item.color}20`,
                }}
              >
                <p
                  className="font-black font-mono"
                  style={{ color: item.color }}
                >
                  {item.word}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">{item.label}</p>
              </div>
            ) : (
              <div key={i} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComparativesPage() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<SectionId>("rules");
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
              background: `radial-gradient(circle, ${THEME.amber}05 0%, transparent 70%)`,
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
            <span className="text-violet-400">Comparatives</span>
          </div>

          {/* Header */}
          <div
            className="mb-10"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Comparatives <span className="text-violet-400">&</span>
              <br />
              Superlatives
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              比較級用於比較兩者，最高級用於三者以上。掌握變化規則與句型，讓你的表達更有層次。
            </p>
          </div>

          {/* Intro viz */}
          <div style={{ animation: "fadeUp 0.4s ease both 0.1s" }}>
            <AllenViz />
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
                      className={`text-[9px] font-bold opacity-50 ${
                        isActive ? "text-black" : ""
                      }`}
                    >
                      {s.labelZh}
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

            {activeId === "rules" && <RulesSection />}
            {activeId === "comparative" && <ComparativeSection />}
            {activeId === "superlative" && <SuperlativeSection />}
            {activeId === "negative" && <NegativeSection />}
          </div>
        </div>
      </main>
    </>
  );
}
