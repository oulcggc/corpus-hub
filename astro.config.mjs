import { defineConfig } from "astro/config";
import paraglide from "@inlang/paraglide-astro";
import icon from "astro-icon";

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "ja", "zh"],
    defaultLocale: "en"
  },
  integrations: [paraglide({
    project: "./project.inlang",
    outdir: "./src/paraglide"
  }), icon(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});