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

// https://astro.build/db/config
export default defineDb({
  tables: { Authors },
});
