import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ビルド後に各作品の静的 HTML を生成する。
// 目的: SPA でもクローラ（特に JS を実行しない Bing 等）が作品ごとの
// title / description / OGP / 構造化データを読めるようにする。
// 本文スニペットは露骨画像を含めず、テキストと FANZA リンクのみ（R-18 のゲート前チラ見え回避）。
const SITE_URL = 'https://koroke-works.pages.dev';

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function getCid(fanzaUrl) {
  const m = String(fanzaUrl).match(/cid=([a-z0-9_]+)/);
  return m ? m[1] : null;
}
function getCategory(w) {
  if (w.category) return w.category;
  if (w.imageUrl.includes('/game/')) return 'ゲーム';
  if (w.imageUrl.includes('/cg/')) return 'CG集';
  if (w.imageUrl.includes('/comic/')) return 'コミック';
  return 'その他';
}

export function renderWorkHtml(template, work, siteUrl = SITE_URL) {
  const cid = getCid(work.fanzaUrl);
  const category = getCategory(work);
  const pageUrl = `${siteUrl}/works/${cid}`;
  const linkUrl = work.affiliateUrl || work.fanzaUrl;
  const title = `${work.title} | Korokke 同人ポートフォリオ`;
  const description =
    work.description || `${category}作品「${work.title}」。FANZA 同人サークル Korokke の作品ページ。`;

  // テンプレート（ビルド済み index.html）の既存 SEO タグを除去
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '');

  // 販売者は FANZA 側なので価格前提の Product/Offer は使わず、実態に即した CreativeWork にする
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    image: work.imageUrl,
    ...(work.description ? { description: work.description } : {}),
    genre: category,
    url: pageUrl,
    creator: { '@type': 'Organization', name: 'Korokke' },
  };

  const head =
    `\n    <title>${escapeHtml(title)}</title>` +
    `\n    <meta name="description" content="${escapeAttr(description)}">` +
    `\n    <link rel="canonical" href="${escapeAttr(pageUrl)}">` +
    `\n    <meta property="og:type" content="article">` +
    `\n    <meta property="og:title" content="${escapeAttr(title)}">` +
    `\n    <meta property="og:description" content="${escapeAttr(description)}">` +
    `\n    <meta property="og:url" content="${escapeAttr(pageUrl)}">` +
    `\n    <meta property="og:image" content="${escapeAttr(work.imageUrl)}">` +
    `\n    <meta name="twitter:card" content="summary_large_image">` +
    `\n    <meta name="twitter:title" content="${escapeAttr(title)}">` +
    `\n    <meta name="twitter:description" content="${escapeAttr(description)}">` +
    `\n    <meta name="twitter:image" content="${escapeAttr(work.imageUrl)}">` +
    `\n    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n`;
  html = html.replace('</head>', `${head}</head>`);

  // 本文スニペット（クローラ向け。React マウント時に置き換わる。露骨画像は入れない）
  const rel = work.affiliateUrl ? 'sponsored noopener' : 'noopener noreferrer';
  const body =
    `<main><h1>${escapeHtml(work.title)}</h1>` +
    `<p>${escapeHtml(description)}</p>` +
    `<a href="${escapeAttr(linkUrl)}" rel="${rel}" target="_blank">FANZAで見る</a></main>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  return html;
}

async function main() {
  const cwd = process.cwd();
  const dist = path.join(cwd, 'dist');
  const template = await fs.readFile(path.join(dist, 'index.html'), 'utf-8');
  const works = JSON.parse(await fs.readFile(path.join(cwd, 'src', 'data', 'works.json'), 'utf-8'));

  let n = 0;
  for (const w of works) {
    const cid = getCid(w.fanzaUrl);
    if (!cid) continue;
    const dir = path.join(dist, 'works', cid);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), renderWorkHtml(template, w, SITE_URL), 'utf-8');
    n++;
  }
  console.log(`Generated ${n} static work pages under dist/works/.`);
}

// スクリプトとして直接実行されたときだけ main を走らせる（テストからの import では走らせない）
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
