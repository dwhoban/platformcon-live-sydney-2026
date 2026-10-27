# Workshop guide

Static Astro + MDX site for the workshop, styled with Kumo and served by an assets-only Cloudflare Worker (`wrangler.jsonc` has no `main`). Its structure follows https://connect.void.app/.

## Writing pages

- One MDX file per page in `src/content/guide/`. The filename is the URL (`05-worker.mdx` → `/05-worker`, `index.mdx` → `/`).
- Frontmatter schema: `src/content.config.ts`. `lesson` sets the sidebar's `NN` prefix, the "Lesson NN" label and the sort order. `group` picks the sidebar section (labels and order live in `src/site.config.ts`). `description` also fills the "What you add" column of `<LessonPlan />`. `draft: true` pages appear only in `pnpm dev`.
- Lesson pages use these `##` sections, in order: Goal, Starting point, Steps, Run and verify, Success check, Next lesson. `h2`/`h3` headings drive the "On this page" list and the search results.
- MDX components work without imports. The registry is `src/components/mdx/index.ts`: `<Callout type title>`, `<Details summary open>`, `<LessonPlan />`, plus code fences with a language label and copy button.
- Check styling against `/kit` in `pnpm dev`. `kit.mdx` is a draft page that renders every component.
- Link pages as `/05-worker`, with no `.html` and no trailing slash. Astro writes `05-worker.html`, and the Worker's `auto-trailing-slash` asset handling serves it at that path.

## Gotchas

- Search reads the Pagefind index, which exists only after a build. Test search, 404s and URL handling with `pnpm preview` (a build served by `wrangler dev`).
- `lab/` is zipped into `public/downloads/lab.zip` when `pnpm dev` starts and on every build. Restart dev to pick up lab changes. Exclusions are in `integrations/lab-zip.ts`.
- Callouts opt out of prose styles, so their inner content is styled by the `.callout` rules in `src/styles/global.css`.
- The theme is `data-mode` on `<html>`. `localStorage.theme` stores `light`, `dark` or `system`. The inline script in `BaseLayout.astro` applies it before first paint, and `ThemeToggle.tsx` mirrors that logic.

## UI conventions

- Follow the `kumo-design` skill: 14px body text (`text-base`), sentence-case headings, `font-medium`/`font-semibold`, semantic `kumo-*` tokens (light and dark come from `light-dark()`).
- Import Kumo per component, from `@cloudflare/kumo/components/<name>`.
- Islands: `SiteNav` (`client:load`, which also wraps the page content), `OnThisPage` (`client:idle`) and `Details` (`client:idle`, so closed panels become findable with find-in-page soon after load). Everything else renders to static HTML.

## Deploying

Run `pnpm exec wrangler whoami` and confirm the account with the user before running `pnpm run deploy`. The Worker deploys to workers.dev. The custom-domain route in `wrangler.jsonc` is commented out.
