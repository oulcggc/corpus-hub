import { describe, expect, test } from "bun:test";
import { z } from "astro/zod";
import { externalAction, serviceSchema, resourceRelationSchema } from "../src/lib/service";
const link = "https://example.org/";
const closed = { status: "closed" as const, checkedAt: "2026-10-24", note: { en: "Closed" } };
describe("closed-service actions", () => {
  test("active entries keep their original site action", () => expect(externalAction({ link })).toEqual({ href: link, kind: "visit" }));
  test("closed entries without an archive have no external action", () => expect(externalAction({ link, service: closed })).toBeUndefined());
  test("closed entries link to the archive instead of the former site", () => {
    const archive = { url: "https://web.archive.org/web/20210101/https://example.org/", capturedAt: "2021-01-01" };
    expect(externalAction({ link, service: { ...closed, archive } })).toEqual({ href: archive.url, kind: "archive" });
  });
  test("a check date does not stand in for a closure date", () => {
    expect(serviceSchema.parse(closed).closedAt).toBeUndefined();
    expect(serviceSchema.safeParse({ ...closed, closedAt: "2020-01-01" }).success).toBe(false);
    expect(serviceSchema.safeParse({ ...closed, closedAt: "2020-01-01", closureSource: link }).success).toBe(true);
  });
  test("official succession requires a source; an alternative is a distinct relation", () => {
    const schema = resourceRelationSchema(z.string());
    const relation = { resource: "example", note: { en: "Similar text coverage" } };
    expect(schema.safeParse({ ...relation, kind: "alternative" }).success).toBe(true);
    expect(schema.safeParse({ ...relation, kind: "official-successor" }).success).toBe(false);
    expect(schema.safeParse({ ...relation, kind: "official-successor", source: link }).success).toBe(true);
  });
});
