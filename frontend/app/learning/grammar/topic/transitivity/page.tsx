// frontend/app/learning/grammar/topic/transitivity/page.tsx

"use client";

import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

type VerbExample = {
  verb: string;
  transitive: string;
  intransitive: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const DUAL_VERBS: VerbExample[] = [
  {
    verb: "start",
    transitive: "He started the car.",
    intransitive: "The movie starts at 8 p.m.",
  },
  {
    verb: "play",
    transitive: "I play the piano.",
    intransitive: "The kids are playing outside.",
  },
  {
    verb: "close",
    transitive: "Close the door, please.",
    intransitive: "The library closes at noon.",
  },
  {
    verb: "grow",
    transitive: "I grow roses in my yard.",
    intransitive: "He is growing so fast!",
  },
  {
    verb: "run",
    transitive: "She runs a tech company.",
    intransitive: "I run every morning.",
  },
  {
    verb: "write",
    transitive: "Write your name here.",
    intransitive: "She writes beautifully.",
  },
  {
    verb: "wash",
    transitive: "Wash your hands.",
    intransitive: "I washed and got dressed.",
  },
  {
    verb: "open",
    transitive: "Open the box.",
    intransitive: "The door opened slowly.",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TransitivityPage() {
  const router = useRouter();

  const THEME = {
    purple: "#a78bfa",
    gold: "#fbbf24",
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-28 px-6 relative">
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
            <span style={{ color: THEME.purple }}>Transitivity</span>
          </div>

          {/* Header */}
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.4s ease both 0.08s" }}
          >
            <h1 className="text-6xl font-black text-white tracking-tight leading-none mb-6">
              Verb <span style={{ color: THEME.purple }}>Transitivity</span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              如何分辨及物與不及物？簡單來說：
              <span className="text-white/70 mx-1">
                這個動作後面，需不需要直接加一個「受詞」意思才完整？
              </span>
            </p>
          </div>

          {/* 核心判斷卡片 */}
          <div
            className="grid grid-cols-2 gap-6 mb-16"
            style={{ animation: "fadeUp 0.4s ease both 0.14s" }}
          >
            {/* 及物動詞 VT */}
            <div
              className="p-8 rounded-[32px] border relative overflow-hidden group flex flex-col"
              style={{
                borderColor: `${THEME.purple}20`,
                backgroundColor: `${THEME.purple}05`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="px-3 py-1 rounded-lg font-mono text-xs font-black italic"
                  style={{
                    background: `${THEME.purple}20`,
                    color: THEME.purple,
                  }}
                >
                  vt.
                </div>
                <h3 className="text-white text-xl font-bold">
                  及物動詞 Transitive
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                動作必須傳導到一個「對象」身上。
              </p>

              <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono mt-auto">
                {/* 加上 + 號並維持層次 */}
                <p className="text-gray-500 text-lg mb-2">
                  I <span className="mx-1">+</span>{" "}
                  <span style={{ color: THEME.gold }}>love</span>{" "}
                  <span className="mx-1">+</span> [受詞].
                </p>
                <p className="text-white text-2xl font-bold tracking-tight">
                  I <span style={{ color: THEME.gold }}>love</span>{" "}
                  <span
                    className="underline decoration-2 underline-offset-4"
                    style={{ textDecorationColor: THEME.gold }}
                  >
                    animals
                  </span>
                  .
                </p>
              </div>
              <div
                className="absolute -bottom-6 -right-4 text-9xl font-black opacity-[0.03] italic select-none pointer-events-none"
                style={{ color: THEME.purple }}
              >
                VT
              </div>
            </div>

            {/* 不及物動詞 VI */}
            <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02] relative overflow-hidden group flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 rounded-lg bg-white/10 text-gray-500 font-mono text-xs font-black italic">
                  vi.
                </div>
                <h3 className="text-white text-xl font-bold">
                  不及物動詞 Intransitive
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                動作本身即可完成意思，不需要對象。
              </p>

              <div className="p-6 rounded-2xl bg-black border border-white/5 font-mono mt-auto">
                <p className="text-white text-2xl font-bold mb-2 tracking-tight">
                  I <span style={{ color: THEME.gold }}>cry</span>.
                </p>
                <p className="text-red-500/80 text-lg font-bold italic">
                  I <span style={{ color: THEME.gold }}>cry</span>{" "}
                  <del className="opacity-50 text-white">her</del>. (❌)
                </p>
              </div>
              <div className="absolute -bottom-6 -right-4 text-9xl font-black opacity-[0.03] italic text-white select-none pointer-events-none">
                VI
              </div>
            </div>
          </div>

          {/* 兩者兼有之區塊 */}
          <div
            className="mb-16"
            style={{ animation: "fadeUp 0.4s ease both 0.2s" }}
          >
            <h2 className="text-base font-black text-gray-200 uppercase tracking-[0.2em] mb-8 flex items-center gap-6">
              兩者兼有之動詞 DUAL NATURE
              <div className="h-px flex-1 bg-white/10" />
            </h2>

            <div className="rounded-[32px] border border-white/[0.05] bg-white/[0.01] overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/[0.05] bg-white/[0.02]">
                <div className="col-span-2">Verb</div>
                <div
                  className="col-span-5 italic"
                  style={{ color: THEME.purple }}
                >
                  Transitive (有受詞)
                </div>
                <div className="col-span-5 text-gray-400/70 italic">
                  Intransitive (無受詞)
                </div>
              </div>

              {DUAL_VERBS.map((item) => (
                <div
                  key={item.verb}
                  className="grid grid-cols-12 gap-4 px-8 py-8 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="col-span-2 text-white text-xl font-black font-mono">
                    {item.verb}
                  </div>
                  <div className="col-span-5 text-lg text-gray-300 leading-snug">
                    {item.transitive.split(item.verb)[0]}
                    <span
                      className="font-black border-b"
                      style={{
                        color: THEME.gold,
                        borderColor: `${THEME.gold}40`,
                      }}
                    >
                      {item.verb}
                    </span>
                    {item.transitive.split(item.verb)[1]}
                  </div>
                  <div className="col-span-5 text-lg text-gray-500 leading-snug">
                    {item.intransitive.split(item.verb)[0]}
                    <span className="text-white/60 font-bold">{item.verb}</span>
                    {item.intransitive.split(item.verb)[1]}
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
