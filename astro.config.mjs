import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import paraglide from "@inlang/paraglide-astro";
import cloudflare from "@astrojs/cloudflare";
import icon from "astro-icon";
// import Icons from "unplugin-icons";
import svelte from "@astrojs/svelte";
import db from "@astrojs/db";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "ja", "zh", "fr"],
    defaultLocale: "en"
  },
  integrations: [tailwind(), paraglide({
    project: "./project.inlang",
    outdir: "./src/paraglide"
  }), icon(), svelte(), db(), mdx()],
  output: "server",
  adapter: cloudflare()
  // vite: {
  //   plugins: [Icons({ compiler: "svelte" })],
  // },
});