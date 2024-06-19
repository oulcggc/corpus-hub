import {
  db,
  Authors,
  Concordancers,
  ConcordancerCorpora,
  Corpora,
  Tags,
  CorporaTags,
} from "astro:db";

/**
 * Represents an author.
 */
type Author = {
  /**
   * The name of the author.
   */
  name: LocalizedString;
  /**
   * The abbreivation of the name.
   */
  abbr: LocalizedString;
  /**
   * The link to the author's website.
   */
  link: string;
  /**
   * The location of the author.
   */
  location: string;
};

/**
 * Represents a concordancer.
 */
type Concordancer = {
  /**
   * The language supported by the concordancer.
   */
  lang: string;
  /**
   * The name of the concordancer.
   */
  name: LocalizedString;
  /**
   * The abbreivation of the name.
   */
  abbr: LocalizedString;
  /**
   * The author of the concordancer.
   */
  authorId: string;
  /**
   * The link to the concordancer's website.
   */
  link: string;
  /**
   * The usage details of the concordancer.
   */
  usage: {
    /**
     * Indicates if the concordancer is available online as a web service.
     */
    online: boolean;
    /**
     * Indicates if the concordancer is free to use or at least has a free tier.
     */
    free: boolean;
    /**
     * Indicates if the concordancer has a freemium model, with free tier but paid upgrades.
     */
    freemium: boolean;
    /**
     * Indicates if registration is required to use the concordancer.
     */
    registration: boolean;
    /**
     * Indicates if human verification is required to use the concordancer.
     */
    application: boolean;
  };
  /**
   * The list of corpora supported by the concordancer.
   */
  corpora: readonly string[];
};

/**
 * Represents a corpus.
 */
type Corpus = {
  /**
   * The language of the corpus.
   */
  lang: string;
  /**
   * The tags of the corpus.
   */
  tags: readonly string[];
  /**
   * The author of the corpus.
   */
  authorId: string;
  /**
   * The name of the corpus.
   */
  name: LocalizedString;
  /**
   * The author of the corpus.
   */
  abbr: LocalizedString;
  /**
   * The link to the corpus's website.
   */
  link: string;
};

export async function seed(
  AUTHORS: Record<string, Author>,
  CONCORDANCERS: Record<string, Concordancer>,
  CORPORA: Record<string, Corpus>,
) {
  const alreadyInsertedAuthors = new Set(
    (await db.select().from(Authors).all()).map(({ id }) => id),
  );
  console.log("Authors:", alreadyInsertedAuthors);
  const authors = Object.entries(AUTHORS)
    .map(([id, { name, abbr, link, location }]) => ({
      id,
      name,
      abbr,
      link,
      location,
    }))
    .filter(({ id }) => !alreadyInsertedAuthors.has(id));
  if (authors.length > 0) {
    await db.insert(Authors).values(authors);
  }
  console.log("Authors:", await db.select().from(Authors).all());

  const alreadyInsertedConcordancers = new Set(
    (await db.select().from(Concordancers).all()).map(({ id }) => id),
  );
  const concordancers = Object.entries(CONCORDANCERS)
    .map(
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
    )
    .filter(({ id }) => !alreadyInsertedConcordancers.has(id));

  if (concordancers.length > 0) {
    await db.insert(Concordancers).values(concordancers);
  }
  console.log("Concordancers:", await db.select().from(Concordancers).all());

  const alreadyInsertedCorpora = new Set(
    (await db.select().from(Corpora).all()).map(({ id }) => id),
  );
  const corpora = Object.entries(CORPORA)
    .map(([id, { lang, name, authorId, abbr, link }]) => ({
      id,
      lang,
      name,
      authorId,
      abbr,
      link,
    }))
    .filter(({ id }) => !alreadyInsertedCorpora.has(id));
  if (corpora.length > 0) {
    await db.insert(Corpora).values(corpora);
  }
  console.log("Corpora:", await db.select().from(Corpora).all());

  const alreadyInsertedTags = new Set(
    (await db.select().from(Tags).all()).map(({ id }) => id),
  );
  const tags = [
    ...new Set(
      Object.values(CORPORA)
        .map(({ tags }) => tags)
        .flat(),
    ),
  ]
    .filter((tag) => !alreadyInsertedTags.has(tag))
    .map((tag) => ({ id: tag }));

  if (tags.length > 0) {
    await db.insert(Tags).values(tags);
  }
  console.log("Tags:", await db.select().from(Tags).all());

  const alreadyInsertedCorporaTags = new Set(
    (await db.select().from(CorporaTags).all()).map(
      ({ corporaId, tag }) => `${corporaId}-${tag}`,
    ),
  );

  for (const [id, { tags }] of Object.entries(CORPORA)) {
    for (const tag of tags) {
      if (!alreadyInsertedCorporaTags.has(`${id}-${tag}`)) {
        await db.insert(CorporaTags).values({ corporaId: id, tag });
      }
    }
  }

  // await db.insert(CorporaTags).values(
  //   tags.map((tag) => ({
  //     corporaId: id,
  //     tag,
  //   })),
  // );
  console.log(await db.select().from(CorporaTags).all());

  const alreadyInsertedConcordancerCorpora = new Set(
    (await db.select().from(ConcordancerCorpora).all()).map(
      ({ concordancerId, corporaId }) => `${concordancerId}-${corporaId}`,
    ),
  );
  const CONCORDANCER_CORPORA = Object.entries(CONCORDANCERS)
    .map(([id, { corpora }]) =>
      corpora.map((corporaId) => ({ concordancerId: id, corporaId })),
    )
    .flat()
    .filter(
      ({ concordancerId, corporaId }) =>
        !alreadyInsertedConcordancerCorpora.has(
          `${concordancerId}-${corporaId}`,
        ),
    );
  console.log("ConcordancerCorpora:", CONCORDANCER_CORPORA);
  await db.insert(ConcordancerCorpora).values(CONCORDANCER_CORPORA);
}
