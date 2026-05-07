// frontend/app/learning/grammar/types.ts

export type Level = "basic" | "intermediate" | "advanced" | "reference";
export type Locale = "en" | "zh-TW" | "zh-CN" | "ja" | "ko" | "es" | "fr";

export type GrammarTopic = {
  id: string;
  title: string;
  level: Level;
  description: string;
  hint?: Partial<Record<Locale, string>>;
  index: number;
};

export type LevelConfig = {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
};
