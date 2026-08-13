import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const keepPathAsId = ({ entry }: { entry: string }) =>
  entry.replace(/\.[^.]+$/, "");

const localized = z.record(z.string(), z.string());

const organizations = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/organizations",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    name: localized,
    abbr: localized.optional(),
    link: z.string().url(),
    location: z.string().length(2),
  }),
});

const resources = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/resources",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    kind: z.enum(["corpus", "dataset", "dictionary", "text-archive"]),
    langs: z.array(z.string()).min(1),
    name: localized,
    abbr: localized.optional(),
    organization: reference("organizations"),
    link: z.string().url(),
    tags: z.array(z.string()).default([]),
    period: z
      .array(
        z.enum([
          "contemporary",
          "modern",
          "early-modern",
          "classical",
          "diachronic",
        ]),
      )
      .optional(),
    modality: z.enum(["written", "spoken", "mixed"]).optional(),
    annotation: z
      .array(z.enum(["tokenized", "pos", "lemma", "parsed", "aligned", "none"]))
      .optional(),
    license: z.string().optional(),
    citation: z.string().optional(),
    size: z
      .object({ amount: z.number(), unit: z.string() })
      .optional(),
  }),
});

const tools = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/tools",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    kind: z.enum(["concordancer", "converter", "analyzer"]),
    langs: z.array(z.string()).min(1),
    name: localized,
    abbr: localized.optional(),
    organization: reference("organizations"),
    link: z.string().url(),
    access: z.object({
      delivery: z.enum(["web", "download"]),
      cost: z.enum(["free", "freemium", "paid"]),
      registration: z.enum(["none", "account", "application"]),
    }),
    serves: z.array(reference("resources")).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/articles",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(["en", "ja", "zh"]),
    description: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    authors: z
      .array(z.object({ name: z.string(), link: z.string().url().optional() }))
      .default([]),
  }),
});

export const collections = { organizations, resources, tools, articles };
