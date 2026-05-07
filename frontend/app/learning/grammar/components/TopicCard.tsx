// frontend/app/learning/grammar/components/TopicCard.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GrammarTopic, Locale } from "../types";
import { LEVEL_CONFIG } from "../constants/config";

export function TopicCard({
  topic,
  animDelay,
  locale,
}: {
  topic: GrammarTopic;
  animDelay: string;
  locale: Locale | null;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const cfg = LEVEL_CONFIG[topic.level];
  const nativeHint = locale ? topic.hint?.[locale] : null;

  return (
    <div
      className="relative cursor-pointer group"
      style={{ animation: "fadeUp 0.5s ease both", animationDelay: animDelay }}
      onClick={() => router.push(`/learning/grammar/topic/${topic.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-2xl border p-5 transition-all duration-300 overflow-hidden"
        style={{
          background: hovered ? cfg.bgColor : "#0d0d0d",
          borderColor: hovered ? cfg.color + "50" : "rgba(255,255,255,0.06)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 12px 40px ${cfg.color}15, 0 0 0 1px ${cfg.color}20`
            : "none",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${cfg.color}, transparent)`,
            opacity: hovered ? 0.8 : 0,
          }}
        />

        <div className="flex items-start gap-3 mb-3">
          <span
            className="text-xs font-black font-mono mt-0.5 shrink-0 transition-colors duration-300"
            style={{ color: hovered ? cfg.color : "#374151" }}
          >
            {String(topic.index).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm leading-tight">
              {topic.title}
            </h3>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="shrink-0 mt-0.5 transition-all duration-300"
            style={{
              color: hovered ? cfg.color : "#1f2937",
              transform: hovered ? "translate(2px, -2px)" : "translate(0,0)",
            }}
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed pl-7 group-hover:text-gray-500 transition-colors duration-300">
          {topic.description}
        </p>

        {nativeHint && (
          <p
            className="text-xs leading-relaxed pl-7 mt-1.5 transition-colors duration-300"
            style={{ color: hovered ? cfg.color + "aa" : "#4b5563" }}
          >
            {nativeHint}
          </p>
        )}
      </div>
    </div>
  );
}
