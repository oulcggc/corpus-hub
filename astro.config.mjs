// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default defineConfig({
  site: "https://corpora.oulcggc.org",
  output: "static",
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
