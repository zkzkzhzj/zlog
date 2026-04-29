import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const args = process.argv.slice(2);

const dateArgIndex = args.findIndex((arg) => arg === "--date");
const date =
  dateArgIndex >= 0 && args[dateArgIndex + 1]
    ? args[dateArgIndex + 1]
    : new Date().toISOString().slice(0, 10);

const force = args.includes("--force");
const deepMode = args.includes("--deep");

const templatePath = path.join(cwd, "templates", "english-daily-post.mdx");
const wikiPath = path.join(cwd, "data", "english-wiki.md");
const sentenceBankPath = path.join(cwd, "data", "english-sentence-bank.json");
const outputDir = path.join(cwd, "src", "content", "blog", "english", date);
const outputPath = path.join(outputDir, "index.mdx");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function extractSectionItems(wikiContent, sectionName) {
  const lines = wikiContent.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === sectionName);
  if (start < 0) return [];

  const items = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith("## ")) break;
    if (line.trim().startsWith("- ")) {
      items.push(line.trim().slice(2));
    }
  }

  return items;
}

function extractRecentGuardrails(wikiContent) {
  const sections = [
    "## Recent Posts",
    "## Recent Expressions",
    "## Recent Grammar Points",
  ];
  const collected = sections.flatMap((section) =>
    extractSectionItems(wikiContent, section).map((item) => `- ${item}`),
  );

  if (collected.length === 0) {
    return "- No previous entries found.";
  }

  return collected.slice(0, 10).join("\n");
}

