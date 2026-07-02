import fs from 'node:fs/promises';
import path from 'node:path';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const COOKIE = 'ckcy=1; age_check_done=1; isAdult=1';

const PROJECT_ROOT = process.cwd();
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'works.json');

const MAX_LEN = 200; // カード/モーダル表示用に長すぎる説明は句点で切る

function decodeHtmlEntities(str) {
  if (!str) return str;
  return str
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ');
}

function truncateAtSentence(text, maxLen) {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastStop = cut.lastIndexOf('。');
  return lastStop > 40 ? cut.slice(0, lastStop + 1) : cut + '…';
}

function pickBodySection(text) {
  // 「■作品内容 … ■収録内容 … ■ファイル形式 …」形式から本文セクションを抽出
  if (!text.includes('■')) return text;
  const sections = text.split('■').map((s) => s.trim()).filter(Boolean);
  const preferred = sections.find((s) => /^(作品内容|あらすじ|ストーリー|内容紹介)/.test(s));
  const body = preferred || sections[0];
  return body.replace(/^(作品内容|あらすじ|ストーリー|内容紹介)[:：]?\s*/, '');
}

function extractDescription(html) {
  // 1. og:description（FANZA は作品紹介文が入る）
  const og = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/i)
    || html.match(/<meta[^>]+content="([^"]*)"[^>]+property="og:description"/i);
  // 2. フォールバック: meta description
  const meta = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)
    || html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);

  const raw = (og && og[1]) || (meta && meta[1]) || '';
  const text = decodeHtmlEntities(raw).replace(/\s+/g, ' ').trim();
  return text ? truncateAtSentence(pickBodySection(text), MAX_LEN) : '';
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Cookie': COOKIE } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity;

  const works = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
  const targets = works.filter((w) => !w.description).slice(0, limit);
  console.log(`Targets without description: ${targets.length}${dryRun ? ' (dry run)' : ''}`);

  let updated = 0;
  for (const w of targets) {
    try {
      const html = await fetchPage(w.fanzaUrl);
      const desc = extractDescription(html);
      if (desc) {
        console.log(`[${w.id}] ${w.title}\n  -> ${desc}`);
        if (!dryRun) {
          w.description = desc;
          updated++;
        }
      } else {
        console.warn(`[${w.id}] description not found, skipped.`);
      }
    } catch (err) {
      console.warn(`[${w.id}] fetch failed: ${err.message}`);
    }
    await sleep(1500); // 連続アクセスを避ける
  }

  if (!dryRun && updated > 0) {
    await fs.writeFile(DATA_PATH, JSON.stringify(works, null, 2), 'utf-8');
    console.log(`works.json updated (${updated} works).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
