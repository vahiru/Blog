import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImage } from "../../lib/og-image";

export const prerender = true;

const getPostSlug = (entry: CollectionEntry<"blog">) =>
  "slug" in entry && typeof entry.slug === "string"
    ? entry.slug
    : entry.id.replace(/\.(md|mdx)$/i, "");

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: getPostSlug(post) },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as CollectionEntry<"blog">;
  const png = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    date: post.data.date,
    categories: post.data.categories,
    tags: post.data.tags,
  });
  const body = new Uint8Array(png.byteLength);
  body.set(png);

  return new Response(body.buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
