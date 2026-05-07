// frontend/app/learning/grammar/topic/countability/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type Example = {
  sentence: string;
  highlight: string;
  note: string;
};

type CountCategory = {
  id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  rule: string;
  words: string[];
  examples: Example[];
};

type MeasureWord = {
  phrase: string;
  usedWith: string;
  example: string;
};

type UncountableCategory = "abstract" | "tiny" | "shapeless" | "collective";

type UncountableWord = {
  word: string;
  translation: string;
  category: UncountableCategory;
};

// ─── Data (Logic: Countable Purple / Uncountable Categories Purple until Active) ───

const THEME = {
  purple: "#a78bfa",
  gold: "#fbbf24",
};

const OVERVIEW = {
  countable: {
    color: THEME.purple, // 改為紫色
    title: "可數名詞",
    rule: "可以一個一個數。有單數和複數形式。",
    signals: ["a / an", "one, two, three…", "many, few", "these, those"],
    examples: [
      "a dog → two dogs",
      "an apple → three apples",
      "one chair → five chairs",
    ],
  },
  uncountable: {
    color: THEME.purple,
    title: "不可數名詞",
    rule: "無法單獨計算。沒有複數形式。動詞恆用單數。",
    signals: [
      "some / any",
      "much / little",
      "a lot of",
      "量詞 (measure words)",
    ],
    examples: [
      "water (不說 'a water')",
      "information (不加 's')",
      "furniture (不加 's')",
    ],
  },
};

const UNCOUNTABLE_CATEGORIES: CountCategory[] = [
  {
    id: "abstract",
    label: "抽象概念",
    color: THEME.purple,
    icon: "✦",
    description: "沒有實體的形式、觀念或感覺——你摸不到也看不見的東西。",
    rule: "如果你拿不住它，它通常就是不可數的。",
    words: [
      "love",
      "music",
      "health",
      "confidence",
      "luck",
      "freedom",
      "advice",
      "knowledge",
    ],
    examples: [
      {
        sentence: "Good advice is hard to find.",
        highlight: "advice",
        note: "不能用 'an advice' 或 'advices'",
      },
      {
        sentence: "She has a lot of confidence.",
        highlight: "confidence",
        note: "抽象特質 — 無複數",
      },
    ],
  },
  {
    id: "tiny",
    label: "微小/顆粒狀",
    color: THEME.purple, // 初始改為紫色
    icon: "◦",
    description: "由無數相同的小顆粒組成——它們通常以整體出現，而非個別計數。",
    rule: "如果個體單元小到難以實際計算，則視為不可數。",
    words: ["rice", "sugar", "salt", "sand", "hair", "flour", "dust", "snow"],
    examples: [
      {
        sentence: "There is sand all over the floor.",
        highlight: "sand",
        note: "沙粒太多，無法一一計算",
      },
      {
        sentence: "Add two cups of flour to the bowl.",
        highlight: "flour",
        note: "使用單位量詞來定量",
      },
    ],
  },
  {
    id: "shapeless",
    label: "液體與氣體",
    color: THEME.purple,
    icon: "~",
    description: "沒有固定形狀的東西——液體、氣體以及會隨容器改變形狀的材料。",
    rule: "無固定形狀 = 無固定單位 = 不可數。",
    words: [
      "water",
      "air",
      "smoke",
      "gas",
      "oil",
      "milk",
      "concrete",
      "rubber",
    ],
    examples: [
      {
        sentence: "Fresh air is good for you.",
        highlight: "air",
        note: "氣體 — 沒有固定形式",
      },
      {
        sentence: "Could I have some water?",
        highlight: "water",
        note: "液體 — 用 'some' 而非 'a water'",
      },
    ],
  },
  {
    id: "collective",
    label: "集合名詞",
    color: THEME.purple, // 初始改為紫色
    icon: "⊞",
    description:
      "涵蓋一整群相似事物的總稱。群體中的每個項目有自己的名字，但總稱本身不可數。",
    rule: "如果該詞是一個包含多種細項的通用類別名稱，通常不可數。",
    words: [
      "food",
      "fruit",
      "meat",
      "furniture",
      "luggage",
      "bread",
      "news",
      "information",
      "research",
      "homework",
      "money",
      "work",
    ],
    examples: [
      {
        sentence: "The furniture in this room is beautiful.",
        highlight: "furniture",
        note: "涵蓋桌椅沙發，但詞彙本身無複數",
      },
      {
        sentence: "I received some interesting news today.",
        highlight: "news",
        note: "看起來像複數，但 'news' 恆用單數",
      },
    ],
  },
];

