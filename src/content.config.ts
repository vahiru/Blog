import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const safeImageSchema = z.string().max(2048).refine((value) => {
  if (value.startsWith("/")) return !value.startsWith("//");

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}, "Images must use a site-relative path or an HTTPS URL");

const blogCollection = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string().min(1).max(160),
    date: z.coerce.date(),
    cover: safeImageSchema.optional(),
    description: z.string().max(500).optional(),
    tags: z.array(z.string().min(1).max(64)).max(30).optional(),
    categories: z.array(z.string().min(1).max(64)).max(20).optional(),
    draft: z.boolean().default(false),
    pinned: z.boolean().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
