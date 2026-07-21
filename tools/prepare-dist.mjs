#!/usr/bin/env node
/**
 * Build a clean `_site` directory for GitHub Pages artifact upload.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "_site");

const SKIP_ROOT = new Set([
  ".git",
  "node_modules",
  ".github",
  "_site",
  "tools",
  "package.json",
  "package-lock.json",
  "README.md",
  ".gitignore",
  ".DS_Store",
]);

function copyDir(src, dest, isRoot = false) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (isRoot && SKIP_ROOT.has(e.name)) continue;
    if (isRoot && e.name.startsWith(".") && e.name !== ".nojekyll" && e.name !== ".well-known") {
      continue;
    }
    const from = path.join(src, e.name);
    const to = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(from, to, false);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyDir(ROOT, OUT, true);
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

let count = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else count += 1;
  }
})(OUT);

console.log(`Prepared _site with ${count} files`);
