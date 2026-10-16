import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Organization = CollectionEntry<"organizations">;
export type Resource = CollectionEntry<"resources">;
export type Tool = CollectionEntry<"tools">;

export type ResolvedResource = Resource & {
  organization: Organization;
  tools: Tool[];
};

export type ResolvedTool = Tool & {
  organization: Organization;
  resources: Resource[];
};

/** URL segment ↔ catalog kind. Every category is a filtered view of one collection. */
export const CATEGORIES = {
  corpora: { collection: "resources", kind: "corpus" },
  datasets: { collection: "resources", kind: "dataset" },
  dictionaries: { collection: "resources", kind: "dictionary" },
  archives: { collection: "resources", kind: "text-archive" },
  concordancers: { collection: "tools", kind: "concordancer" },
} as const;

export type Category = keyof typeof CATEGORIES;

async function mustGetOrganization(id: string): Promise<Organization> {
  const org = await getEntry("organizations", id);
  if (!org) throw new Error(`Dangling organization reference: ${id}`);
  return org;
}

export async function resolveResource(
  resource: Resource,
): Promise<ResolvedResource> {
  const organization = await mustGetOrganization(resource.data.organization.id);
  const tools = (await getCollection("tools")).filter((t) =>
    t.data.serves.some((ref) => ref.id === resource.id),
  );
  return { ...resource, organization, tools };
}

export async function resolveTool(tool: Tool): Promise<ResolvedTool> {
  const organization = await mustGetOrganization(tool.data.organization.id);
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

export async function getResourcesByKind(
  kind: Resource["data"]["kind"],
): Promise<ResolvedResource[]> {
  const entries = (await getCollection("resources")).filter(
    (r) => r.data.kind === kind,
  );
  return Promise.all(entries.map(resolveResource));
}

export async function getToolsByKind(
  kind: Tool["data"]["kind"],
): Promise<ResolvedTool[]> {
  const entries = (await getCollection("tools")).filter(
    (t) => t.data.kind === kind,
  );
  return Promise.all(entries.map(resolveTool));
}
