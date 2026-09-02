import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const repositoryRoot = path.resolve(siteDirectory, "..");
const outputPath = path.join(siteDirectory, "public", "search-index.json");
const siteBase = `/${process.env.SITE_BASE ?? ''}`.replace(/\/+/g, '/').replace(/\/+$/, '');

const skippedDirectories = new Set([
  ".git",
  ".github",
  ".makemd",
  ".obsidian",
  ".space",
  ".trash",
  "AI 指令",
  "node_modules",
  "site",
  "文本附件",
]);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
  return match?.[1] ?? "";
}

function getYamlScalar(frontmatter, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = frontmatter.match(new RegExp(`^${escapedKey}:[ \\t]*(.+?)[ \\t]*$`, "im"));
  if (!m) return undefined;
  return m[1].trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, (_, d, s) => d ?? s);
}

function toPosix(value) {
  return value.replace(/\\/g, "/").normalize("NFC");
}

function normalizeLabel(value) {
  const normalized = value
    .normalize("NFKC")
    .replace(/\p{Cf}/gu, "")
    .toLocaleLowerCase("zh-CN")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return Array.from(normalized || "item").slice(0, 64).join("");
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (const character of value.normalize("NFC")) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableId(label, sourcePath) {
  return `${normalizeLabel(label)}--${fnv1a(sourcePath.replace(/\\/g, "/"))}`;
}

function fileTitle(filePath) {
  return path.posix.basename(filePath, path.posix.extname(filePath)).trim();
}

const index = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || skippedDirectories.has(entry.name)) continue;
      await walk(fullPath);
      continue;
    }
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md") continue;

    const relativePath = toPosix(path.relative(repositoryRoot, fullPath));
    if (relativePath === "README.md" || relativePath === "微信读书/微信读书Gallery.md") continue;

    const raw = await readFile(fullPath, "utf8");
    const fm = parseFrontmatter(raw);
    const isDraft = /^draft:[ \t]*(?:true|'true'|"true")[ \t]*$/im.test(fm);
    if (isDraft) continue;

    const title = getYamlScalar(fm, "title") ?? fileTitle(relativePath);
    const pathParts = relativePath.split("/");
    const collection = pathParts[0] || "未分类";
    const id = stableId(title, relativePath);
    const url = `${siteBase}/notes/${encodeURIComponent(id)}/`;

    index.push({ title, collection, url });
  }
}

await walk(repositoryRoot);

index.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(index), "utf8");

console.log(`搜索索引已生成：${index.length} 篇文章。`);
