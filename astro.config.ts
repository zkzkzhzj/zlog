import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { remarkSeparator } from "./src/plugins/remark-separator";
import rehypeSlug from "rehype-slug";

import rehypeExternalLinks from "rehype-external-links";
import {
  transformerNotationHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers";

export default defineConfig({
  site: "https://zlog.page",
  integrations: [mdx(), react(), sitemap()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkGfm, remarkSeparator],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
    shikiConfig: {
      theme: "github-dark",
      transformers: [transformerNotationHighlight(), transformerNotationDiff()],
    },
  },
});
