// frontend/app/learning/grammar/constants/config.ts

import { Level, LevelConfig, Locale } from "../types";

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  basic: {
    label: "BASIC",
    color: "#34d399",
    bgColor: "rgba(52,211,153,0.08)",
    borderColor: "rgba(52,211,153,0.2)",
  },
  intermediate: {
    label: "INTERMEDIATE",
    color: "#a855f7", // 呼應你的紫色 UI
    bgColor: "rgba(168,85,247,0.08)",
    borderColor: "rgba(168,85,247,0.2)",
  },
  advanced: {
    label: "ADVANCED",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.08)",
    borderColor: "rgba(249,115,22,0.2)",
  },
  reference: {
    label: "REFERENCE",
    color: "#64748b",
    bgColor: "rgba(100,116,139,0.08)",
    borderColor: "rgba(100,116,139,0.2)",
  },
};

export const LEVEL_ORDER: Level[] = [
  "basic",
  "intermediate",
  "advanced",
  "reference",
];
export const SUPPORTED_LOCALES: Locale[] = [
  "zh-TW",
  "zh-CN",
  "ja",
  "ko",
  "es",
  "fr",
];
