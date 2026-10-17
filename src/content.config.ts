import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const keepPathAsId = ({ entry }: { entry: string }) =>
  entry.replace(/\.[^.]+$/, "");

const localized = z.record(z.string(), z.string());

const authors = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/authors",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    name: localized,
    abbr: localized,
    link: z.url(),
    location: z.string(),
  }),
});

const corpora = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/corpora",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    lang: z.string(),
    tags: z.array(z.string()),
    author: reference("authors"),
    name: localized,
    abbr: localized,
    link: z.url(),
  }),
});

const concordancers = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/concordancers",
    generateId: keepPathAsId,
  }),
  schema: z.object({
    lang: z.string(),
    name: localized,
    abbr: localized,
    author: reference("authors"),
    link: z.url(),
    usage: z.object({
      online: z.boolean(),
      free: z.boolean(),
      freemium: z.boolean(),
      registration: z.boolean(),
      application: z.boolean(),
    }),
    corpora: z.array(reference("corpora")),
  }),
});

export const collections = { authors, corpora, concordancers };
