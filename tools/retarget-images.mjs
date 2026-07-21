import fs from "fs";
import path from "path";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const re = /(\b(?:assets\/(?:media|shots)|media|projects|products)\/[^"'()\s]+)\.png\b/gi;

for (const file of walk("sites")) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(re, "$1.jpg");
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log("fixed", path.relative(process.cwd(), file));
  }
}

console.log("done");
