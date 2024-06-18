import {
  db,
  eq,
  Concordancers,
  ConcordancerCorpora,
  Corpora,
  Authors,
  CorporaTags,
  alias,
} from "astro:db";
type Database = typeof db;

export async function getConcordancers(
  db: Database,
  limit: number | undefined = undefined,
): Promise<Concordancer[]> {
  const selected = db.select().from(Concordancers);
  const limited = limit !== undefined ? selected.limit(limit) : selected;
  const rows = await limited
    .innerJoin(Authors, eq(Concordancers.authorId, Authors.id))
    .leftJoin(
      ConcordancerCorpora,
      eq(Concordancers.id, ConcordancerCorpora.concordancerId),
    )
    .leftJoin(Corpora, eq(ConcordancerCorpora.corporaId, Corpora.id))
    .leftJoin(
      alias(Authors, "CorporaAuthors"),
      eq(Corpora.authorId, Authors.id),
    )
    .leftJoin(CorporaTags, eq(Corpora.id, CorporaTags.corporaId))
    .all();

  console.log(rows);

  const concordancersMap = new Map<string, Concordancer>();

  rows.forEach((row) => {
    const {
      Concordancers: c,
      Authors: ca,
      Corpora: p,
      CorporaAuthors: pa,
      CorporaTags: pt,
    } = row;

    if (!concordancersMap.has(c.id)) {
      concordancersMap.set(c.id, {
        id: c.id,
        lang: c.lang,
        name: c.name as LocalizedString,
        abbr: c.abbr as LocalizedString,
        author: {
          name: ca.name as LocalizedString,
          link: ca.link,
          abbr: ca.abbr as LocalizedString,
          location: ca.location,
        },
        link: c.link,
        usage: {
          online: c.usageOnline,
          free: c.usageFree,
          freemium: c.usageFreemium,
          registration: c.usageRegistration,
          application: c.usageApplication,
        },
        corpora: [] as Corpus[],
      });
    }

    if (p && ca && pa) {
      if (!concordancersMap.get(c.id)!.corpora.some((x) => x.id === p.id)) {
        concordancersMap.get(c.id)!.corpora.push({
          id: p.id,
          lang: p.lang,
          name: p.name as LocalizedString,
          abbr: p.abbr as LocalizedString,
          author: {
            name: pa.name as LocalizedString,
            link: pa.link,
            abbr: pa.abbr as LocalizedString,
            location: pa.location,
          },
          link: p.link,
          tags: [],
        });
      }

      if (pt) {
        concordancersMap
          .get(c.id)!
          .corpora.find((x) => x.id === p.id)!
          .tags.push(pt.tag as string);
      }

      // const concordancer = concordancersMap.get(c.id)!;
      // if (!concordancer.corpora.includes(p.id)) {
      //   concordancersMap.get(c.id)!.corpora.push(p.id);
      //   concordancer.corpora.push(p.id);
      // }
      // concordancersMap.get(Concordancers.id)!.corpora.push(Corpora.name);
    }
  });

  return Array.from(concordancersMap.values());
  // type of rows is = const rows: {
  //     Concordancers: {
  //         id: string;
  //         lang: string;
  //         name: unknown;
  //         authorId: string;
  //         link: string;
  //         usageOnline: boolean;
  //         usageFree: boolean;
  //         usageFreemium: boolean;
  //         usageRegistration: boolean;
  //         usageApplication: boolean;
  //     };
  //     Authors: {
  //         id: string;
  //         name: unknown;
  //         link: string;
  //         abbr: unknown;
  //         location: string;
  //     };
  //     ConcordancerCorpora: {
  //         id: string;
  //         lang: string;
  //         name: unknown;
  //         authorId: string;
  //         link: string;
  //         abbr: unknown;
  //     } | null;
  //     Corpora: {
  //         ...;
  //     } | null;
  // }[]

  // Continue here...
}

export async function getCorpora(
  db: Database,
  limit: number | undefined = undefined,
): Promise<
  (Corpus & {
    concordancerIds: string[];
  })[]
