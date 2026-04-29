---
name: english-blog-post
description: Use this skill when creating or updating English-learning blog posts in this zlog project, especially for requests like "오늘의 영어 파일 만들어줘" and when maintaining the English template, difficulty progression, and anti-duplication wiki.
---

# English Blog Post

Use this skill for the project's English-learning blog workflow.

## When To Use

- The user wants a new English study post scaffold.
- The user asks for today's English file.
- The user wants to update the English learning template or wiki.
- The user wants help keeping English posts consistent in format, difficulty, and repetition control.

## Workflow

1. Read `data/english-wiki.md` first.
2. Prefer `node scripts/create-english-daily-post.mjs` to create today's scaffold with an automatically recommended sentence.
3. If the user wants a deeper grammar-style breakdown, use `node scripts/create-english-daily-post.mjs --deep` or `pnpm english:today:deep`.
4. The output file should live at `src/content/blog/english/YYYY-MM-DD/index.mdx`.
5. Keep frontmatter aligned with the project schema:
   - `category: "english"`
   - `draft: true` by default unless the user clearly wants publication-ready output
6. Preserve the template structure in `templates/english-daily-post.mdx`.
7. After finalizing an English post, update `data/english-wiki.md` so the next post can avoid repetition.

## Difficulty Rules

- Avoid trivial beginner sentences.
- Target roughly TOEIC 500 to 900 progression.
- Favor at least one meaningful learning point in each sentence.
- Avoid reusing the same expression within 14 days when possible.
- Avoid reusing the same grammar point within 7 days when possible.
- Avoid reusing the same exact sentence within 30 days.

## Files

- `data/english-wiki.md`
- `templates/english-daily-post.mdx`
- `data/english-sentence-bank.json`
- `scripts/create-english-daily-post.mjs`

## Notes

- The wiki is Markdown on purpose so it stays easy to read and edit.
- If later automation needs stronger structure, add a separate machine-readable index instead of replacing the Markdown wiki.
- Deep mode should prefer curated sentence-bank notes when available and fall back to a lighter default breakdown otherwise.
