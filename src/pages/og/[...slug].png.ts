import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const fontPath = path.resolve("src/assets/fonts/Pretendard-Regular.woff");
const fontData = fs.readFileSync(fontPath);

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title } = props;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#111827",
          color: "#f9fafb",
          padding: "60px",
          fontFamily: "Pretendard",
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: 60, fontWeight: 700, textAlign: "center" },
              children: title,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: 30, marginTop: 20, color: "#9ca3af" },
              children: "zlog",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Pretendard",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