> {
  const selected = db.select().from(Corpora);
  const limited = limit !== undefined ? selected.limit(limit) : selected;
  const rows = await limited
    .innerJoin(Authors, eq(Corpora.authorId, Authors.id))
    /* Also join Concordancers.corpora -> Copora.concordancers */
    .leftJoin(
      ConcordancerCorpora,
      eq(Corpora.id, ConcordancerCorpora.corporaId),
    )
    .leftJoin(CorporaTags, eq(Corpora.id, CorporaTags.corporaId))
    .all();

  const corporaMap = new Map<string, Corpus & { concordancerIds: string[] }>();

  for (const row of rows) {
    const {
      Corpora: c,
      Authors: a,
      ConcordancerCorpora: cc,
      CorporaTags: ct,
    } = row;

    if (!corporaMap.has(c.id)) {
      corporaMap.set(c.id, {
        id: c.id,
        lang: c.lang,
        name: c.name as LocalizedString,
        abbr: c.abbr as LocalizedString,
        author: {
          name: a.name as LocalizedString,
          link: a.link,
          abbr: a.abbr as LocalizedString,
          location: a.location,
        },
        link: c.link,
        tags: [],
        concordancerIds: [],
      });

      if (cc) {
        corporaMap.get(c.id)!.concordancerIds.push(cc.concordancerId);
      }

      if (ct) {
        corporaMap.get(c.id)!.tags.push(ct.tag as string);
      }
    }
  }

  return Array.from(corporaMap.values());
}

export async function getCorpus(
  db: Database,
  id: string,
): Promise<(Corpus & { concordancerIds: string[] }) | null> {
  const rows = await db
    .select()
    .from(Corpora)
    .where(eq(Corpora.id, id))
    .innerJoin(Authors, eq(Corpora.authorId, Authors.id))
    .leftJoin(
      ConcordancerCorpora,
      eq(Corpora.id, ConcordancerCorpora.corporaId),
    )
    .leftJoin(CorporaTags, eq(Corpora.id, CorporaTags.corporaId))
    .all();

  let corpus: (Corpus & { concordancerIds: string[] }) | null = null;

  for (const row of rows) {
    const {
      Corpora: c,
      Authors: a,
      ConcordancerCorpora: cc,
      CorporaTags: ct,
    } = row;

    if (!corpus) {
      corpus = {
        id: c.id,
        lang: c.lang,
        name: c.name as LocalizedString,
        abbr: c.abbr as LocalizedString,
        author: {
          name: a.name as LocalizedString,
          link: a.link,
          abbr: a.abbr as LocalizedString,
          location: a.location,
        },
        link: c.link,
        tags: [],
        concordancerIds: [],
      };
    }

    if (cc) {
      corpus.concordancerIds.push(cc.concordancerId);
    }

    if (ct) {
      corpus.tags.push(ct.tag as string);
    }
  }

  return corpus;
}

