import { column, defineDb, defineTable } from "astro:db";

const Authors = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.json(),
    abbr: column.json(),
    // URL
    link: column.text(),
    // Intl.DisplayNames(..., { type: "region" })
    // (ISO 3166-1 2-digit / UN M49 3-digit)
    location: column.text(),
  },
});

const Concordancers = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    lang: column.text(),
    name: column.json(),
    abbr: column.json(),
    authorId: column.text({
      // name: "author_id",
      references: () => Authors.columns.id,
    }),
    link: column.text(),
    usageOnline: column.boolean(),
    usageFree: column.boolean(),
    usageFreemium: column.boolean(),
    usageRegistration: column.boolean(),
    usageApplication: column.boolean(),
  },
});

const Corpora = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    lang: column.text(),
    authorId: column.text(),
    name: column.json(),
    abbr: column.json(),
    link: column.text(),
  },
});

const ConcordancerCorpora = defineTable({
  columns: {
    concordancerId: column.text(),
    corporaId: column.text(),
  },
});

const Tags = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    // name: column.json(),
  },
});

const CorporaTags = defineTable({
  columns: {
    corporaId: column.text(),
    tag: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Authors,
    Concordancers,
    Corpora,
    ConcordancerCorpora,
    CorporaTags,
    Tags,
  },
});
