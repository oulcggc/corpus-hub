import { db, Authors } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  // TODO
  await db.insert(Authors).values([
    {
      id: "JP@ninjal",
      name: {
        ja: "国立国語研究所",
        en: "National Institute for Japanese Language and Linguistics",
      },
      abbr: { ja: "国語研", en: "NINJAL" },
      link: "https://www.ninjal.ac.jp",
      location: "JP",
    },
  ]);
}
