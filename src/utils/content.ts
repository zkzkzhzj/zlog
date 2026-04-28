import type { CollectionEntry } from "astro:content";

function stripIndex(id: string) {
  return id.replace(/\/index$/, "");
}

export function getContentPath(id: string) {
  return stripIndex(id);
}

export function getBlogSlug(id: string) {
  const contentPath = getContentPath(id);
  return contentPath.startsWith("general/")
    ? contentPath.slice("general/".length)
    : contentPath;
}

export function getRetroSlug(id: string) {
  const contentPath = getContentPath(id);
  return contentPath.startsWith("retro/")
    ? contentPath.slice("retro/".length)
    : contentPath;
}

export function getPostPermalink(post: CollectionEntry<"blog">) {
  return post.data.retro
    ? `/retro/${getRetroSlug(post.id)}/`
    : `/blog/${getBlogSlug(post.id)}/`;
}
