import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Organization = CollectionEntry<"organizations">;
export type Resource = CollectionEntry<"resources">;
export type Tool = CollectionEntry<"tools">;

export type ResolvedResource = Resource & {
  organization: Organization | undefined;
  tools: Tool[];
};

export type ResolvedTool = Tool & {
  organization: Organization | undefined;
  resources: Resource[];
};

/** URL segment ↔ catalog kinds. Every category is a filtered view of one collection. */
export const CATEGORIES = {
  corpora: { collection: "resources", kinds: ["corpus"] },
  datasets: { collection: "resources", kinds: ["dataset"] },
  dictionaries: { collection: "resources", kinds: ["dictionary"] },
  archives: { collection: "resources", kinds: ["text-archive"] },
  concordancers: { collection: "tools", kinds: ["concordancer"] },
  tools: { collection: "tools", kinds: ["converter", "analyzer"] },
} as const;

export type Category = keyof typeof CATEGORIES;

async function getOrganization(
  id: string | undefined,
): Promise<Organization | undefined> {
  if (!id) return undefined;
  const org = await getEntry("organizations", id);
  if (!org) throw new Error(`Dangling organization reference: ${id}`);
  return org;
}

export async function resolveResource(
  resource: Resource,
): Promise<ResolvedResource> {
  const organization = await getOrganization(resource.data.organization?.id);
  const tools = (await getCollection("tools")).filter((t) =>
    t.data.serves.some((ref) => ref.id === resource.id),
  );
  return { ...resource, organization, tools };
}

export async function resolveTool(tool: Tool): Promise<ResolvedTool> {
  const organization = await getOrganization(tool.data.organization?.id);
  const resources = await Promise.all(
    tool.data.serves.map(async (ref) => {
      const entry = await getEntry("resources", ref.id);
      if (!entry)
        throw new Error(
          `Dangling resource reference in tool ${tool.id}: ${ref.id}`,
        );
      return entry;
    }),
  );
  return { ...tool, organization, resources };
}

export async function getResourcesByKinds(
  kinds: readonly Resource["data"]["kind"][],
): Promise<ResolvedResource[]> {
  const entries = (await getCollection("resources")).filter((r) =>
    kinds.includes(r.data.kind),
  );
  return Promise.all(entries.map(resolveResource));
}

export async function getToolsByKinds(
  kinds: readonly Tool["data"]["kind"][],
): Promise<ResolvedTool[]> {
  const entries = (await getCollection("tools")).filter((t) =>
    kinds.includes(t.data.kind),
  );
  return Promise.all(entries.map(resolveTool));
}
