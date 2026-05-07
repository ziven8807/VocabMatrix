// frontend/app/learning/grammar/hooks/useLocale.ts

import { useState } from "react";
import { Locale } from "../types";
import { SUPPORTED_LOCALES } from "../constants/config";

export function useLocale(): Locale {
  const [locale] = useState<Locale>(() => {
    // SSR 保護：在服務端渲染時回傳預設值
    if (typeof window === "undefined") return "en";

    const lang = navigator.language;
    return (
      SUPPORTED_LOCALES.find((l) => l === lang) ??
      SUPPORTED_LOCALES.find((l) => l.startsWith(lang.split("-")[0])) ??
      "en" // 預設英文而非 null
    );
  });

  return locale;
}
