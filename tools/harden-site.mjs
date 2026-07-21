import fs from "fs";
import path from "path";

let css = fs.readFileSync("assets/styles.css", "utf8");
if (!css.includes("sr-only")) {
  css = css.replace(
    `html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font);
  color: var(--ink);
  background: var(--bg);
  line-height: 1.55;
  overflow-x: hidden;
  cursor: none;
}
body.is-touch { cursor: auto; }
body.is-touch a, body.is-touch button { cursor: pointer; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
::selection { background: var(--cyan); color: #041018; }`,
    `html { scroll-behavior: smooth; text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font);
  color: var(--ink);
  background: var(--bg);
  line-height: 1.55;
  overflow-x: hidden;
  cursor: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body.is-touch { cursor: auto; }
body.is-touch a, body.is-touch button { cursor: pointer; }
img { max-width: 100%; display: block; height: auto; -webkit-user-drag: none; }
picture { display: contents; }
a { color: inherit; text-decoration: none; }
button { -webkit-tap-highlight-color: transparent; }
::selection { background: var(--cyan); color: #041018; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}`
  );
}
if (!css.includes(".case, .service, .btn, .filter")) {
  css = css.replace(
    `.reveal { opacity: 1; transform: none; transition: none; }
}`,
    `.reveal { opacity: 1; transform: none; transition: none; }
  .case, .service, .btn, .filter { transition: none !important; }
}`
  );
}
fs.writeFileSync("assets/styles.css", css);

let html = fs.readFileSync("index.html", "utf8");
html = html.replace(
  /<div class="case-media"><img src="(\/assets\/shots\/[^"]+)\.jpg" alt="([^"]*)" width="1280" height="800" loading="lazy"\/><\/div>/g,
  `<div class="case-media"><picture><source srcset="$1.webp" type="image/webp"/><img src="$1.jpg" alt="$2" width="1280" height="800" loading="lazy" decoding="async"/></picture></div>`
);
html = html.replace(
  '<script src="assets/app.js"></script>',
  '<script src="assets/app.js" defer></script>'
);
fs.writeFileSync("index.html", html);

fs.writeFileSync(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: https://budnikcam.github.io/sitemap.xml
`
);

const redirects = new Set([
  "aurora-corp",
  "nord-shop",
  "pulse-crm",
  "bot-nexus",
  "parse-lab",
  "gos-portal",
  "lake-travel",
  "open-fund",
  "mobile-fleet",
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "index.html" && dir.startsWith("sites")) out.push(p);
  }
  return out;
}

for (const file of walk("sites")) {
  const slug = file.split(path.sep)[1];
  if (redirects.has(slug)) continue;
  let h = fs.readFileSync(file, "utf8");
  if (!/name="referrer"/.test(h)) {
    h = h.replace(
      /<meta name="viewport"[^>]*>/i,
      (m) => `${m}\n<meta name="referrer" content="strict-origin-when-cross-origin"/>`
    );
  }
  h = h.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');
  fs.writeFileSync(file, h);
  console.log("demo", slug);
}

console.log("done");
