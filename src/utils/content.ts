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

export function getTasteSlug(id: string) {
  const contentPath = getContentPath(id);
  return contentPath.startsWith("taste/")
    ? contentPath.slice("taste/".length)
    : contentPath;
}

export function isPostCategory(
  post: CollectionEntry<"blog">,
  category: CollectionEntry<"blog">["data"]["category"],
) {
  return post.data.category === category;
}

export function getPostPermalink(post: CollectionEntry<"blog">) {
  if (post.data.category === "retro") {
    return `/retro/${getRetroSlug(post.id)}/`;
  }

  if (post.data.category === "movie") {
    return `/taste/${getTasteSlug(post.id)}/`;
  }

  return `/blog/${getBlogSlug(post.id)}/`;
}
