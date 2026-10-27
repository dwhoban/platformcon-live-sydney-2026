import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { type Zippable, zipSync } from "fflate";

// Dependencies, local state, Git history and anything that may hold secrets.
const EXCLUDED_DIRS = new Set([".git", ".terraform", ".wrangler", "node_modules"]);
const EXCLUDED_FILES = [
  /^\.DS_Store$/,
  /^\.dev\.vars/,
  /^\.env/,
  /\.tfstate/,
  /\.tfvars(\.json)?$/,
];

interface LabZipOptions {
  /** Folder to zip, relative to the project root. */
  source: string;
  /** Where to write the ZIP, relative to `public/`. */
  output: string;
}

function collect(dir: string): Zippable {
  const tree: Zippable = {};
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        tree[entry.name] = collect(join(dir, entry.name));
      }
    } else if (entry.isFile() && !EXCLUDED_FILES.some((pattern) => pattern.test(entry.name))) {
      tree[entry.name] = readFileSync(join(dir, entry.name));
    }
  }
  return tree;
}

/** Zips the lab folder into `public/` so the guide can serve it as a download. */
export function labZip({ source, output }: LabZipOptions): AstroIntegration {
  return {
    name: "guide:lab-zip",
    hooks: {
      "astro:config:setup": ({ command, config, logger }) => {
        if (command !== "dev" && command !== "build") return;

        const sourceDir = fileURLToPath(new URL(source, config.root));
        const outFile = fileURLToPath(new URL(output, config.publicDir));
        const zip = zipSync({ [basename(sourceDir)]: collect(sourceDir) }, { level: 9 });

        mkdirSync(dirname(outFile), { recursive: true });
        writeFileSync(outFile, zip);
        logger.info(`Wrote public/${output} (${Math.round(zip.byteLength / 1024)} KB)`);
      },
    },
  };
}
