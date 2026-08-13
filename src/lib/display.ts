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

export interface CardProps {
  locale: Locale;
  title: string;
  titleNative: string | undefined;
  detailHref: string;
  externalHref: string;
  org: { name: string; href: string };
  items: { label: string; href: string }[];
  chips: string[];
}

function orgProp(
  entry: ResolvedResource | ResolvedTool,
  locale: Locale,
): { name: string; href: string } {
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
