/** Catalog groups for browsing; the original language codes remain on entries. */
export const LANGUAGE_PARENTS: Readonly<Record<string, string>> = {
  lzh: "zh",
  yue: "zh",
  hak: "zh",
  nan: "zh",
  wuu: "zh",
};

export function languagePath(code: string): string[] {
  const path = [code];
  while (LANGUAGE_PARENTS[path[0]]) {
    const parent = LANGUAGE_PARENTS[path[0]];
    if (path.includes(parent)) throw new Error(`Cyclic language group: ${code}`);
    path.unshift(parent);
  }
  return path;
}

export function languageFilterTokens(codes: string[]): string[] {
  return [...new Set(codes.flatMap(languagePath))];
}

const CHINESE_LABELS = {
  en: { zh: "Chinese", lzh: "Literary Chinese", yue: "Cantonese", hak: "Hakka", nan: "Southern Min", wuu: "Wu" },
  ja: { zh: "中国語", lzh: "漢文", yue: "広東語", hak: "客家語", nan: "閩南語", wuu: "呉語" },
  zh: { zh: "漢語", lzh: "文言文", yue: "粵語", hak: "客家話", nan: "閩南語", wuu: "吳語" },
};

export function languageName(code: string, locale: "en" | "ja" | "zh"): string {
  const labels: Record<string, string> = CHINESE_LABELS[locale];
  return labels[code] ?? new Intl.DisplayNames([locale === "zh" ? "zh-Hant" : locale], { type: "language" }).of(code) ?? code;
}
