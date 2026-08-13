# CorpusHub | The Corpus of All Corpora

[CorpusHub](https://corpora.oulcggc.org/) is a directory of language resources
for researchers: corpora, concordancers, dictionaries, and datasets, covering
major and minor languages.

## Architecture

- [Astro](https://astro.build/) 7, fully static output. Catalog data lives in
  `src/content/` as YAML entries validated by Zod schemas at build time:
  - `organizations/` — institutions that publish resources
  - `resources/` — things you search in (corpora, datasets, dictionaries)
  - `tools/` — things you search with (concordancers)
  - `articles/` — curated research guides (MDX)
- UI languages: English, Japanese, Chinese ([Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs)
  messages in `messages/`, one `[locale]/` page tree).
- Styling: Tailwind CSS 4.
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`), deployed by
  GitHub Actions on push to `main`.

## Development

```sh
bun install
bun run dev      # local dev server
bun run build    # astro check + static build into dist/
bun run preview  # serve the built site
```

## Adding an entry

Add a YAML file under `src/content/resources/` or `src/content/tools/`
(see existing entries for the fields), or open an
[issue](https://github.com/oulcggc/corpus-hub/issues/new). Entry IDs follow
`<lang>@<org>/<name>`, e.g. `ja@ninjal/bccwj`. A reference to a missing
organization or resource fails the build.

&copy; 2024–2026 [阪大言語サークルGGC](https://oulcggc.org/)