function parseRecentPosts(wikiContent) {
  return extractSectionItems(wikiContent, "## Recent Posts").map((item) => {
    const dateMatch = item.match(/`(\d{4}-\d{2}-\d{2})`/);
    const levelMatch = item.match(/level:\s*`?(\d+)`?/);
    const sentenceMatch = item.match(/sentence:\s*`([^`]+)`/);
    const expressionsMatch = item.match(/expressions:\s*`([^`]+)`/);
    const grammarMatch = item.match(/grammar:\s*`([^`]+)`/);

    return {
      date: dateMatch?.[1] ?? null,
      level: levelMatch ? Number(levelMatch[1]) : null,
      sentence: sentenceMatch?.[1] ?? null,
      expressions: expressionsMatch?.[1]
        ? expressionsMatch[1].split(/\s*;\s*/).filter(Boolean)
        : [],
      grammarPoints: grammarMatch?.[1]
        ? grammarMatch[1].split(/\s*;\s*/).filter(Boolean)
        : [],
    };
  });
}

function daysBetween(a, b) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs(a.getTime() - b.getTime()) / oneDay);
}

function normalizeKey(value) {
  return value.toLowerCase().trim();
}

function chooseSentence(bank, recentPosts, currentDate) {
  const current = new Date(`${currentDate}T00:00:00`);
  const recentLevels = recentPosts
    .map((post) => post.level)
    .filter((level) => typeof level === "number");
  const targetLevel =
    recentLevels.length > 0
      ? Math.min(900, Math.max(...recentLevels) + 40)
      : 600;

  const recentSentenceSet = new Set();
  const recentExpressionSet = new Set();
  const recentGrammarSet = new Set();

  for (const post of recentPosts) {
    if (!post.date) continue;
    const postDate = new Date(`${post.date}T00:00:00`);
    const diffDays = daysBetween(current, postDate);

    if (post.sentence && diffDays <= 30) {
      recentSentenceSet.add(normalizeKey(post.sentence));
    }
    if (diffDays <= 14) {
      post.expressions.forEach((expression) =>
        recentExpressionSet.add(normalizeKey(expression)),
      );
    }
    if (diffDays <= 7) {
      post.grammarPoints.forEach((point) =>
        recentGrammarSet.add(normalizeKey(point)),
      );
    }
  }

  const eligible = bank.filter((entry) => {
    if (recentSentenceSet.has(normalizeKey(entry.sentence))) return false;
    if (
      entry.expressions.some((expression) =>
        recentExpressionSet.has(normalizeKey(expression)),
      )
    ) {
      return false;
    }
    if (
      entry.grammarPoints.some((point) =>
        recentGrammarSet.has(normalizeKey(point)),
      )
    ) {
      return false;
    }

    return true;
  });

  const pool = eligible.length > 0 ? eligible : bank;

  return [...pool].sort((a, b) => {
    const levelGapA = Math.abs(a.level - targetLevel);
    const levelGapB = Math.abs(b.level - targetLevel);
    return levelGapA - levelGapB;
  })[0];
}

function fillTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (content, [key, value]) => content.replaceAll(`{{${key}}}`, value),
    template,
  );
}

function buildFallbackDeepDive(entry) {
  const firstExpression = entry.expressions[0] ?? "핵심 표현";
  const firstGrammarPoint = entry.grammarPoints[0] ?? "문법 포인트";

  return [
    "## Deep Dive",
    "",
    "### 문장 구조",
    `- 이 문장은 핵심 표현 \`${firstExpression}\`를 중심으로 정보를 전달합니다.`,
    `- 문장 전체를 한 덩어리로 외우기보다 \`${firstExpression}\` 앞뒤가 어떻게 붙는지 같이 보는 편이 좋습니다.`,
    "",
    "### 문법 포인트를 더 보면",
    `- 이번 문장의 중심 포인트는 \`${firstGrammarPoint}\`입니다.`,
    `- 같은 문법이라도 이 문장처럼 실제 맥락 안에서 보아야 암기가 아니라 운용으로 넘어갑니다.`,
    "",
    "### 자주 생기는 실수",
    `- 표현 ${entry.expressions.map((expression) => `\`${expression}\``).join(", ")}를 단어 뜻만 이어 붙여 해석하면 자연스러운 뉘앙스를 놓치기 쉽습니다.`,
    "- 원문을 통째로 베끼기보다 주어와 상황만 바꿔서 다시 말해보는 쪽이 더 잘 남습니다.",
  ].join("\n");
}

function buildStructuredDeepDive(entry) {
  if (!entry.deepDive) {
    return buildFallbackDeepDive(entry);
  }

  const sections = ["## Deep Dive", ""];

  if (entry.deepDive.structure?.length) {
    sections.push("### 문장 구조");
    sections.push(...entry.deepDive.structure.map((item) => `- ${item}`));
    sections.push("");
  }

  if (entry.deepDive.grammar?.length) {
    sections.push("### 문법 포인트를 더 보면");
    sections.push(...entry.deepDive.grammar.map((item) => `- ${item}`));
    sections.push("");
  }

  if (entry.deepDive.nuance?.length) {
    sections.push("### 뉘앙스와 쓰임");
    sections.push(...entry.deepDive.nuance.map((item) => `- ${item}`));
    sections.push("");
  }

  if (entry.deepDive.mistakes?.length) {
    sections.push("### 자주 생기는 실수");
    sections.push(...entry.deepDive.mistakes.map((item) => `- ${item}`));
    sections.push("");
  }

  if (entry.deepDive.comparisons?.length) {
    sections.push("### 비슷한 표현과 비교");
    sections.push(...entry.deepDive.comparisons.map((item) => `- ${item}`));
  } else if (sections.at(-1) === "") {
    sections.pop();
  }

  return sections.join("\n");
}

function buildDeepDive(entry, enabled) {
  if (!enabled) {
    return "";
  }

  return buildStructuredDeepDive(entry);
}

if (!fs.existsSync(templatePath)) {
  throw new Error(`Template not found: ${templatePath}`);
}

if (!fs.existsSync(wikiPath)) {
  throw new Error(`Wiki not found: ${wikiPath}`);
}

if (!fs.existsSync(sentenceBankPath)) {
  throw new Error(`Sentence bank not found: ${sentenceBankPath}`);
}

if (fs.existsSync(outputPath) && !force) {
  console.log(`Already exists: ${outputPath}`);
  process.exit(0);
}

const template = readFile(templatePath);
const wiki = readFile(wikiPath);
const sentenceBank = JSON.parse(readFile(sentenceBankPath));
const guardrails = extractRecentGuardrails(wiki);
const recentPosts = parseRecentPosts(wiki);
const selected = chooseSentence(sentenceBank, recentPosts, date);

const content = fillTemplate(template, {
  DATE: date,
  RECENT_GUARDRAILS: guardrails,
  TODAY_SENTENCE: selected.sentence,
  MEANING: selected.meaning,
  EXPRESSIONS: selected.expressions.join(", "),
  GRAMMAR_POINTS: selected.grammarPoints.join(", "),
  WHY_IT_WORKS: selected.why,
  PARAPHRASE: selected.paraphrase,
  DEEP_DIVE: buildDeepDive(selected, deepMode),
  SIMILAR_IDEA_1: selected.similarIdeas[0] ?? "",
  SIMILAR_IDEA_2: selected.similarIdeas[1] ?? "",
  SIMILAR_IDEA_3: selected.similarIdeas[2] ?? "",
});

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, content, "utf8");

console.log(`Created: ${outputPath}`);
console.log(`Recommended sentence: ${selected.sentence}`);
console.log(`Deep mode: ${deepMode ? "enabled" : "disabled"}`);
