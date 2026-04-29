# English Blog Workflow

## Primary command

```bash
node scripts/create-english-daily-post.mjs
```

Optional date override:

```bash
node scripts/create-english-daily-post.mjs --date 2026-04-30
```

Optional deep mode:

```bash
node scripts/create-english-daily-post.mjs --deep
```

## Expected output

`src/content/blog/english/YYYY-MM-DD/index.mdx`

## Sentence recommendation

The generator reads:

- `data/english-wiki.md`
- `data/english-sentence-bank.json`

It should prefer a sentence that:

- is not too easy
- does not repeat the same exact sentence too soon
- avoids recently used expressions and grammar points
- stays near the recent difficulty band

## Wiki responsibilities

- recent posts
- repeated expressions
- repeated grammar points
- current difficulty band
- candidate next areas
