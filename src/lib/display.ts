import * as m from "../paraglide/messages";
import { pickLocalized, nativeForm, localePath, type Locale } from "./i18n";
import type { ResolvedResource, ResolvedTool, Tool } from "./catalog";

const KIND_TO_CATEGORY: Record<string, string> = {
  corpus: "corpora",
  dataset: "datasets",
  dictionary: "dictionaries",
  "text-archive": "archives",
  concordancer: "concordancers",
  converter: "tools",
  analyzer: "tools",
};

export function categoryOf(kind: string): string {
  const category = KIND_TO_CATEGORY[kind];
  if (!category) throw new Error(`Unknown catalog kind: ${kind}`);
  return category;
}

export function languageNames(langs: string[], locale: Locale): string[] {
  const names = new Intl.DisplayNames([locale], { type: "language" });
  return langs.map((lang) => names.of(lang) ?? lang);
}

export function accessChips(access: Tool["data"]["access"], locale: Locale): string[] {
  const chips: string[] = [];
  chips.push(
    access.delivery === "web"
      ? m.accessOnline({}, { locale })
      : m.accessDownload({}, { locale }),
  );
  if (access.cost === "free") chips.push(m.accessFree({}, { locale }));
  if (access.cost === "freemium") chips.push(m.accessFreemium({}, { locale }));
  if (access.cost === "paid") chips.push(m.accessPaid({}, { locale }));
  if (access.registration === "account")
    chips.push(m.accessAccount({}, { locale }));
  if (access.registration === "application")
    chips.push(m.accessApplication({}, { locale }));
  return chips;
}

type Labeler = (params: object, options: { locale: Locale }) => string;

const PERIOD_LABELS: Record<string, Labeler> = {
  contemporary: m.periodContemporary,
  modern: m.periodModern,
  "early-modern": m.periodEarlyModern,
  classical: m.periodClassical,
  diachronic: m.periodDiachronic,
};

const ANNOTATION_LABELS: Record<string, Labeler> = {
  none: m.annotationNone,
  tokenized: m.annotationTokenized,
  pos: m.annotationPos,
  lemma: m.annotationLemma,
  parsed: m.annotationParsed,
  aligned: m.annotationAligned,
};

const TAG_LABELS: Record<string, Labeler> = {
  "old-japanese": m.tagOldJapanese,
  "middle-japanese": m.tagMiddleJapanese,
  "classical-japanese": m.tagClassicalJapanese,
  parallel: m.tagParallel,
};

const ACCESS_LABELS: Record<string, Labeler> = {
  web: m.accessOnline,
  download: m.accessDownload,
  free: m.accessFree,
  freemium: m.accessFreemium,
  paid: m.accessPaid,
  account: m.accessAccount,
  application: m.accessApplication,
};

function label(map: Record<string, Labeler>, value: string, locale: Locale) {
  return map[value]?.({}, { locale }) ?? value;
}

export const labelPeriod = (v: string, l: Locale) => label(PERIOD_LABELS, v, l);
export const labelAnnotation = (v: string, l: Locale) =>
  label(ANNOTATION_LABELS, v, l);
export const labelTag = (v: string, l: Locale) => label(TAG_LABELS, v, l);
export const labelAccess = (v: string, l: Locale) => label(ACCESS_LABELS, v, l);

/** Every text form of an entry, for the list pages' client-side filter. */
export function searchText(
  entry: ResolvedResource | ResolvedTool,
): string {
  const values = [
    entry.id,
    ...Object.values(entry.data.name),
    ...Object.values(entry.data.abbr ?? {}),
    ...Object.values(entry.organization?.data.name ?? {}),
    ...Object.values(entry.organization?.data.abbr ?? {}),
  ];
  return values.filter(Boolean).join(" ").toLowerCase();
}

export interface CardProps {
  locale: Locale;
  title: string;
  titleNative: string | undefined;
  detailHref: string;
  externalHref: string;
  org: { name: string; href: string } | undefined;
  items: { label: string; href: string }[];
  chips: string[];
}

function orgProp(
  entry: ResolvedResource | ResolvedTool,
  locale: Locale,
): { name: string; href: string } | undefined {
  if (!entry.organization) return undefined;
  const nativeLang = entry.data.langs[0];
  const abbr = entry.organization.data.abbr ?? entry.organization.data.name;
  return {
    name: pickLocalized(abbr, locale, nativeLang),
    href: entry.organization.data.link,
  };
}

export function resourceCard(
  resource: ResolvedResource,
  locale: Locale,
): CardProps {
  const nativeLang = resource.data.langs[0];
  const display = resource.data.abbr ?? resource.data.name;
  const title = pickLocalized(display, locale, nativeLang);
  return {
    locale,
    title,
    titleNative: nativeForm(display, title, nativeLang),
    detailHref: localePath(
      locale,
      `${categoryOf(resource.data.kind)}/${resource.id}`,
    ),
    externalHref: resource.data.link,
    org: orgProp(resource, locale),
    items: resource.tools.map((tool) => ({
      label: pickLocalized(
        tool.data.abbr ?? tool.data.name,
        locale,
        tool.data.langs[0],
      ),
      href: localePath(locale, `${categoryOf(tool.data.kind)}/${tool.id}`),
    })),
    chips: languageNames(resource.data.langs, locale),
  };
}

export function toolCard(tool: ResolvedTool, locale: Locale): CardProps {
  const nativeLang = tool.data.langs[0];
  const display = tool.data.abbr ?? tool.data.name;
  const title = pickLocalized(display, locale, nativeLang);
  return {
    locale,
    title,
    titleNative: nativeForm(display, title, nativeLang),
    detailHref: localePath(
      locale,
      `${categoryOf(tool.data.kind)}/${tool.id}`,
    ),
    externalHref: tool.data.link,
    org: orgProp(tool, locale),
    items: tool.resources.map((resource) => ({
      label: pickLocalized(
        resource.data.name,
        locale,
        resource.data.langs[0],
      ),
      href: localePath(
        locale,
        `${categoryOf(resource.data.kind)}/${resource.id}`,
      ),
    })),
    chips: accessChips(tool.data.access, locale),
  };
}
