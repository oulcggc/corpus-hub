import {
  db,
  Authors,
  Concordancers,
  ConcordancerCorpora,
  Corpora,
  Tags,
  CorporaTags,
} from "astro:db";

import { AUTHORS, CONCORDANCERS, CORPORA } from "./dummy";
// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Authors).values(
    Object.entries(AUTHORS).map(([id, { name, abbr, link, location }]) => ({
      id,
      name,
      abbr,
      link,
      location,
    })),
  );
  console.log("Authors:", await db.select().from(Authors).all());

  await db.insert(Concordancers).values(
    Object.entries(CONCORDANCERS).map(
      ([
        id,
        {
          lang,
          name,
          abbr,
          authorId,
          link,
          usage: { online, free, freemium, registration, application },
        },
      ]) => ({
        id,
        lang,
        name,
        abbr,
        authorId,
        link,
        usageOnline: online,
        usageFree: free,
        usageFreemium: freemium,
        usageRegistration: registration,
        usageApplication: application,
      }),
    ),
  );
  console.log("Concordancers:", await db.select().from(Concordancers).all());

  await db.insert(Corpora).values(
    Object.entries(CORPORA).map(
      ([id, { lang, name, authorId, abbr, link }]) => ({
        id,
        lang,
        name,
        authorId,
        abbr,
        link,
      }),
    ),
  );
  console.log("Corpora:", await db.select().from(Corpora).all());

  await db.insert(Tags).values(
    [
      ...new Set(
        Object.values(CORPORA)
          .map(({ tags }) => tags)
          .flat(),
      ),
    ].map((tag) => ({ id: tag })),
  );
  console.log("Tags:", await db.select().from(Tags).all());

  for (const [id, { tags }] of Object.entries(CORPORA)) {
    await db.insert(CorporaTags).values(
      tags.map((tag) => ({
        corporaId: id,
        tag,
      })),
    );
  }
  console.log(await db.select().from(CorporaTags).all());

  for (const [id, { corpora }] of Object.entries(CONCORDANCERS)) {
    await db.insert(ConcordancerCorpora).values(
      corpora.map((corporaId) => ({
        concordancerId: id,
        corporaId,
      })),
    );
  }
}
