import { expect, test } from "bun:test";
import { linkCheckText } from "../scripts/link-check-targets";
const link = "https://closed.example/";
test("closed services omit only their former address", () => {
  const text = linkCheckText({
    link,
    service: { status: "closed", archive: { url: "https://archive.example/" }, closureSource: "https://notice.example/" },
    relatedResources: [{ source: "https://alternative.example/" }],
  });
  expect(text).not.toContain(link);
  for (const url of ["https://archive.example/", "https://notice.example/", "https://alternative.example/"]) expect(text).toContain(url);
});
test("active entries and descriptions retain their links", () => {
  expect(linkCheckText({ link, description: { en: "See https://docs.example/\nfor details." } }))
    .toBe(link + "\nSee https://docs.example/\nfor details.");
});
test("closed entries without an archive do not create a dead-link target", () => {
  expect(linkCheckText({ link, service: { status: "closed" } })).not.toContain(link);
});
test("invalid catalog documents fail instead of silently skipping checks", () => {
  expect(() => linkCheckText(null)).toThrow();
  expect(() => linkCheckText([])).toThrow();
});