const MEASURE_WORDS: MeasureWord[] = [
  {
    phrase: "a cup of",
    usedWith: "coffee, tea, water, flour",
    example: "a cup of coffee",
  },
  {
    phrase: "a glass of",
    usedWith: "water, juice, milk, wine",
    example: "a glass of juice",
  },
  {
    phrase: "a bowl of",
    usedWith: "rice, soup, cereal",
    example: "a bowl of rice",
  },
  {
    phrase: "a piece of",
    usedWith: "advice, bread, furniture, news",
    example: "a piece of advice",
  },
  {
    phrase: "a bag of",
    usedWith: "rice, sugar, flour, sand",
    example: "a bag of sugar",
  },
  { phrase: "a loaf of", usedWith: "bread", example: "two loaves of bread" },
  {
    phrase: "a slice of",
    usedWith: "bread, meat, cake",
    example: "a slice of cake",
  },
  { phrase: "a sheet of", usedWith: "paper", example: "a sheet of paper" },
  {
    phrase: "a bit of",
    usedWith: "luck, help, advice, fun",
    example: "a bit of luck",
  },
  { phrase: "a lot of", usedWith: "anything", example: "a lot of information" },
];

const VERB_AGREEMENT = [
  {
    rule: "不可數名詞單獨出現 → 使用單數動詞",
    examples: [
      { sentence: "The water is cold.", highlight: "is" },
      { sentence: "Money is not everything.", highlight: "is" },
      { sentence: "The news is shocking.", highlight: "is" },
    ],
  },
  {
    rule: "複數單位量詞 + 不可數名詞 → 使用複數動詞",
    examples: [
      { sentence: "Two bags of rice are on the table.", highlight: "are" },
      { sentence: "Three cups of coffee were ordered.", highlight: "were" },
      {
        sentence: "Several pieces of furniture have arrived.",
        highlight: "have",
      },
    ],
  },
];

