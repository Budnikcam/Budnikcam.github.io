import sharp from "sharp";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === ".skills") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

function plan(file, meta) {
  const rel = file.replace(ROOT + path.sep, "").replaceAll("\\", "/");
  if (/apple-touch-icon|favicon/i.test(rel)) {
    return { width: 180, format: "png", quality: 80 };
  }
  if (/og-cover/i.test(rel)) {
    return { width: 1200, height: 630, fit: "cover", format: "jpeg", quality: 82 };
  }
  if (/\/shots\//i.test(rel)) {
    return { width: 1280, format: "jpeg", quality: 78 };
  }
  if (/ivan\.png$/i.test(rel)) {
    return { width: 900, format: "jpeg", quality: 82 };
  }
  if (/hero-grid/i.test(rel)) {
    return { width: 1600, format: "jpeg", quality: 75 };
  }
  // demo / project media
  if ((meta.width || 0) > 1400) {
    return { width: 1400, format: "jpeg", quality: 80 };
  }
  return { width: meta.width, format: "jpeg", quality: 82 };
}

const files = walk(ROOT);
let beforeTotal = 0;
let afterTotal = 0;
const renames = [];

for (const file of files) {
  const before = fs.statSync(file).size;
  beforeTotal += before;
  const buf = fs.readFileSync(file);
  const meta = await sharp(buf, { failOn: "none" }).metadata();
  const cfg = plan(file, meta);

  let pipeline = sharp(buf, { failOn: "none" }).rotate();
  if (cfg.width || cfg.height) {
    pipeline = pipeline.resize({
      width: cfg.width,
      height: cfg.height,
      fit: cfg.fit || "inside",
      withoutEnlargement: true,
    });
  }

  let outBuf;
  let outPath = file;
  if (cfg.format === "jpeg") {
    outBuf = await pipeline.jpeg({ quality: cfg.quality, mozjpeg: true }).toBuffer();
    if (/\.png$/i.test(file)) {
      outPath = file.replace(/\.png$/i, ".jpg");
      renames.push([file, outPath]);
    }
  } else {
    outBuf = await pipeline.png({ compressionLevel: 9, quality: cfg.quality }).toBuffer();
  }

  // Also emit webp sibling for modern browsers
  const webpPath = outPath.replace(/\.(png|jpe?g)$/i, ".webp");
  const webpBuf = await sharp(outBuf).webp({ quality: 78 }).toBuffer();
  fs.writeFileSync(webpPath, webpBuf);

  fs.writeFileSync(outPath, outBuf);
  if (outPath !== file && fs.existsSync(file)) fs.unlinkSync(file);

  afterTotal += outBuf.size;
  const rel = path.relative(ROOT, outPath);
  console.log(
    `${(before / 1024).toFixed(0)}KB -> ${(outBuf.size / 1024).toFixed(0)}KB (+webp ${(webpBuf.size / 1024).toFixed(0)}KB)  ${rel}`
  );
}

console.log(
  `\nTOTAL raster: ${(beforeTotal / 1024 / 1024).toFixed(1)}MB -> ${(afterTotal / 1024 / 1024).toFixed(1)}MB`
);
console.log(`renamed: ${renames.length}`);
