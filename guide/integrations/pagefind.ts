import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import * as pagefind from "pagefind";

/** Builds a Pagefind search index into `dist/pagefind/` after each build. */
export function pagefindIndex(): AstroIntegration {
  return {
    name: "guide:pagefind",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { index, errors } = await pagefind.createIndex();
        if (!index) throw new Error(`Pagefind: ${errors.join("; ")}`);

        try {
          const indexed = await index.addDirectory({ path: outDir });
          if (indexed.errors.length) throw new Error(`Pagefind: ${indexed.errors.join("; ")}`);

          const written = await index.writeFiles({ outputPath: join(outDir, "pagefind") });
          if (written.errors.length) throw new Error(`Pagefind: ${written.errors.join("; ")}`);

          logger.info(`Indexed ${indexed.page_count} pages`);
        } finally {
          await pagefind.close();
        }
      },
    },
  };
}
