function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** Keep checking archived pages and relation sources for a closed service. */
export function linkCheckText(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("A catalog YAML document must be an object");
  }
  const entry = value as Record<string, unknown>;
  const service = entry.service as { status?: string } | undefined;
  return Object.entries(entry)
    .filter(([key]) => !(key === "link" && service?.status === "closed"))
    .flatMap(([, value]) => strings(value))
    .join("\n");
}

if (import.meta.main) {
  const paths = process.argv.slice(2);
  const files = paths.length ? paths : [...new Bun.Glob("src/content/**/*.yaml").scanSync()].sort();
  for (const path of files) {
    const data = Bun.YAML.parse(await Bun.file(path).text());
    console.log(linkCheckText(data));
  }
}
