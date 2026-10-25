import { describe, expect, test } from "bun:test";
import { languageFilterTokens, languagePath, languageName } from "../src/lib/languages";

describe("Chinese catalog group", () => {
  test("the broad filter includes each child without changing its identity", () => {
    for (const code of ["lzh", "yue", "hak", "nan", "wuu"]) {
      expect(languagePath(code)).toEqual(["zh", code]);
      expect(languageFilterTokens([code])).toEqual(["zh", code]);
    }
    expect(languageFilterTokens(["zh"])).toEqual(["zh"]);
  });
  test("specific filters exclude siblings and broad-only records", () => {
    const records = [["zh"], ["lzh"], ["yue"], ["hak"], ["nan"], ["wuu"], ["ja"], ["ko"]];
    expect(records.filter(langs => languageFilterTokens(langs).includes("zh"))).toHaveLength(6);
    expect(records.filter(langs => languageFilterTokens(langs).includes("yue"))).toEqual([["yue"]]);
  });
  test("multilingual entries deduplicate ancestors and preserve unrelated codes", () => {
    expect(languageFilterTokens(["yue", "zh", "hak", "ja", "ko", "und"]))
      .toEqual(["zh", "yue", "hak", "ja", "ko", "und"]);
  });
});

test("group labels are localized in Traditional Chinese without raw language codes", () => {
  expect(["zh", "lzh", "yue", "hak", "nan", "wuu"].map(code => languageName(code, "zh")))
    .toEqual(["漢語", "文言文", "粵語", "客家話", "閩南語", "吳語"]);
  expect(languageName("lzh", "en")).toBe("Literary Chinese");
});
