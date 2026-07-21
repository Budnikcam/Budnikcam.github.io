import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const shotsDir = join(root, "assets", "shots");
mkdirSync(shotsDir, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const sites = [
  "aurora-corp",
  "nord-shop",
  "pulse-crm",
  "lake-travel",
  "open-fund",
];

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const filePath = join(root, urlPath.replace(/^\//, ""));
  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[extname(filePath)] || "application/octet-stream" });
  res.end(readFileSync(filePath));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const slug of sites) {
  const url = `${base}/sites/${slug}/`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const out = join(shotsDir, `${slug}.png`);
  await page.screenshot({ path: out, fullPage: false });
  console.log("shot", slug, "->", out);
}

await browser.close();
server.close();
console.log("done");
