import { defineConfig } from "astro/config";
import icon from "astro-icon";

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

// https://astro.build/config
export default defineConfig({
  site: "https://corpora.oulcggc.org",
  integrations: [icon(), mdx()],
  vite: {
    plugins: [
      tailwindcss(),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["baseLocale"],
      }),
    ],
  },
});