const UNCOUNTABLE_WORDS: UncountableWord[] = [
  { word: "advice", translation: "建議", category: "abstract" },
  { word: "confidence", translation: "信心", category: "abstract" },
  { word: "freedom", translation: "自由", category: "abstract" },
  { word: "health", translation: "健康", category: "abstract" },
  { word: "knowledge", translation: "知識", category: "abstract" },
  { word: "love", translation: "愛", category: "abstract" },
  { word: "luck", translation: "運氣", category: "abstract" },
  { word: "music", translation: "音樂", category: "abstract" },
  { word: "flour", translation: "麵粉", category: "tiny" },
  { word: "hair", translation: "頭髮", category: "tiny" },
  { word: "rice", translation: "米飯", category: "tiny" },
  { word: "salt", translation: "鹽", category: "tiny" },
  { word: "sand", translation: "沙子", category: "tiny" },
  { word: "snow", translation: "雪", category: "tiny" },
  { word: "sugar", translation: "糖", category: "tiny" },
  { word: "air", translation: "空氣", category: "shapeless" },
  { word: "concrete", translation: "混凝土", category: "shapeless" },
  { word: "gas", translation: "氣體", category: "shapeless" },
  { word: "milk", translation: "牛奶", category: "shapeless" },
  { word: "oil", translation: "油", category: "shapeless" },
  { word: "smoke", translation: "煙霧", category: "shapeless" },
  { word: "water", translation: "水", category: "shapeless" },
  { word: "bread", translation: "麵包", category: "collective" },
  { word: "food", translation: "食物", category: "collective" },
  { word: "fruit", translation: "水果", category: "collective" },
  { word: "furniture", translation: "家具", category: "collective" },
  { word: "homework", translation: "作業", category: "collective" },
  { word: "information", translation: "資訊", category: "collective" },
  { word: "luggage", translation: "行李", category: "collective" },
  { word: "meat", translation: "肉類", category: "collective" },
  { word: "money", translation: "金錢", category: "collective" },
  { word: "news", translation: "新聞", category: "collective" },
  { word: "research", translation: "研究", category: "collective" },
  { word: "work", translation: "工作", category: "collective" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "概覽" },
  { id: "categories", label: "不可數名詞分類" },
  { id: "wordlist", label: "不可數單字" },
  { id: "verb", label: "is / are?" },
  { id: "measure", label: "把不可數變可數的方法" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function CountabilityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [activeCatId, setActiveCatId] = useState(UNCOUNTABLE_CATEGORIES[0].id);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(35px, 25px); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `linear-gradient(${THEME.purple}40 1px, transparent 1px), linear-gradient(90deg, ${THEME.purple}40 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${THEME.purple}15 0%, transparent 70%)`,
              filter: "blur(90px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
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
            <span style={{ color: THEME.purple }}>Countability</span>
          </div>

          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Noun <span style={{ color: THEME.purple }}>Countability</span>
            </h1>
            <div className="text-gray-400 text-base leading-relaxed max-w-2xl">
              <p>
                英文名詞分為<span className="text-white/70 mx-1">可數</span>與
                <span className="text-white/70 mx-1">不可數</span>。
                這決定了冠詞的使用、複數形式以及動詞的一致性。
              </p>
              <p style={{ color: THEME.gold }} className="font-medium mt-2">
                基本上，你只需要特別記住不可數名詞有哪些就好。
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 mb-10 p-1.5 rounded-2xl w-fit flex-wrap bg-white/[0.04] border border-white/[0.07]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-5 py-2.5 rounded-xl text-base font-bold transition-all duration-300"
                style={{
                  background:
                    activeTab === t.id ? `${THEME.purple}18` : "transparent",
                  color: activeTab === t.id ? THEME.purple : "#6b7280",
                  border: `1px solid ${
                    activeTab === t.id ? `${THEME.purple}30` : "transparent"
                  }`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-3">
                {UNCOUNTABLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatId(cat.id)}
                    className="relative flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-black transition-all duration-200 overflow-hidden"
                    style={{
                      // 統一紫底，點擊後換黃底 (THEME.gold)
                      background:
                        activeCatId === cat.id
                          ? THEME.gold
                          : `${THEME.purple}10`,
                      color: activeCatId === cat.id ? "#000" : THEME.purple,
                      boxShadow:
                        activeCatId === cat.id
                          ? `0 0 24px ${THEME.gold}45`
                          : "none",
                      transform:
                        activeCatId === cat.id ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    <span className="text-2xl relative z-10">{cat.icon}</span>
                    <span className="text-xs font-black relative z-10">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              {UNCOUNTABLE_CATEGORIES.filter((c) => c.id === activeCatId).map(
                (cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    activeColor={THEME.gold}
                  />
                ),
              )}
            </div>
          )}
          {activeTab === "measure" && <MeasureSection />}
          {activeTab === "verb" && <VerbSection />}
          {activeTab === "wordlist" && <WordListSection />}
        </div>
      </main>
    </>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div
      className="grid grid-cols-2 gap-6"
      style={{ animation: "fadeUp 0.4s ease both" }}
    >
      {(["countable", "uncountable"] as const).map((key) => {
        const data = OVERVIEW[key];
        return (
          <div
            key={key}
            className="rounded-3xl border p-6 space-y-5"
            style={{
              borderColor: `${data.color}22`,
              background: `linear-gradient(135deg, ${data.color}07 0%, #0d0d0d 65%)`,
            }}
          >
            <div
              className="inline-block px-4 py-1.5 rounded-lg text-sm font-black"
              style={{ background: `${data.color}18`, color: data.color }}
            >
              {data.title}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{data.rule}</p>
            <div className="flex flex-wrap gap-2">
              {data.signals.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white/[0.05] text-white/60"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              {data.examples.map((e, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-xl text-sm font-mono bg-white/[0.03] text-gray-500"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryCard({
  cat,
  activeColor,
}: {
  cat: CountCategory;
  activeColor: string;
}) {
  const [tab, setTab] = useState<"words" | "examples">("words");
  return (
    <div
      className="rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden"
      style={{ animation: "fadeUp 0.4s ease both" }}
    >
      <div className="p-6 border-b border-white/[0.04] flex gap-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: `${activeColor}15`, color: activeColor }}
        >
          {cat.icon}
        </div>
        <div>
          <h3 className="text-white font-black text-xl">{cat.label}</h3>
          <p className="text-gray-400 text-sm mt-1">{cat.description}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {(["words", "examples"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                tab === t ? "bg-white/10 text-white" : "text-gray-500"
              }`}
            >
              {t === "words" ? "常用單字" : "句子範例"}
            </button>
          ))}
        </div>
        {tab === "words" ? (
          <div className="flex flex-wrap gap-2">
            {cat.words.map((w) => (
              <span
                key={w}
                className="px-4 py-2 rounded-xl text-sm font-mono font-bold bg-white/[0.03] border border-white/[0.05]"
                style={{ color: activeColor }}
              >
                {w}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cat.examples.map((e, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <p className="text-white font-medium">
                  {e.sentence.split(e.highlight)[0]}
                  <span
                    style={{ color: activeColor }}
                    className="font-black underline underline-offset-4 mx-1"
                  >
                    {e.highlight}
                  </span>
                  {e.sentence.split(e.highlight)[1]}
                </p>
                <p className="text-xs text-gray-500 mt-2">{e.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MeasureSection() {
  return (
    <div className="space-y-6" style={{ animation: "fadeUp 0.4s ease both" }}>
      <div
        className={`p-6 rounded-3xl bg-[${THEME.gold}]/[0.03] border border-[${THEME.gold}]/10`}
      >
        <h4
          style={{ color: THEME.gold }}
          className="font-black mb-2 flex items-center gap-2"
        >
          <span>💡</span> 把不可數變可數的方法
        </h4>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          因為不可數名詞無法直接加 s
          或數字，我們必須透過「量詞」這個媒介，把它們放進「可計數」的單位或容器中。
        </p>
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] font-mono text-xs text-center">
          <span className="text-white/40">數量 + </span>
          <span style={{ color: THEME.gold }} className="font-bold">
            單位(可數)
          </span>
          <span className="text-white/40"> + of + </span>
          <span style={{ color: THEME.purple }} className="font-bold">
            名詞(不可數)
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {MEASURE_WORDS.map((m) => (
          <div
            key={m.phrase}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
          >
            <div>
              <span
                style={{ color: THEME.gold }}
                className="font-mono font-black"
              >
                {m.phrase}
              </span>
              <span className="ml-4 text-gray-500 text-sm">{m.usedWith}</span>
            </div>
            <span
              style={{
                background: `${THEME.gold}10`,
                color: `${THEME.gold}cc`,
              }}
              className="text-xs font-mono px-3 py-1 rounded-lg"
            >
              {m.example}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerbSection() {
  return (
    <div className="space-y-8" style={{ animation: "fadeUp 0.4s ease both" }}>
      {VERB_AGREEMENT.map((block, bi) => (
        <div key={bi} className="space-y-4">
          <div
            style={{ color: THEME.purple }}
            className="text-sm font-black uppercase tracking-widest"
          >
            {block.rule}
          </div>
          <div className="grid gap-3">
            {block.examples.map((e, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-white"
              >
                {e.sentence.split(e.highlight)[0]}
                <span
                  style={{ color: THEME.purple }}
                  className="font-black px-1"
                >
                  {e.highlight}
                </span>
                {e.sentence.split(e.highlight)[1]}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WordListSection() {
  const [filter, setFilter] = useState<"all" | UncountableCategory>("all");
  const CATEGORY_META: Record<
    UncountableCategory,
    { label: string; color: string }
  > = {
    abstract: { label: "抽象", color: THEME.purple },
    tiny: { label: "顆粒", color: THEME.purple },
    shapeless: { label: "無形", color: THEME.purple },
    collective: { label: "集合", color: THEME.purple },
  };

  const filtered =
    filter === "all"
      ? UNCOUNTABLE_WORDS
      : UNCOUNTABLE_WORDS.filter((w) => w.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
            filter === "all"
              ? "bg-white/10 border-white/20 text-white"
              : "border-transparent text-gray-500"
          }`}
        >
          全部
        </button>
        {(
          Object.entries(CATEGORY_META) as [
            UncountableCategory,
            { label: string; color: string },
          ][]
        ).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-all"
            style={{
              background: filter === key ? `${THEME.gold}18` : "transparent",
              color: filter === key ? THEME.gold : "#6b7280",
              borderColor: filter === key ? `${THEME.gold}35` : "transparent",
            }}
          >
            {meta.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((w) => {
          const meta = CATEGORY_META[w.category];
          const isSelected = filter === w.category;
          return (
            <div
              key={w.word}
              className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/[0.05] bg-white/[0.02]"
            >
              <div>
                <span className="text-white font-mono font-bold">{w.word}</span>
                <p className="text-gray-500 text-xs">{w.translation}</p>
              </div>
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-lg"
                style={{
                  background: isSelected
                    ? `${THEME.gold}12`
                    : `${THEME.purple}12`,
                  color: isSelected ? THEME.gold : THEME.purple,
                }}
              >
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