export async function getConcordancer(
  db: Database,
  id: string,
): Promise<Concordancer | null> {
  const rows = await db
    .select()
    .from(Concordancers)
    .where(eq(Concordancers.id, id))
    .innerJoin(Authors, eq(Concordancers.authorId, Authors.id))
    .leftJoin(
      ConcordancerCorpora,
      eq(Concordancers.id, ConcordancerCorpora.concordancerId),
    )
    .leftJoin(Corpora, eq(ConcordancerCorpora.corporaId, Corpora.id))
    .leftJoin(
      alias(Authors, "CorporaAuthors"),
      eq(Corpora.authorId, Authors.id),
    )
    .leftJoin(CorporaTags, eq(Corpora.id, CorporaTags.corporaId))
    .all();

  let concordancer: Concordancer | null = null;

  for (const row of rows) {
    const {
      Concordancers: c,
      Authors: ca,
      Corpora: p,
      CorporaAuthors: pa,
      CorporaTags: pt,
    } = row;

    if (!concordancer) {
      concordancer = {
        id: c.id,
        lang: c.lang,
        name: c.name as LocalizedString,
        abbr: c.abbr as LocalizedString,
        author: {
          name: ca.name as LocalizedString,
          link: ca.link,
          abbr: ca.abbr as LocalizedString,
          location: ca.location,
        },
        link: c.link,
        usage: {
          online: c.usageOnline,
          free: c.usageFree,
          freemium: c.usageFreemium,
          registration: c.usageRegistration,
          application: c.usageApplication,
        },
        corpora: [] as Corpus[],
      };
    }

    if (p && pa) {
      if (!concordancer.corpora.some((x) => x.id === p.id)) {
        concordancer.corpora.push({
          id: p.id,
          lang: p.lang,
          name: p.name as LocalizedString,
          abbr: p.abbr as LocalizedString,
          author: {
            name: pa.name as LocalizedString,
            link: pa.link,
            abbr: pa.abbr as LocalizedString,
            location: pa.location,
          },
          link: p.link,
          tags: [],
        });
      }

      if (pt) {
        concordancer.corpora
          .find((x) => x.id === p.id)!
          .tags.push(pt.tag as string);
      }
    }
  }

  return concordancer;
}
// export const AUTHORS: Record<string, Author> = {
//   ninjal: {
//     name: {
//       ja: "国立国語研究所",
//       en: "National Institute for Japanese Language and Linguistics",
//     },
//     abbr: "NINJAL",
//     link: "https://www.ninjal.ac.jp/",
//     location: "Tokyo, Japan",
//   },
// };

// export const CONCORDANCERS: Concordancer[] = [
//   {
//     id: "ja@ninjal/shonagon",
//     lang: "ja",
//     name: {
//       ja: "少納言",
//       en: "Shonagon",
//     },
//     author: AUTHORS.ninjal,
//     link: "https://shonagon.ninjal.ac.jp",
//     usage: {
//       online: true,
//       free: true,
//       freemium: false,
//       registration: false,
//       application: false,
//     },
//     corpora: ["ja@ninjal/bccwj"],
//   },
//   {
//     id: "ja@ninjal/chunagon",
//     lang: "ja",
//     name: {
//       ja: "中納言",
//       en: "Chunagon",
//     },
//     author: AUTHORS.ninjal,
//     link: "https://chunagon.ninjal.ac.jp/",
//     usage: {
//       online: true,
//       free: true,
//       freemium: false,
//       registration: true,
//       application: true,
//     },
//     corpora: ["ja@ninjal/bccwj", "ja@ninjal/chj"],
//   },
//   {
//     id: "ja@ninjal/himawari",
//     lang: "ja",
//     name: {
//       ja: "ひまわり",
//       en: "Himawari",
//     },
//     author: AUTHORS.ninjal,
//     link: "https://csd.ninjal.ac.jp/lrc/index.php",
//     usage: {
//       online: false,
//       free: true,
//       freemium: false,
//       registration: false,
//       application: false,
//     },
//     corpora: [],
//   },
// ];

// export const CORPORA = [
//   {
//     id: "ja@ninjal/bccwj",
//     lang: "ja",
//     tags: ["written", "comtemporary", "japanese"],
//     author: AUTHORS.ninjal,
//     name: {
//       ja: "現代日本語書き言葉均衡コーパス",
//       en: "Balanced Corpus of Contemporary Written Japanese",
//     },
//     abbr: "BCCWJ",
//     link: "https://clrd.ninjal.ac.jp/bccwj/",
//   },
//   {
//     id: "ja@ninjal/chj",
//     lang: "ja",
//     author: AUTHORS.ninjal,
//     tags: [
//       "historical",
//       "diachronic",
//       "japanese",
//       "middle japanese",
//       "old japanese",
//       "classical japanese",
//     ],
//     name: {
//       ja: "日本語歴史コーパス",
//       en: "Corpus of Historical Japanese",
//     },
//     link: "https://clrd.ninjal.ac.jp/chj/index.html",
//   },
// ];
