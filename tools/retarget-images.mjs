import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const re = /(\b(?:assets\/(?:media|shots)|media|projects|products)\/[^"'()\s]+)\.png\b/gi;

for (const file of walk(ROOT)) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(re, "$1.jpg");
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log("updated", path.relative(ROOT, file));
  }
}

const redirects = [
  "aurora-corp",
  "nord-shop",
  "pulse-crm",
  "bot-nexus",
  "parse-lab",
  "gos-portal",
  "lake-travel",
  "open-fund",
  "mobile-fleet",
];

for (const slug of redirects) {
  const file = path.join(ROOT, "sites", slug, "index.html");
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  if (/noindex/i.test(html)) continue;
  html = html.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex,follow"/>');
  fs.writeFileSync(file, html);
  console.log("noindex", slug);
}

console.log("done");
