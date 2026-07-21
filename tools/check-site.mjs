#!/usr/bin/env node
/**
 * Pre-deploy checks for the static portfolio.
 * Exit 1 on hard failures.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const REQUIRED = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "apple-touch-icon.png",
  "site.webmanifest",
  "humans.txt",
  ".nojekyll",
  ".well-known/security.txt",
  "privacy/index.html",
  "assets/styles.css",
  "assets/app.js",
  "assets/fonts/fonts.css",
  "assets/media/ivan.jpg",
  "assets/media/ivan.webp",
  "assets/media/og-cover.jpg",
];

const SKIP_DIRS = new Set([".git", "node_modules", ".github", "_site", "tools"]);

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replaceAll("\\", "/");
}

function resolveLocal(fromFile, ref) {
  const clean = ref.split("?")[0].split("#")[0];
  if (!clean) return null;
  if (clean.startsWith("/")) return path.join(ROOT, clean.slice(1));
  return path.resolve(path.dirname(fromFile), clean);
}

for (const file of REQUIRED) {
  if (!exists(file)) errors.push(`missing required file: ${file}`);
}

if (exists("robots.txt")) {
  const robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
  if (!/Sitemap:\s*https:\/\/budnikcam\.github\.io\/sitemap\.xml/i.test(robots)) {
    errors.push("robots.txt must point to https://budnikcam.github.io/sitemap.xml");
  }
}

if (exists("sitemap.xml")) {
  const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  if (!sm.includes("https://budnikcam.github.io/")) {
    errors.push("sitemap.xml has no site URLs");
  }
  if (!sm.includes("/privacy/")) {
    warnings.push("sitemap.xml does not list /privacy/");
  }
}

const htmlFiles = walk(ROOT).filter((f) => f.endsWith(".html"));
const ATTR_RE = /\b(?:href|src|srcset)=["']([^"']+)["']/gi;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const fileRel = rel(file);

  if (!/<html[^>]*lang=/i.test(html)) {
    warnings.push(`${fileRel}: missing lang on <html>`);
  }
  if (!/<meta[^>]+charset=/i.test(html)) {
    errors.push(`${fileRel}: missing charset meta`);
  }

  let match;
  ATTR_RE.lastIndex = 0;
  while ((match = ATTR_RE.exec(html))) {
    const attr = match[0].toLowerCase();
    const raw = match[1].trim();
    const isSrcset = attr.startsWith("srcset=");
    const parts = isSrcset
      ? raw.split(",").map((s) => s.trim().split(/\s+/)[0])
      : [raw];

    for (const ref of parts) {
      if (!ref || ref.startsWith("#") || ref.startsWith("mailto:") || ref.startsWith("tel:")) {
        continue;
      }
      if (/^https?:\/\//i.test(ref) || ref.startsWith("data:") || ref.startsWith("//")) {
        continue;
      }
      const target = resolveLocal(file, ref);
      if (!target) continue;
      if (!fs.existsSync(target)) {
        errors.push(`${fileRel}: broken local ref → ${ref}`);
      }
    }
  }
}

const MAX_BYTES = {
  ".jpg": 450_000,
  ".jpeg": 450_000,
  ".webp": 350_000,
  ".png": 200_000,
};

for (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (!(ext in MAX_BYTES)) continue;
  const size = fs.statSync(file).size;
  if (size > MAX_BYTES[ext]) {
    warnings.push(
      `${rel(file)} is ${(size / 1024).toFixed(0)}KB (budget ${(MAX_BYTES[ext] / 1024).toFixed(0)}KB)`
    );
  }
}

const SECRET_RE =
  /(api[_-]?key\s*[:=]\s*['"][^'"]{8,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk_live_[A-Za-z0-9]+)/i;

for (const file of walk(ROOT)) {
  if (!/\.(html|js|css|txt|xml|json|md|yml|yaml|mjs)$/i.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (SECRET_RE.test(text)) errors.push(`possible secret in ${rel(file)}`);
}

for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(
  `\nChecked ${htmlFiles.length} HTML files · ${errors.length} error(s) · ${warnings.length} warning(s)`
);

if (errors.length) process.exit(1);
console.log("OK — site checks passed");
