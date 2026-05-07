// frontend/app/learning/grammar/components/LevelSection.tsx

import { Level, GrammarTopic, Locale } from "../types";
import { LEVEL_CONFIG } from "../constants/config";
import { TopicCard } from "./TopicCard";

interface LevelSectionProps {
  level: Level;
  topics: GrammarTopic[];
  baseDelay: number;
  locale: Locale | null;
}

export function LevelSection({
  level,
  topics,
  baseDelay,
  locale,
}: LevelSectionProps) {
  const cfg = LEVEL_CONFIG[level];

  return (
    <section
      style={{
        animation: "fadeUp 0.5s ease both",
        animationDelay: `${baseDelay}ms`,
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
          />
          <span
            className="text-xs font-black tracking-[0.2em] uppercase"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, ${cfg.color}30, transparent)`,
          }}
        />
        <span className="text-xs font-mono text-gray-700">
          {topics.length} topics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {topics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            animDelay={`${baseDelay + i * 60}ms`}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}
