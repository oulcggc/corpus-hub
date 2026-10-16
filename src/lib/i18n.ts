export const LOCALES = ["en", "ja", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedString = Partial<Record<string, string>>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Resolve a localized string record for display.
 * Order: requested locale → the entry's own language → first listed form.
 * The first form is the one the entry's author wrote first, so an entry
 * without a translation shows its original name rather than nothing.
 */
export function pickLocalized(
  str: LocalizedString,
  locale: string,
  nativeLang?: string,
): string {
  return (
    str[locale] ??
    (nativeLang ? str[nativeLang] : undefined) ??
    Object.values(str).find((v) => v !== undefined) ??
    ""
  );
}

/**
 * The entry's own-language form, when it differs from the resolved one.
 * Shown beside the localized form so the original name stays citable.
 */
export function nativeForm(
  str: LocalizedString,
  resolved: string,
  nativeLang?: string,
): string | undefined {
  if (!nativeLang) return undefined;
  const native = str[nativeLang];
  return native && native !== resolved ? native : undefined;
}

export function localePath(locale: string, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}/`;
}
