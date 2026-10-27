import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { groupIds } from "./site.config";

const guide = defineCollection({
  loader: glob({ base: "./src/content/guide", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.enum(groupIds),
    lesson: z.number().int().nonnegative().optional(),
    sidebarLabel: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guide };
