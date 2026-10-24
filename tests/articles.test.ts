import { describe, expect, test } from "bun:test";
import { articlePath, articlesForLocale, groupArticleVersions, isArticleSlug, type ArticleIdentity } from "../src/lib/articles";

function article(id: string, slug: string, locale: "en" | "ja" | "zh"): ArticleIdentity {
  return { id, data: { slug, locale, published: new Date("2024-06-19") } };
}

describe("article identities", () => {
  test("explicit nested Unicode slugs survive filenames and language-like folders", () => {
    const a = article("drafts/renamed-file", "ja/漢語研究/資料-v1-2", "zh");
    expect([...groupArticleVersions([a]).keys()]).toEqual(["ja/漢語研究/資料-v1-2"]);
    expect(articlePath(a)).toBe("/zh/articles/ja/%E6%BC%A2%E8%AA%9E%E7%A0%94%E7%A9%B6/%E8%B3%87%E6%96%99-v1-2/");
  });

  test("invalid paths cannot escape or alias another article URL", () => {
    for (const slug of ["", "/a", "a/", "a//b", ".", "a/../b", "a/./b", "a\\b", "a%2fb", "a?b", "a#b", "a b", "a\nb", "a\u0000b", "a\u200bb", "cafe\u0301", "a:b", "a;b", "a&b", "a=b", "a+b", "a,b", "a@b", "a$b", "guide.html", "guide/index.html", "\uD800", "\uDFFF"]) {
      expect(isArticleSlug(slug)).toBe(false);
      expect(() => groupArticleVersions([article("source", slug, "ja")])).toThrow("Invalid article route");
    }
    expect(isArticleSlug("café/音韻論")).toBe(true);
    for (const slug of ["café/音韻論", "ja/漢語研究/資料-v1-2", "研究_2026", "𠮷野"]) {
      expect(decodeURI(articlePath(article("source", slug, "ja")))).toBe(`/ja/articles/${slug}/`);
    }
  });

  test("duplicate locale/slug pairs fail even when filenames differ", () => {
    expect(() => groupArticleVersions([article("a", "guide", "ja"), article("b", "guide", "ja")])).toThrow("Duplicate article route");
  });

  test("translations share the explicit slug, not the source filename", () => {
    const ja = article("ja/original", "guide", "ja"), en = article("en/translation", "guide", "en");
    expect(groupArticleVersions([ja, en]).get("guide")).toEqual([en, ja]);
    expect(articlesForLocale([en, ja], "ja")).toEqual([ja]);
  });

  test("fallback and publication ties are deterministic regardless of loader order", () => {
    const ja = article("ja/a", "a", "ja"), zh = article("zh/a", "a", "zh"), en = article("en/b", "b", "en");
    expect(articlesForLocale([zh, en, ja], "en")).toEqual([ja, en]);
    expect(articlesForLocale([ja, en, zh], "en")).toEqual([ja, en]);
  });
});
