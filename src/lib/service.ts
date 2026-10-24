import { z } from "astro/zod";

const localized = z.record(z.string(), z.string());
export const serviceSchema = z.object({
  status: z.literal("closed"),
  checkedAt: z.iso.date(),
  closedAt: z.iso.date().optional(),
  closureSource: z.url().optional(),
  archive: z.object({ url: z.url(), capturedAt: z.iso.date() }).optional(),
  note: localized,
}).refine(value => !value.closedAt || !!value.closureSource, {
  message: "A closure date requires a dated source",
  path: ["closureSource"],
});

export function resourceRelationSchema<T extends z.ZodType>(resource: T) {
  return z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("alternative"), resource, note: localized, source: z.url().optional() }),
    z.object({ kind: z.literal("official-successor"), resource, note: localized, source: z.url() }),
  ]);
}

export type Service = z.infer<typeof serviceSchema>;

/** Closed services must never advertise the original URL as a working visit. */
export function externalAction(data: { link: string; service?: Service }):
  { href: string; kind: "visit" | "archive" } | undefined {
  if (!data.service) return { href: data.link, kind: "visit" };
  if (data.service.archive) return { href: data.service.archive.url, kind: "archive" };
  return undefined;
}
