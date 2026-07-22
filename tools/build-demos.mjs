/**
 * Generate multi-page professional demo sites for portfolio cases.
 * Run: node tools/build-demos.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("sites");

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, "utf8");
}

function layout({
  brand,
  title,
  description,
  canonical,
  theme,
  fonts,
  nav,
  active,
  body,
  back = "../../",
}) {
  const navHtml = nav
    .map(([href, label]) => {
      const on = href === active ? ' class="on"' : "";
      return `<a href="${href}"${on}>${label}</a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${canonical}"/>
<meta name="referrer" content="strict-origin-when-cross-origin"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fonts}" rel="stylesheet"/>
<link rel="stylesheet" href="site.css"/>
</head>
<body class="theme-${theme}">
<div class="demo-bar">Демо-кейс Solomichev Studio · <a href="${back}">← к портфолио</a></div>
<header class="top">
  <div class="top-row">
    <a class="logo" href="index.html">${brand}</a>
    <a class="btn btn-sm top-cta" href="contacts.html">Связаться</a>
  </div>
  <nav class="nav" aria-label="Разделы">${navHtml}</nav>
</header>
<main class="main">
${body}
</main>
<footer class="foot">
  <div class="foot-brand"><strong>${brand}</strong><span>Демонстрационный многостраничный кейс</span></div>
  <div class="foot-links"><a href="index.html">Главная</a><a href="contacts.html">Контакты</a><a href="${back}">Портфолио</a></div>
</footer>
</body>
</html>`;
}

const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  margin:0;min-height:100dvh;display:flex;flex-direction:column;
  line-height:1.55;color:var(--ink);background:var(--bg);font-family:var(--font);
}
img{max-width:100%;height:auto;display:block}
a{color:inherit;text-decoration:none}
button,input,textarea,select{font:inherit}
:root{--pad:clamp(1rem,4vw,1.5rem);--max:1120px;--radius:16px}

.demo-bar{
  background:var(--bar);color:var(--bar-ink);font-size:.8rem;
  padding:.55rem var(--pad);display:flex;justify-content:center;align-items:center;
  gap:.35rem;flex-wrap:wrap;text-align:center;
}
.demo-bar a{color:var(--acc);font-weight:700}

.shell-width{
  width:100%;
  max-width:var(--max);
  margin-left:auto;
  margin-right:auto;
  padding-left:var(--pad);
  padding-right:var(--pad);
}

.top{
  width:100%;
  max-width:var(--max);
  margin:0 auto;
  padding:.9rem var(--pad);
  display:grid;gap:.75rem;align-items:center;
  border-bottom:1px solid var(--line);
}
.top-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem}
.logo{font-family:var(--display);font-weight:700;font-size:clamp(1.05rem,2.8vw,1.2rem);letter-spacing:-.02em;line-height:1.2}
.nav{
  display:flex;flex-wrap:wrap;align-items:center;gap:.35rem .15rem;
}
.nav a{
  color:var(--muted);font-size:.9rem;font-weight:600;
  padding:.45rem .7rem;border-radius:999px;line-height:1.2;
}
.nav a.on{color:var(--ink);background:var(--soft)}
.nav a:hover{color:var(--ink)}
.top-cta{flex-shrink:0}

.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.4rem;
  min-height:44px;background:var(--acc);color:var(--btn-ink,#fff);
  font-weight:700;padding:.75rem 1.1rem;border-radius:12px;border:0;text-align:center;
}
.btn-sm{min-height:40px;padding:.55rem .9rem;font-size:.88rem}
.btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}

.main{flex:1 0 auto;width:100%}
.wrap{
  width:100%;
  max-width:var(--max);
  margin:0 auto;
  padding:1.75rem var(--pad) 3rem;
}
.hero{
  display:grid;gap:1.15rem;align-items:center;margin:.4rem 0 1.4rem;
}
.hero > div:first-child{min-width:0}
.hero h1{
  font-family:var(--display);font-size:clamp(1.7rem,5.2vw,2.85rem);
  line-height:1.1;letter-spacing:-.03em;margin:0 0 .7rem;text-wrap:balance;
}
.hero p{color:var(--muted);margin:0 0 1.05rem;max-width:42ch;font-size:clamp(.98rem,2.5vw,1.05rem)}
.hero-actions{display:flex;flex-wrap:wrap;gap:.65rem;align-items:center}
.media{
  border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);
  background:var(--card);aspect-ratio:16/10;min-height:0;
}
.media img{width:100%;height:100%;object-fit:cover;min-height:0}
.kicker{
  font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);
  font-weight:700;margin:0 0 .5rem;
}

.grid{display:grid;gap:1rem;align-items:stretch}
.grid > .card, .grid > a.card{height:100%;display:flex;flex-direction:column}
.grid > a.card .ph{margin:-1.15rem -1.15rem .85rem}
.card{
  background:var(--card);border:1px solid var(--line);border-radius:var(--radius);
  padding:1.15rem;overflow:hidden;min-width:0;
}
.card h3{margin:0 0 .4rem;font-family:var(--display);font-size:1.05rem;line-height:1.25;text-wrap:balance}
.card p,.muted{color:var(--muted);margin:0}
.ph{aspect-ratio:16/10;background:var(--soft);overflow:hidden;border-radius:12px 12px 0 0}
.ph img{width:100%;height:100%;object-fit:cover}
.price{color:var(--acc);font-weight:800;margin-top:auto;padding-top:.45rem}

.section{margin:1.25rem 0 0}
.section-narrow{max-width:720px}
.wrap > .kicker,.wrap > h2,.wrap > .muted,.wrap > .list,.wrap > .form{max-width:720px}
.wrap > .table-wrap{max-width:720px}
.section h2{
  font-family:var(--display);font-size:clamp(1.35rem,3.5vw,1.9rem);
  margin:0 0 .9rem;letter-spacing:-.02em;text-wrap:balance;
}

.table-wrap{width:100%;max-width:720px;overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 0 .75rem;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.table{width:100%;border-collapse:collapse;table-layout:fixed}
.table th,.table td{
  text-align:left;vertical-align:middle;padding:.9rem 1rem;
  border-bottom:1px solid var(--line);font-size:.95rem;
}
.table tr:last-child td{border-bottom:0}
.table th{color:var(--muted);font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;background:var(--soft)}
.table th:nth-child(2),.table td:nth-child(2),
.table th:nth-child(3),.table td:nth-child(3){width:26%}

.badge{
  display:inline-flex;align-items:center;padding:.22rem .55rem;border-radius:999px;
  font-size:.72rem;font-weight:700;background:var(--badge-bg,#e8f5e9);color:var(--badge-ink,#166534);
  white-space:nowrap;
}

.stats{display:grid;gap:.8rem;grid-template-columns:repeat(2,minmax(0,1fr))}
.stat{
  background:var(--card);border:1px solid var(--line);border-radius:14px;padding:1rem;
  min-width:0;display:flex;flex-direction:column;gap:.2rem;
}
.stat b{display:block;font-family:var(--display);font-size:clamp(1.15rem,3vw,1.35rem);line-height:1.15}
.stat span{color:var(--muted);font-size:.82rem}

.form{display:grid;gap:.7rem;width:min(100%,520px)}
.form input,.form textarea,.form select{
  width:100%;min-height:44px;padding:.8rem .9rem;border-radius:12px;
  border:1px solid var(--line);background:var(--card);color:var(--ink);
}
.form textarea{min-height:120px;resize:vertical}
.list{margin:0;padding-left:1.15rem;color:var(--muted)}
.list li{margin:.35rem 0}

.foot{
  width:100%;
  max-width:var(--max);
  margin:auto auto 0;
  padding:1.2rem var(--pad) 1.6rem;
  border-top:1px solid var(--line);
  display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap;
  color:var(--muted);font-size:.9rem;
}
.foot-brand{display:grid;gap:.15rem;min-width:0}
.foot strong{color:var(--ink)}
.foot-links{display:flex;flex-wrap:wrap;gap:.35rem .85rem;align-items:center}
.foot-links a{font-weight:600}
.foot-links a:hover{color:var(--ink)}

.shell{display:grid;gap:1rem;align-items:start}
.side{
  background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:.75rem;
  display:flex;flex-wrap:wrap;gap:.25rem;
}
.side a{
  display:inline-flex;align-items:center;padding:.55rem .75rem;border-radius:10px;
  color:var(--muted);font-weight:600;min-height:40px;
}
.side a.on,.side a:hover{background:var(--soft);color:var(--ink)}
.panel{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:1rem;min-width:0}

.phone{
  width:min(100%,420px);margin:0 auto;border:1px solid var(--line);border-radius:28px;
  overflow:hidden;background:var(--card);box-shadow:0 20px 50px rgba(0,0,0,.12);
}
.phone-top{padding:.8rem 1rem;background:var(--soft);font-weight:700}
.chat{padding:1rem;display:grid;gap:.6rem;min-height:280px}
.bubble{max-width:85%;padding:.7rem .85rem;border-radius:14px;font-size:.92rem}
.bubble.bot{background:var(--soft)}
.bubble.user{background:var(--acc);color:var(--btn-ink,#fff);justify-self:end}

.pager{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem}
.chip{
  display:inline-flex;align-items:center;justify-content:center;
  border:1px solid var(--line);border-radius:999px;padding:.4rem .75rem;
  font-size:.8rem;color:var(--muted);min-height:36px;
}

@media (min-width:640px){
  .stats{grid-template-columns:repeat(4,minmax(0,1fr))}
  .grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (min-width:760px){
  .top{grid-template-columns:auto 1fr auto;gap:1rem 1.25rem}
  .top-row{display:contents}
  .logo{grid-column:1;align-self:center}
  .nav{grid-column:2;justify-content:center;margin:0}
  .top-cta{grid-column:3;justify-self:end}
  .grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .side{flex-direction:column;flex-wrap:nowrap}
  .side a{display:block}
}
@media (min-width:900px){
  .hero{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:1.6rem}
  .grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}
  .shell{grid-template-columns:220px minmax(0,1fr)}
}
@media (max-width:759px){
  .hero-actions .btn{flex:1 1 160px}
  .table th,.table td{padding:.7rem .75rem;font-size:.88rem}
}

/* themes */
.theme-shop{--bg:#fafafa;--ink:#111;--muted:#666;--acc:#e11d48;--card:#fff;--line:#e8e8e8;--soft:#f3f4f6;--bar:#111;--bar-ink:#eee;--font:"DM Sans",system-ui,sans-serif;--display:"Space Grotesk",system-ui,sans-serif}
.theme-gov{--bg:#f4f7fb;--ink:#0f172a;--muted:#64748b;--acc:#1e40af;--card:#fff;--line:#d7e0ee;--soft:#e8eef8;--bar:#0b1b3a;--bar-ink:#e8eef8;--font:Manrope,system-ui,sans-serif;--display:"Roboto Slab",Georgia,serif}
.theme-saas{--bg:#0b1220;--ink:#e8eef8;--muted:#93a4bf;--acc:#60a5fa;--card:#121a2e;--line:#24304a;--soft:#1a243c;--bar:#060a12;--bar-ink:#c7d2fe;--font:"IBM Plex Sans",system-ui,sans-serif;--display:"IBM Plex Sans",system-ui,sans-serif;--badge-bg:#12351f;--badge-ink:#4ade80}
.theme-mobile{--bg:#f7f8fb;--ink:#101828;--muted:#667085;--acc:#7c3aed;--card:#fff;--line:#e4e7ec;--soft:#f2eaff;--bar:#1d1233;--bar-ink:#efe7ff;--font:Inter,system-ui,sans-serif;--display:Inter,system-ui,sans-serif}
.theme-bot{--bg:#0f172a;--ink:#f8fafc;--muted:#94a3b8;--acc:#22d3ee;--card:#111827;--line:#1f2937;--soft:#164e63;--bar:#020617;--bar-ink:#a5f3fc;--font:"Segoe UI",system-ui,sans-serif;--display:"Segoe UI",system-ui,sans-serif;--btn-ink:#082f49}
.theme-data{--bg:#f8fafc;--ink:#0f172a;--muted:#64748b;--acc:#0f766e;--card:#fff;--line:#e2e8f0;--soft:#ecfdf5;--bar:#042f2e;--bar-ink:#ccfbf1;--font:"IBM Plex Sans",system-ui,sans-serif;--display:"IBM Plex Sans",system-ui,sans-serif}
.theme-corp{--bg:#fbfaf7;--ink:#1c1917;--muted:#78716c;--acc:#b45309;--card:#fff;--line:#e7e5e4;--soft:#fff7ed;--bar:#1c1917;--bar-ink:#fafaf9;--font:Georgia,"Times New Roman",serif;--display:Georgia,serif}
.theme-travel{--bg:#f5f9f7;--ink:#14231c;--muted:#5b7166;--acc:#047857;--card:#fff;--line:#d8e6de;--soft:#ecfdf5;--bar:#064e3b;--bar-ink:#ecfdf5;--font:"DM Sans",system-ui,sans-serif;--display:"Space Grotesk",system-ui,sans-serif}
.theme-fund{--bg:#fffaf5;--ink:#1c1917;--muted:#78716c;--acc:#c2410c;--card:#fff;--line:#f0e4d8;--soft:#ffedd5;--bar:#7c2d12;--bar-ink:#ffedd5;--font:"Source Sans 3",system-ui,sans-serif;--display:Georgia,serif}
`;

function siteCss(dir) {
  write(path.join(ROOT, dir, "site.css"), baseCss);
}

function page(dir, file, opts) {
  write(path.join(ROOT, dir, file), layout(opts));
}

// ---------- TrailMarket ----------
function trailmarket() {
  const dir = "trailmarket";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["catalog.html", "Каталог"],
    ["delivery.html", "Доставка"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "TrailMarket",
    theme: "shop",
    fonts:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap",
    nav,
    description: "Интернет-магазин outdoor-снаряжения: каталог, доставка, контакты.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "TrailMarket — outdoor-магазин",
    canonical: "https://budnikcam.github.io/sites/trailmarket/",
    body: `<div class="wrap">
<section class="hero">
  <div>
    <p class="kicker">Outdoor e-commerce</p>
    <h1>Снаряжение, которому доверяют в походе</h1>
    <p>Каталог, оплата и доставка по РФ. Магазин с понятной структурой страниц и карточками товара.</p>
    <div class="hero-actions"><a class="btn" href="catalog.html">Открыть каталог</a><a class="btn btn-ghost" href="delivery.html">Условия доставки</a></div>
  </div>
  <div class="media"><img src="media/hero.jpg" alt="Outdoor снаряжение" width="1600" height="900"/></div>
</section>
<section class="section">
  <h2>Хиты сезона</h2>
  <div class="grid grid-4">
    <a class="card" href="product.html"><div class="ph"><img src="media/backpack.jpg" alt="Рюкзак"/></div><h3>Рюкзак Peak 42L</h3><div class="price">14 900 ₽</div></a>
    <a class="card" href="product.html"><div class="ph"><img src="media/boots.jpg" alt="Ботинки"/></div><h3>Ботинки Ridge GTX</h3><div class="price">19 400 ₽</div></a>
    <a class="card" href="product.html"><div class="ph"><img src="media/jacket.jpg" alt="Куртка"/></div><h3>Куртка Wind Pro</h3><div class="price">23 200 ₽</div></a>
    <a class="card" href="product.html"><div class="ph"><img src="media/lamp.jpg" alt="Фонарь"/></div><h3>Фонарь NightBeam</h3><div class="price">5 490 ₽</div></a>
  </div>
</section>
</div>`,
  });

  page(dir, "catalog.html", {
    ...base,
    active: "catalog.html",
    title: "Каталог — TrailMarket",
    canonical: "https://budnikcam.github.io/sites/trailmarket/catalog.html",
    body: `<div class="wrap">
<p class="kicker">Catalog</p>
<h1 style="font-family:var(--display);font-size:clamp(1.8rem,4vw,2.4rem);margin:0 0 1rem">Каталог снаряжения</h1>
<p class="muted">Фильтры: рюкзаки · обувь · одежда · свет</p>
<div class="section grid grid-3">
  <a class="card" href="product.html"><div class="ph"><img src="media/backpack.jpg" alt=""/></div><h3>Peak 42L</h3><p>Трекинговый рюкзак</p><div class="price">14 900 ₽</div></a>
  <a class="card" href="product.html"><div class="ph"><img src="media/boots.jpg" alt=""/></div><h3>Ridge GTX</h3><p>Мембранные ботинки</p><div class="price">19 400 ₽</div></a>
  <a class="card" href="product.html"><div class="ph"><img src="media/jacket.jpg" alt=""/></div><h3>Wind Pro</h3><p>Ветрозащитная куртка</p><div class="price">23 200 ₽</div></a>
  <a class="card" href="product.html"><div class="ph"><img src="media/lamp.jpg" alt=""/></div><h3>NightBeam</h3><p>Налобный фонарь</p><div class="price">5 490 ₽</div></a>
  <a class="card" href="product.html"><div class="ph"><img src="media/hero.jpg" alt=""/></div><h3>Trail Set</h3><p>Базовый набор</p><div class="price">38 900 ₽</div></a>
  <a class="card" href="product.html"><div class="ph"><img src="media/backpack.jpg" alt=""/></div><h3>Peak 28L</h3><p>Город / one-day</p><div class="price">11 200 ₽</div></a>
</div>
</div>`,
  });

  page(dir, "product.html", {
    ...base,
    active: "catalog.html",
    title: "Peak 42L — TrailMarket",
    canonical: "https://budnikcam.github.io/sites/trailmarket/product.html",
    body: `<div class="wrap">
<section class="hero">
  <div class="media"><img src="media/backpack.jpg" alt="Рюкзак Peak 42L"/></div>
  <div>
    <p class="kicker">Карточка товара</p>
    <h1>Рюкзак Peak 42L</h1>
    <p>Лёгкий каркас, отделение для гидратора, дождевик в комплекте. Гарантия 2 года.</p>
    <div class="price" style="font-size:1.5rem;margin-bottom:1rem">14 900 ₽</div>
    <div class="hero-actions"><a class="btn" href="contacts.html">Купить / заказать</a><a class="btn btn-ghost" href="catalog.html">Назад в каталог</a></div>
    <ul class="list" style="margin-top:1.2rem"><li>Объём 42 литра</li><li>Вес 1.35 кг</li><li>Цвета: graphite / moss</li></ul>
  </div>
</section>
</div>`,
  });

  page(dir, "delivery.html", {
    ...base,
    active: "delivery.html",
    title: "Доставка — TrailMarket",
    canonical: "https://budnikcam.github.io/sites/trailmarket/delivery.html",
    body: `<div class="wrap">
<p class="kicker">Logistics</p>
<h2>Доставка и оплата</h2>
<table class="table">
  <tr><th>Способ</th><th>Срок</th><th>Стоимость</th></tr>
  <tr><td>Курьер по городу</td><td>1–2 дня</td><td>от 350 ₽</td></tr>
  <tr><td>Пункт выдачи</td><td>2–5 дней</td><td>от 290 ₽</td></tr>
  <tr><td>ТК по РФ</td><td>3–10 дней</td><td>по тарифу</td></tr>
</table>
<p class="muted">Оплата: карта, СБП, рассрочка. Возврат 14 дней.</p>
</div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — TrailMarket",
    canonical: "https://budnikcam.github.io/sites/trailmarket/contacts.html",
    body: `<div class="wrap">
<p class="kicker">Contacts</p>
<h2>Связаться с магазином</h2>
<form class="form" action="mailto:vanyasoloma67@gmail.com" method="get">
  <input name="subject" type="hidden" value="TrailMarket demo"/>
  <input placeholder="Имя" required/>
  <input placeholder="Email или телефон" required/>
  <textarea rows="4" placeholder="Комментарий к заказу"></textarea>
  <button class="btn" type="submit">Отправить заявку</button>
</form>
</div>`,
  });
}

// ---------- Smol Services ----------
function smolServices() {
  const dir = "smol-services";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["services.html", "Услуги"],
    ["status.html", "Статусы"],
    ["cabinet.html", "Кабинет"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "Смоленские сервисы",
    theme: "gov",
    fonts:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Roboto+Slab:wght@600;700&display=swap",
    nav,
    description: "Городской портал услуг: каталог, статусы обращений, личный кабинет.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "Смоленские сервисы — портал услуг",
    canonical: "https://budnikcam.github.io/sites/smol-services/",
    body: `<div class="wrap">
<section class="hero">
  <div>
    <p class="kicker">B2G portal</p>
    <h1>Городские услуги онлайн — заявки, статусы, контроль</h1>
    <p>Единая точка входа для жителей: МФЦ, ЖКХ, соцподдержка и прозрачные статусы обращений.</p>
    <div class="hero-actions"><a class="btn" href="services.html">Каталог услуг</a><a class="btn btn-ghost" href="status.html">Проверить статус</a></div>
  </div>
  <div class="media"><img src="media/hero.jpg" alt="Портал услуг"/></div>
</section>
<div class="stats">
  <div class="stat"><b>48</b><span>услуг в каталоге</span></div>
  <div class="stat"><b>24ч</b><span>среднее время ответа</span></div>
  <div class="stat"><b>12k</b><span>обращений / мес</span></div>
  <div class="stat"><b>98%</b><span>доступность сервиса</span></div>
</div>
</div>`,
  });

  page(dir, "services.html", {
    ...base,
    active: "services.html",
    title: "Услуги — Смоленские сервисы",
    canonical: "https://budnikcam.github.io/sites/smol-services/services.html",
    body: `<div class="wrap">
<p class="kicker">Services</p>
<h2>Каталог услуг</h2>
<div class="grid grid-3">
  <div class="card"><h3>Справка ЖКХ</h3><p>Заказ справок и выписок по лицевому счёту.</p><span class="badge">онлайн</span></div>
  <div class="card"><h3>Запись в МФЦ</h3><p>Выбор офиса, слота и напоминание.</p><span class="badge">запись</span></div>
  <div class="card"><h3>Соцподдержка</h3><p>Подача заявления и отслеживание решения.</p><span class="badge">заявление</span></div>
  <div class="card"><h3>Транспорт</h3><p>Льготный проезд и статусы заявок.</p><span class="badge">льготы</span></div>
  <div class="card"><h3>Жалоба / обращение</h3><p>Регистрация и маршрут до ведомства.</p><span class="badge">контроль</span></div>
  <div class="card"><h3>Документы</h3><p>Загрузка сканов и проверка комплектности.</p><span class="badge">файлы</span></div>
</div>
</div>`,
  });

  page(dir, "status.html", {
    ...base,
    active: "status.html",
    title: "Статусы — Смоленские сервисы",
    canonical: "https://budnikcam.github.io/sites/smol-services/status.html",
    body: `<div class="wrap">
<p class="kicker">Tracking</p>
<h2>Статусы обращений</h2>
<table class="table">
  <tr><th>Номер</th><th>Услуга</th><th>Статус</th></tr>
  <tr><td>SM-10482</td><td>Справка ЖКХ</td><td><span class="badge">готово</span></td></tr>
  <tr><td>SM-10491</td><td>Запись в МФЦ</td><td><span class="badge">в работе</span></td></tr>
  <tr><td>SM-10502</td><td>Соцподдержка</td><td><span class="badge">на проверке</span></td></tr>
</table>
</div>`,
  });

  page(dir, "cabinet.html", {
    ...base,
    active: "cabinet.html",
    title: "Кабинет — Смоленские сервисы",
    canonical: "https://budnikcam.github.io/sites/smol-services/cabinet.html",
    body: `<div class="wrap">
<p class="kicker">Personal account</p>
<h2>Личный кабинет заявителя</h2>
<div class="shell">
  <aside class="side">
    <a class="on" href="cabinet.html">Мои заявки</a>
    <a href="status.html">Статусы</a>
    <a href="services.html">Новая услуга</a>
    <a href="contacts.html">Поддержка</a>
  </aside>
  <div class="panel">
    <h3 style="margin-top:0">Активные заявки</h3>
    <table class="table">
      <tr><th>Услуга</th><th>Обновлено</th><th>SLA</th></tr>
      <tr><td>Справка ЖКХ</td><td>сегодня</td><td class="muted">в норме</td></tr>
      <tr><td>Соцподдержка</td><td>вчера</td><td class="muted">ожидает</td></tr>
    </table>
  </div>
</div>
</div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — Смоленские сервисы",
    canonical: "https://budnikcam.github.io/sites/smol-services/contacts.html",
    body: `<div class="wrap">
<p class="kicker">Support</p>
<h2>Контакты поддержки</h2>
<div class="grid grid-2">
  <div class="card"><h3>Горячая линия</h3><p>8 800 000-00-00 · ежедневно 08:00–20:00</p></div>
  <div class="card"><h3>Электронная почта</h3><p>support@smol-services.demo</p></div>
</div>
</div>`,
  });
}

// ---------- LedgerOps ----------
function ledgerops() {
  const dir = "ledgerops";
  siteCss(dir);
  const nav = [
    ["index.html", "О продукте"],
    ["dashboard.html", "Дашборд"],
    ["leads.html", "Лиды"],
    ["deals.html", "Сделки"],
    ["contacts.html", "Демо-доступ"],
  ];
  const base = {
    brand: "LedgerOps",
    theme: "saas",
    fonts:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap",
    nav,
    description: "Операционная CRM: лиды, SLA, сделки и дашборд.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "LedgerOps — операционная CRM",
    canonical: "https://budnikcam.github.io/sites/ledgerops/",
    body: `<div class="wrap">
<section class="hero">
  <div>
    <p class="kicker">SaaS / CRM</p>
    <h1>Контроль лидов, SLA и оборота в одном контуре</h1>
    <p>Многостраничный продукт: маркетинг-лендинг + рабочие экраны кабинета.</p>
    <div class="hero-actions"><a class="btn" href="dashboard.html">Открыть кабинет</a><a class="btn btn-ghost" href="contacts.html">Запросить демо</a></div>
  </div>
  <div class="media"><img src="media/hero.jpg" alt="CRM интерфейс"/></div>
</section>
</div>`,
  });

  page(dir, "dashboard.html", {
    ...base,
    active: "dashboard.html",
    title: "Дашборд — LedgerOps",
    canonical: "https://budnikcam.github.io/sites/ledgerops/dashboard.html",
    body: `<div class="wrap">
<div class="shell">
  <aside class="side">
    <div class="logo" style="margin-bottom:1rem;color:var(--acc)">LedgerOps</div>
    <a class="on" href="dashboard.html">Дашборд</a>
    <a href="leads.html">Лиды</a>
    <a href="deals.html">Сделки</a>
    <a href="contacts.html">Настройки</a>
  </aside>
  <div>
    <div class="stats" style="margin-bottom:1rem">
      <div class="stat"><b>128</b><span>лидов / неделя</span></div>
      <div class="stat"><b>94%</b><span>SLA в норме</span></div>
      <div class="stat"><b>2.4M</b><span>оборот, ₽</span></div>
      <div class="stat"><b>18</b><span>сделок в работе</span></div>
    </div>
    <div class="panel"><h3 style="margin-top:0">Активность сегодня</h3>
      <table class="table"><tr><th>Событие</th><th>Ответственный</th><th>Статус</th></tr>
      <tr><td>Новый лид · North Retail</td><td>Анна</td><td><span class="badge">новый</span></td></tr>
      <tr><td>Просрочка КП · Atlas</td><td>Игорь</td><td><span class="badge">SLA</span></td></tr>
      <tr><td>Оплата получена · FieldCo</td><td>Мария</td><td><span class="badge">ok</span></td></tr>
      </table>
    </div>
  </div>
</div>
</div>`,
  });

  page(dir, "leads.html", {
    ...base,
    active: "leads.html",
    title: "Лиды — LedgerOps",
    canonical: "https://budnikcam.github.io/sites/ledgerops/leads.html",
    body: `<div class="wrap"><p class="kicker">Pipeline</p><h2>Лиды</h2>
<table class="table"><tr><th>Компания</th><th>Источник</th><th>Ответственный</th><th>Статус</th></tr>
<tr><td>North Retail</td><td>Сайт</td><td>Анна</td><td><span class="badge">квалификация</span></td></tr>
<tr><td>Atlas Logistics</td><td>Реклама</td><td>Игорь</td><td><span class="badge">КП</span></td></tr>
<tr><td>FieldCo</td><td>Партнёр</td><td>Мария</td><td><span class="badge">переговоры</span></td></tr>
</table></div>`,
  });

  page(dir, "deals.html", {
    ...base,
    active: "deals.html",
    title: "Сделки — LedgerOps",
    canonical: "https://budnikcam.github.io/sites/ledgerops/deals.html",
    body: `<div class="wrap"><p class="kicker">Revenue</p><h2>Сделки</h2>
<div class="grid grid-3">
  <div class="card"><h3>FieldCo · внедрение</h3><p>Сумма 890 000 ₽</p><span class="badge">закрытие</span></div>
  <div class="card"><h3>Atlas · подписка</h3><p>Сумма 120 000 ₽ / мес</p><span class="badge">оплата</span></div>
  <div class="card"><h3>North · пилот</h3><p>Сумма 75 000 ₽</p><span class="badge">пилот</span></div>
</div></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Демо-доступ — LedgerOps",
    canonical: "https://budnikcam.github.io/sites/ledgerops/contacts.html",
    body: `<div class="wrap"><p class="kicker">Demo</p><h2>Запросить демо-доступ</h2>
<form class="form"><input placeholder="Компания"/><input placeholder="Email"/><textarea rows="4" placeholder="Какой процесс хотите закрыть?"></textarea><button class="btn" type="button">Отправить</button></form></div>`,
  });
}

// ---------- Fieldly ----------
function fieldly() {
  const dir = "fieldly";
  siteCss(dir);
  const nav = [
    ["index.html", "О приложении"],
    ["tasks.html", "Задачи"],
    ["act.html", "Акт"],
    ["profile.html", "Профиль"],
    ["contacts.html", "Связаться"],
  ];
  const base = {
    brand: "Fieldly",
    theme: "mobile",
    fonts: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    nav,
    description: "Мобильный кабинет выездных бригад: задачи, акты, статусы.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "Fieldly — мобильный кабинет бригад",
    canonical: "https://budnikcam.github.io/sites/fieldly/",
    body: `<div class="wrap">
<section class="hero">
  <div>
    <p class="kicker">Mobile / PWA</p>
    <h1>Полевые задачи, акты и статусы — в кармане бригады</h1>
    <p>Многоэкранный PWA-сценарий: список задач, карточка визита, акт выполненных работ.</p>
    <div class="hero-actions"><a class="btn" href="tasks.html">Открыть задачи</a><a class="btn btn-ghost" href="act.html">Пример акта</a></div>
  </div>
  <div class="media"><img src="media/hero.jpg" alt="Fieldly app"/></div>
</section>
</div>`,
  });

  page(dir, "tasks.html", {
    ...base,
    active: "tasks.html",
    title: "Задачи — Fieldly",
    canonical: "https://budnikcam.github.io/sites/fieldly/tasks.html",
    body: `<div class="wrap"><p class="kicker">Today</p><h2>Задачи бригады</h2>
<div class="grid" style="max-width:520px;margin:0 auto">
  <a class="card" href="act.html"><h3>ул. Ленина, 14</h3><p>Монтаж · 10:30</p><span class="badge">в пути</span></a>
  <a class="card" href="act.html"><h3>пр. Гагарина, 8</h3><p>Сервис · 13:00</p><span class="badge">ожидает</span></a>
  <a class="card" href="act.html"><h3>пер. Садовый, 3</h3><p>Акт / фото · 16:20</p><span class="badge">закрыть</span></a>
</div></div>`,
  });

  page(dir, "act.html", {
    ...base,
    active: "act.html",
    title: "Акт — Fieldly",
    canonical: "https://budnikcam.github.io/sites/fieldly/act.html",
    body: `<div class="wrap"><p class="kicker">Work order</p><h2>Акт выполненных работ</h2>
<div class="card" style="max-width:560px">
  <h3>ул. Ленина, 14</h3>
  <ul class="list"><li>Диагностика узла</li><li>Замена комплектующих</li><li>Фото до / после</li><li>Подпись клиента</li></ul>
  <div class="hero-actions" style="margin-top:1rem"><a class="btn" href="tasks.html">Сохранить и к задачам</a></div>
</div></div>`,
  });

  page(dir, "profile.html", {
    ...base,
    active: "profile.html",
    title: "Профиль — Fieldly",
    canonical: "https://budnikcam.github.io/sites/fieldly/profile.html",
    body: `<div class="wrap"><p class="kicker">Crew</p><h2>Профиль исполнителя</h2>
<div class="card" style="max-width:480px"><h3>Бригада №4 · Алексей</h3><p>Смен: 18 · Закрыто задач: 142 · Рейтинг: 4.9</p></div></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Связаться — Fieldly",
    canonical: "https://budnikcam.github.io/sites/fieldly/contacts.html",
    body: `<div class="wrap"><p class="kicker">Pilot</p><h2>Запросить пилот для бригад</h2>
<form class="form"><input placeholder="Компания"/><input placeholder="Телефон"/><button class="btn" type="button">Отправить</button></form></div>`,
  });
}

// ---------- ShopBot Pro ----------
function shopbot() {
  const dir = "shopbot-pro";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["features.html", "Возможности"],
    ["pricing.html", "Тарифы"],
    ["demo.html", "Демо-чат"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "ShopBot Pro",
    theme: "bot",
    fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap",
    nav,
    description: "Telegram-бот для продаж: каталог, оплата, CRM.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "ShopBot Pro — Telegram-магазин",
    canonical: "https://budnikcam.github.io/sites/shopbot-pro/",
    body: `<div class="wrap"><section class="hero"><div>
<p class="kicker">Telegram commerce</p>
<h1>Продажи и поддержка прямо в мессенджере</h1>
<p>Каталог, оплата, статусы заказа и передача лида в CRM — без отдельного приложения.</p>
<div class="hero-actions"><a class="btn" href="demo.html">Смотреть демо-чат</a><a class="btn btn-ghost" href="pricing.html">Тарифы</a></div>
</div><div class="media"><img src="media/hero.jpg" alt="ShopBot"/></div></section></div>`,
  });

  page(dir, "features.html", {
    ...base,
    active: "features.html",
    title: "Возможности — ShopBot Pro",
    canonical: "https://budnikcam.github.io/sites/shopbot-pro/features.html",
    body: `<div class="wrap"><h2>Возможности</h2><div class="grid grid-3">
<div class="card"><h3>Каталог</h3><p>Карточки, варианты, остатки.</p></div>
<div class="card"><h3>Оплата</h3><p>Ссылка на платёж и подтверждение.</p></div>
<div class="card"><h3>CRM sync</h3><p>Лиды и заказы в вашей воронке.</p></div>
</div></div>`,
  });

  page(dir, "pricing.html", {
    ...base,
    active: "pricing.html",
    title: "Тарифы — ShopBot Pro",
    canonical: "https://budnikcam.github.io/sites/shopbot-pro/pricing.html",
    body: `<div class="wrap"><h2>Тарифы</h2><div class="grid grid-3">
<div class="card"><h3>Start</h3><div class="price">от 4 900 ₽/мес</div><p>Каталог + заявления</p></div>
<div class="card"><h3>Sales</h3><div class="price">от 9 900 ₽/мес</div><p>Оплата + CRM</p></div>
<div class="card"><h3>Pro</h3><div class="price">от 19 900 ₽/мес</div><p>Сценарии + аналитика</p></div>
</div></div>`,
  });

  page(dir, "demo.html", {
    ...base,
    active: "demo.html",
    title: "Демо-чат — ShopBot Pro",
    canonical: "https://budnikcam.github.io/sites/shopbot-pro/demo.html",
    body: `<div class="wrap"><h2>Демонстрация диалога</h2>
<div class="phone"><div class="phone-top">ShopBot Pro</div><div class="chat">
<div class="bubble bot">Здравствуйте! Показать каталог или статус заказа?</div>
<div class="bubble user">Каталог</div>
<div class="bubble bot">1) Рюкзак Peak — 14 900 ₽<br/>2) Ботинки Ridge — 19 400 ₽</div>
<div class="bubble user">Беру 1, к оплате</div>
<div class="bubble bot">Ссылка на оплату отправлена. После оплаты статус придёт сюда.</div>
</div></div></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — ShopBot Pro",
    canonical: "https://budnikcam.github.io/sites/shopbot-pro/contacts.html",
    body: `<div class="wrap"><h2>Запустить бота под ваш магазин</h2>
<form class="form"><input placeholder="Ниша / ассортимент"/><input placeholder="Telegram или email"/><button class="btn" type="button">Отправить</button></form></div>`,
  });
}

// ---------- DataPine ----------
function datapine() {
  const dir = "datapine";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["jobs.html", "Задачи"],
    ["sources.html", "Источники"],
    ["reports.html", "Отчёты"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "DataPine",
    theme: "data",
    fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap",
    nav,
    description: "Парсеры и выгрузки: задачи, источники, отчёты.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "DataPine — парсеры и выгрузки",
    canonical: "https://budnikcam.github.io/sites/datapine/",
    body: `<div class="wrap"><section class="hero"><div>
<p class="kicker">Parsers / ETL</p>
<h1>Сбор цен и баз по расписанию с выгрузкой в CRM</h1>
<p>Кабинет оператора: задачи парсинга, источники, логи и отчёты.</p>
<div class="hero-actions"><a class="btn" href="jobs.html">Список задач</a><a class="btn btn-ghost" href="reports.html">Отчёты</a></div>
</div><div class="media"><img src="media/hero.jpg" alt="DataPine"/></div></section></div>`,
  });

  page(dir, "jobs.html", {
    ...base,
    active: "jobs.html",
    title: "Задачи — DataPine",
    canonical: "https://budnikcam.github.io/sites/datapine/jobs.html",
    body: `<div class="wrap"><h2>Задачи парсинга</h2>
<table class="table"><tr><th>Задача</th><th>Расписание</th><th>Статус</th></tr>
<tr><td>Цены конкурентов · outdoor</td><td>каждый час</td><td><span class="badge">ok</span></td></tr>
<tr><td>Сбор карточек WB</td><td>02:00</td><td><span class="badge">queue</span></td></tr>
<tr><td>Выгрузка в CRM</td><td>после парсинга</td><td><span class="badge">ok</span></td></tr>
</table></div>`,
  });

  page(dir, "sources.html", {
    ...base,
    active: "sources.html",
    title: "Источники — DataPine",
    canonical: "https://budnikcam.github.io/sites/datapine/sources.html",
    body: `<div class="wrap"><h2>Источники</h2><div class="grid grid-3">
<div class="card"><h3>Витрины</h3><p>HTML / JSON endpoints</p></div>
<div class="card"><h3>API</h3><p>Ключи, лимиты, ретраи</p></div>
<div class="card"><h3>Файлы</h3><p>CSV / XLSX выгрузки</p></div>
</div></div>`,
  });

  page(dir, "reports.html", {
    ...base,
    active: "reports.html",
    title: "Отчёты — DataPine",
    canonical: "https://budnikcam.github.io/sites/datapine/reports.html",
    body: `<div class="wrap"><h2>Отчёты</h2><div class="stats">
<div class="stat"><b>12.4k</b><span>строк за сутки</span></div>
<div class="stat"><b>0.8%</b><span>ошибок</span></div>
<div class="stat"><b>6</b><span>активных задач</span></div>
<div class="stat"><b>3</b><span>CRM-выгрузки</span></div>
</div></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — DataPine",
    canonical: "https://budnikcam.github.io/sites/datapine/contacts.html",
    body: `<div class="wrap"><h2>Обсудить парсинг под задачу</h2>
<form class="form"><input placeholder="Что собираем?"/><input placeholder="Куда выгружать?"/><button class="btn" type="button">Отправить</button></form></div>`,
  });
}

// ---------- Northline ----------
function northline() {
  const dir = "northline";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["services.html", "Услуги"],
    ["cases.html", "Кейсы"],
    ["about.html", "О компании"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "Northline",
    theme: "corp",
    fonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap",
    nav,
    description: "Корпоративный B2B-сайт консалтинга.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "Northline — консалтинг и запуск продуктов",
    canonical: "https://budnikcam.github.io/sites/northline/",
    body: `<div class="wrap"><section class="hero"><div>
<p class="kicker">Corporate web</p>
<h1>Аудит, проектирование и запуск цифровых продуктов</h1>
<p>Многостраничный B2B-сайт: услуги, кейсы, о компании и контактная воронка.</p>
<div class="hero-actions"><a class="btn" href="services.html">Услуги</a><a class="btn btn-ghost" href="cases.html">Кейсы</a></div>
</div><div class="media"><img src="media/hero.jpg" alt="Northline"/></div></section></div>`,
  });

  page(dir, "services.html", {
    ...base,
    active: "services.html",
    title: "Услуги — Northline",
    canonical: "https://budnikcam.github.io/sites/northline/services.html",
    body: `<div class="wrap"><h2>Услуги</h2><div class="grid grid-3">
<div class="card"><h3>Product audit</h3><p>Разбор архитектуры и узких мест.</p></div>
<div class="card"><h3>Design system</h3><p>Интерфейсный каркас под рост команды.</p></div>
<div class="card"><h3>Launch</h3><p>Сборка MVP и вывод в прод.</p></div>
</div></div>`,
  });

  page(dir, "cases.html", {
    ...base,
    active: "cases.html",
    title: "Кейсы — Northline",
    canonical: "https://budnikcam.github.io/sites/northline/cases.html",
    body: `<div class="wrap"><h2>Кейсы</h2><div class="grid grid-2">
<div class="card"><h3>Ретейл-платформа</h3><p>Сократили time-to-market релизов на 35%.</p></div>
<div class="card"><h3>B2B-кабинет</h3><p>Собрали роли, SLA и отчётность в одном контуре.</p></div>
</div></div>`,
  });

  page(dir, "about.html", {
    ...base,
    active: "about.html",
    title: "О компании — Northline",
    canonical: "https://budnikcam.github.io/sites/northline/about.html",
    body: `<div class="wrap"><h2>О компании</h2>
<p class="muted" style="max-width:60ch">Northline — демо-бренд консалтинга. Страница показывает корпоративную структуру сайта: миссия, подход, команда и CTA.</p></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — Northline",
    canonical: "https://budnikcam.github.io/sites/northline/contacts.html",
    body: `<div class="wrap"><h2>Обсудить проект</h2>
<form class="form"><input placeholder="Компания"/><input placeholder="Email"/><textarea rows="4" placeholder="Задача"></textarea><button class="btn" type="button">Отправить</button></form></div>`,
  });
}

// ---------- Karelia Escape ----------
function karelia() {
  const dir = "karelia-escape";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["tours.html", "Туры"],
    ["tour.html", "Карточка тура"],
    ["booking.html", "Бронирование"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "Karelia Escape",
    theme: "travel",
    fonts:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap",
    nav,
    description: "Туры по Карелии: каталог, карточка тура, бронирование.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "Karelia Escape — туры и бронирование",
    canonical: "https://budnikcam.github.io/sites/karelia-escape/",
    body: `<div class="wrap"><section class="hero"><div>
<p class="kicker">Travel / booking</p>
<h1>Туры по Карелии с датами и онлайн-бронью</h1>
<p>Каталог туров, детальная карточка и сценарий бронирования.</p>
<div class="hero-actions"><a class="btn" href="tours.html">Смотреть туры</a><a class="btn btn-ghost" href="booking.html">Забронировать</a></div>
</div><div class="media"><img src="media/hero.jpg" alt="Карелия"/></div></section></div>`,
  });

  page(dir, "tours.html", {
    ...base,
    active: "tours.html",
    title: "Туры — Karelia Escape",
    canonical: "https://budnikcam.github.io/sites/karelia-escape/tours.html",
    body: `<div class="wrap"><h2>Каталог туров</h2><div class="grid grid-3">
<a class="card" href="tour.html"><div class="ph"><img src="media/tour1.jpg" alt=""/></div><h3>Озёра и скалы</h3><div class="price">от 28 900 ₽</div></a>
<a class="card" href="tour.html"><div class="ph"><img src="media/tour2.jpg" alt=""/></div><h3>Водопады weekend</h3><div class="price">от 19 500 ₽</div></a>
<a class="card" href="tour.html"><div class="ph"><img src="media/tour3.jpg" alt=""/></div><h3>Северный маршрут</h3><div class="price">от 34 200 ₽</div></a>
</div></div>`,
  });

  page(dir, "tour.html", {
    ...base,
    active: "tours.html",
    title: "Озёра и скалы — Karelia Escape",
    canonical: "https://budnikcam.github.io/sites/karelia-escape/tour.html",
    body: `<div class="wrap"><section class="hero">
<div class="media"><img src="media/tour1.jpg" alt="Тур"/></div>
<div><p class="kicker">Tour card</p><h1>Озёра и скалы · 3 дня</h1>
<p>Трансфер, проживание, гид, страховка. Группа до 12 человек.</p>
<div class="price" style="font-size:1.4rem;margin-bottom:1rem">от 28 900 ₽</div>
<a class="btn" href="booking.html">Забронировать даты</a>
</div></section></div>`,
  });

  page(dir, "booking.html", {
    ...base,
    active: "booking.html",
    title: "Бронирование — Karelia Escape",
    canonical: "https://budnikcam.github.io/sites/karelia-escape/booking.html",
    body: `<div class="wrap"><h2>Бронирование</h2>
<form class="form">
<select><option>Озёра и скалы</option><option>Водопады weekend</option><option>Северный маршрут</option></select>
<input type="date"/><input placeholder="Имя"/><input placeholder="Телефон"/>
<button class="btn" type="button">Отправить заявку</button>
</form></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — Karelia Escape",
    canonical: "https://budnikcam.github.io/sites/karelia-escape/contacts.html",
    body: `<div class="wrap"><h2>Контакты</h2>
<div class="card" style="max-width:480px"><p>Telegram / WhatsApp: +7 906 669-87-89</p><p>Email: vanyasoloma67@gmail.com</p></div></div>`,
  });
}

// ---------- Teplo Fond ----------
function teplo() {
  const dir = "teplo-fond";
  siteCss(dir);
  const nav = [
    ["index.html", "Главная"],
    ["help.html", "Кому помогаем"],
    ["donate.html", "Помочь"],
    ["reports.html", "Отчёты"],
    ["contacts.html", "Контакты"],
  ];
  const base = {
    brand: "Фонд «Тепло»",
    theme: "fund",
    fonts:
      "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap",
    nav,
    description: "Благотворительный фонд: помощь, пожертвования, отчёты.",
  };

  page(dir, "index.html", {
    ...base,
    active: "index.html",
    title: "Фонд «Тепло» — адресная помощь",
    canonical: "https://budnikcam.github.io/sites/teplo-fond/",
    body: `<div class="wrap"><section class="hero"><div>
<p class="kicker">Nonprofit</p>
<h1>Адресная помощь и прозрачные ежемесячные отчёты</h1>
<p>Сайт фонда с отдельными страницами для историй, доната и публичной отчётности.</p>
<div class="hero-actions"><a class="btn" href="donate.html">Помочь сейчас</a><a class="btn btn-ghost" href="reports.html">Смотреть отчёты</a></div>
</div><div class="media"><img src="media/hero.jpg" alt="Фонд Тепло"/></div></section></div>`,
  });

  page(dir, "help.html", {
    ...base,
    active: "help.html",
    title: "Кому помогаем — Фонд «Тепло»",
    canonical: "https://budnikcam.github.io/sites/teplo-fond/help.html",
    body: `<div class="wrap"><h2>Кому помогаем</h2><div class="grid grid-3">
<div class="card"><h3>Семьи</h3><p>Продукты, лекарства, школа.</p></div>
<div class="card"><h3>Пожилые</h3><p>Бытовая помощь и уход.</p></div>
<div class="card"><h3>Срочные сборы</h3><p>Точечная поддержка по заявкам.</p></div>
</div></div>`,
  });

  page(dir, "donate.html", {
    ...base,
    active: "donate.html",
    title: "Помочь — Фонд «Тепло»",
    canonical: "https://budnikcam.github.io/sites/teplo-fond/donate.html",
    body: `<div class="wrap"><h2>Сделать пожертвование</h2>
<div class="pager"><span class="chip">500 ₽</span><span class="chip">1 000 ₽</span><span class="chip">3 000 ₽</span><span class="chip">своя сумма</span></div>
<form class="form" style="margin-top:1rem"><input placeholder="Сумма, ₽"/><input placeholder="Email для чека"/><button class="btn" type="button">Перейти к оплате</button></form>
<p class="muted">Демо-страница без реального платежа.</p></div>`,
  });

  page(dir, "reports.html", {
    ...base,
    active: "reports.html",
    title: "Отчёты — Фонд «Тепло»",
    canonical: "https://budnikcam.github.io/sites/teplo-fond/reports.html",
    body: `<div class="wrap"><h2>Публичные отчёты</h2>
<table class="table"><tr><th>Период</th><th>Собрано</th><th>Направлено</th></tr>
<tr><td>Июнь 2026</td><td>1.2 млн ₽</td><td>1.15 млн ₽</td></tr>
<tr><td>Май 2026</td><td>980 тыс ₽</td><td>940 тыс ₽</td></tr>
<tr><td>Апрель 2026</td><td>1.05 млн ₽</td><td>1.01 млн ₽</td></tr>
</table></div>`,
  });

  page(dir, "contacts.html", {
    ...base,
    active: "contacts.html",
    title: "Контакты — Фонд «Тепло»",
    canonical: "https://budnikcam.github.io/sites/teplo-fond/contacts.html",
    body: `<div class="wrap"><h2>Контакты фонда</h2>
<div class="card" style="max-width:520px"><p>Email: warmth@teplo-fond.demo</p><p>Телефон: +7 906 669-87-89</p></div></div>`,
  });
}

trailmarket();
smolServices();
ledgerops();
fieldly();
shopbot();
datapine();
northline();
karelia();
teplo();

// Wrap tables for horizontal scroll on small screens
for (const dir of [
  "trailmarket",
  "smol-services",
  "ledgerops",
  "fieldly",
  "shopbot-pro",
  "datapine",
  "northline",
  "karelia-escape",
  "teplo-fond",
]) {
  const folder = path.join(ROOT, dir);
  for (const file of fs.readdirSync(folder)) {
    if (!file.endsWith(".html")) continue;
    const full = path.join(folder, file);
    let html = fs.readFileSync(full, "utf8");
    html = html.replace(
      /<table class="table">([\s\S]*?)<\/table>/g,
      '<div class="table-wrap"><table class="table">$1</table></div>'
    );
    fs.writeFileSync(full, html, "utf8");
  }
}

console.log("Generated multipage demos for 9 case sites.");
