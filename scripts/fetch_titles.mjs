// Fetch official titles from FANZA pages and update src/data/works.json
// Requires Node 18+ (global fetch)

import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'works.json');

const COOKIE = 'ckcy=1; age_check_done=1; isAdult=1';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

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

function extractTitle(html) {
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  if (ogMatch?.[1]) return decodeHtmlEntities(ogMatch[1]).trim();
  const tMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (tMatch?.[1]) return decodeHtmlEntities(tMatch[1]).replace(/\s+/g, ' ').trim();
  return null;
}

async function fetchTitle(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Cookie': COOKIE,
      'Accept-Language': 'ja,en;q=0.9',
    },
  });
  const html = await res.text();
  return extractTitle(html);
}

async function main() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);

  // Target recent added ids (>= 13)
  const targets = data.filter(w => typeof w.id === 'number' && w.id >= 13);
  const updates = [];

  for (const w of targets) {
    try {
      const title = await fetchTitle(w.fanzaUrl);
      if (title && !title.startsWith('Welcome to Japan')) {
        updates.push({ id: w.id, before: w.title, after: title });
        w.title = title;
      }
    } catch (err) {
      // ignore fetch errors; keep existing title
    }
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  for (const u of updates) {
    console.log(`${u.id}: ${u.before} -> ${u.after}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


