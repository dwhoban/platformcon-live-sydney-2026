import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { labZip } from "./integrations/lab-zip";
import { pagefindIndex } from "./integrations/pagefind";

export default defineConfig({
  // Emits /00-setup.html, which the Worker's default `auto-trailing-slash`
  // asset handling serves at /00-setup.
  build: { format: "file" },
  trailingSlash: "never",
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [
    react(),
    mdx(),
    labZip({ source: "../lab", output: "downloads/lab.zip" }),
    pagefindIndex(),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "vesper" },
      defaultColor: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
