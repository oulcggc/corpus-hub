import { getCollection, getEntry, type CollectionEntry } from "astro:content";

async function getAuthor(id: string): Promise<Author> {
  const entry = await getEntry("authors", id);
  if (!entry) throw new Error(`Unknown author: ${id}`);
  return entry.data;
}

async function toCorpus(entry: CollectionEntry<"corpora">): Promise<Corpus> {
  const { author, ...data } = entry.data;
  return { id: entry.id, ...data, author: await getAuthor(author.id) };
}

async function toConcordancer(
  entry: CollectionEntry<"concordancers">,
): Promise<Concordancer> {
  const { author, corpora, ...data } = entry.data;
  return {
    id: entry.id,
    ...data,
    author: await getAuthor(author.id),
    corpora: await Promise.all(
      corpora.map(async ({ id }) => {
        const corpus = await getEntry("corpora", id);
        if (!corpus) throw new Error(`Unknown corpus: ${id}`);
        return toCorpus(corpus);
      }),
    ),
  };
}

async function concordancerIdsOf(corpusId: string): Promise<string[]> {
  return (await getCollection("concordancers"))
    .filter((c) => c.data.corpora.some(({ id }) => id === corpusId))
    .map((c) => c.id);
}

export async function getConcordancers(
  limit: number | undefined = undefined,
): Promise<Concordancer[]> {
  const entries = (await getCollection("concordancers")).slice(0, limit);
  return Promise.all(entries.map(toConcordancer));
}

export async function getCorpora(
  limit: number | undefined = undefined,
): Promise<(Corpus & { concordancerIds: string[] })[]> {
  const entries = (await getCollection("corpora")).slice(0, limit);
  return Promise.all(
    entries.map(async (entry) => ({
      ...(await toCorpus(entry)),
      concordancerIds: await concordancerIdsOf(entry.id),
    })),
  );
}

export async function getCorpus(
  id: string,
): Promise<(Corpus & { concordancerIds: string[] }) | null> {
  const entry = await getEntry("corpora", id);
  if (!entry) return null;
  return { ...(await toCorpus(entry)), concordancerIds: await concordancerIdsOf(id) };
}

export async function getConcordancer(id: string): Promise<Concordancer | null> {
  const entry = await getEntry("concordancers", id);
  return entry ? toConcordancer(entry) : null;
}
