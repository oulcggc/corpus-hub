import { isLocale, LOCALES, localePath, type Locale } from "@lib/i18n";

export interface ArticleIdentity {
  id: string;
  data: { slug: string; locale: Locale; published: Date };
}

/** A literal URL path, independent of the title and content filename. */
export function isArticleSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    slug === slug.normalize("NFC") &&
    /^[\p{L}\p{M}\p{N}_/-]+$/u.test(slug) &&
    slug.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

export function articlePath(article: ArticleIdentity): string {
  return localePath(
    article.data.locale,
    `articles/${article.data.slug.split("/").map(encodeURIComponent).join("/")}`,
  );
}

/** Reject duplicate routes before generating pages or choosing translations. */
export function groupArticleVersions<T extends ArticleIdentity>(articles: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const article of articles) {
    const { slug, locale } = article.data;
    if (!isArticleSlug(slug) || !isLocale(locale)) {
      throw new Error(`Invalid article route: ${article.id}`);
    }
    const versions = groups.get(slug) ?? [];
    const duplicate = versions.find((version) => version.data.locale === locale);
    if (duplicate) {
      throw new Error(`Duplicate article route /${locale}/articles/${slug}/: ${duplicate.id}, ${article.id}`);
    }
    versions.push(article);
    groups.set(slug, versions);
  }
  for (const versions of groups.values()) {
    versions.sort((a, b) => LOCALES.indexOf(a.data.locale) - LOCALES.indexOf(b.data.locale));
  }
  return groups;
}

export function articlesForLocale<T extends ArticleIdentity>(articles: T[], locale: Locale): T[] {
  return [...groupArticleVersions(articles).values()]
    .map((versions) => versions.find((article) => article.data.locale === locale) ?? versions[0]!)
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf() ||
      (a.data.slug < b.data.slug ? -1 : a.data.slug > b.data.slug ? 1 : 0));
}
