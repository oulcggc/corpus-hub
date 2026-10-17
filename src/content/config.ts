import { defineCollection, reference, z } from "astro:content";

const localized = z.record(z.string(), z.string());

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: localized,
    abbr: localized,
    link: z.string().url(),
    location: z.string(),
  }),
});

const corpora = defineCollection({
  type: "data",
  schema: z.object({
    lang: z.string(),
    tags: z.array(z.string()),
    author: reference("authors"),
    name: localized,
    abbr: localized,
    link: z.string().url(),
  }),
});

const concordancers = defineCollection({
  type: "data",
  schema: z.object({
    lang: z.string(),
    name: localized,
    abbr: localized,
    author: reference("authors"),
    link: z.string().url(),
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
