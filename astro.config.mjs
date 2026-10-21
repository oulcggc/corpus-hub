import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import paraglide from "@inlang/paraglide-astro";
import icon from "astro-icon";
// import Icons from "unplugin-icons";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "ja", "zh"],
    defaultLocale: "en"
  },
  integrations: [tailwind(), paraglide({
    project: "./project.inlang",
    outdir: "./src/paraglide"
  }), icon(), mdx()]
  // vite: {
  //   plugins: [Icons({ compiler: "svelte" })],
  // },
});