import { getCollection, getEntry, type CollectionEntry } from "astro:content";

type Resource = CollectionEntry<"resources">;
type Tool = CollectionEntry<"tools">;

async function getAuthor(id: string): Promise<Author> {
  const entry = await getEntry("organizations", id);
  if (!entry) throw new Error(`Unknown organization: ${id}`);
  const { name, abbr, link, location } = entry.data;
  return { name, abbr: abbr ?? name, link, location };
}

async function toCorpus(entry: Resource): Promise<Corpus> {
  const { langs, name, abbr, organization, link, modality, period, tags } =
    entry.data;
  return {
    id: entry.id,
    lang: langs[0]!,
    name,
    abbr: abbr ?? name,
    author: await getAuthor(organization.id),
    link,
    tags: [...(modality ? [modality] : []), ...(period ?? []), ...tags],
  };
}

async function toConcordancer(entry: Tool): Promise<Concordancer> {
  const { langs, name, abbr, organization, link, access, serves } = entry.data;
  return {
    id: entry.id,
    lang: langs[0]!,
    name,
    abbr: abbr ?? name,
    author: await getAuthor(organization.id),
    link,
    usage: {
      online: access.delivery === "web",
      free: access.cost !== "paid",
      freemium: access.cost === "freemium",
      registration: access.registration !== "none",
      application: access.registration === "application",
    },
    corpora: await Promise.all(
      serves.map(async ({ id }) => {
        const resource = await getEntry("resources", id);
        if (!resource) throw new Error(`Unknown resource: ${id}`);
        return toCorpus(resource);
      }),
    ),
  };
}

const corpusEntries = async () =>
  (await getCollection("resources")).filter((r) => r.data.kind === "corpus");
const concordancerEntries = async () =>
  (await getCollection("tools")).filter((t) => t.data.kind === "concordancer");

async function concordancerIdsOf(corpusId: string): Promise<string[]> {
  return (await concordancerEntries())
    .filter((c) => c.data.serves.some(({ id }) => id === corpusId))
    .map((c) => c.id);
}

export async function getConcordancers(
  limit: number | undefined = undefined,
): Promise<Concordancer[]> {
  const entries = (await concordancerEntries()).slice(0, limit);
  return Promise.all(entries.map(toConcordancer));
}

export async function getCorpora(
  limit: number | undefined = undefined,
): Promise<(Corpus & { concordancerIds: string[] })[]> {
  const entries = (await corpusEntries()).slice(0, limit);
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
  const entry = await getEntry("resources", id);
  if (!entry || entry.data.kind !== "corpus") return null;
  return {
    ...(await toCorpus(entry)),
    concordancerIds: await concordancerIdsOf(id),
  };
}

export async function getConcordancer(id: string): Promise<Concordancer | null> {
  const entry = await getEntry("tools", id);
  return entry && entry.data.kind === "concordancer"
    ? toConcordancer(entry)
    : null;
}
