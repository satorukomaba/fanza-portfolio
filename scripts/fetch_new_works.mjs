import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET_URL = 'https://www.dmm.co.jp/dc/doujin/-/list/=/article=maker/exclude_ai=0/id=208444/';
const AFFILIATE_ID = 'korokke-001';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const COOKIE = 'ckcy=1; age_check_done=1; isAdult=1';

const PROJECT_ROOT = process.cwd();
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'works.json');

// Helper to decode HTML entities
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

// Generate affiliate link
function generateAffiliateUrl(url) {
  const encodedUrl = encodeURIComponent(url);
  return `https://al.dmm.co.jp/?lurl=${encodedUrl}&af_id=${AFFILIATE_ID}&ch=search_link&ch_id=package_text`;
}

async function fetchPage(url) {
  console.log(`Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Cookie': COOKIE,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  // DMM/FANZA seems to be using UTF-8 now, or fetch handles it automatically.
  return res.text();
}

async function main() {
  // 1. Read existing data
  let works = [];
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    works = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read works.json, starting empty.', err);
  }

  // Create a Set of existing CIDs to check for duplicates
  const existingCids = new Set();
  let maxId = 0;
  works.forEach(w => {
    if (w.id > maxId) maxId = w.id;
    const match = w.fanzaUrl.match(/cid=([a-z0-9_]+)/);
    if (match) existingCids.add(match[1]);
  });

  console.log(`Loaded ${works.length} existing works. Max ID: ${maxId}`);

  // 2. Fetch the list page
  const html = await fetchPage(TARGET_URL);

  // 3. Parse items
  // Strategy: Find all unique CIDs on the page first
  const cidRegex = /cid=([a-z0-9_]+)/g;
  const foundCids = [];
  let match;
  while ((match = cidRegex.exec(html)) !== null) {
    if (!foundCids.includes(match[1])) {
        foundCids.push(match[1]);
    }
  }

  // REVERSE the order so we process the OLDEST found work first
  // and the NEWEST work gets the highest ID.
  foundCids.reverse();

  console.log(`Found ${foundCids.length} unique CIDs on the page (reversed order for processing).`);

  const newItems = [];

  for (const cid of foundCids) {
    if (existingCids.has(cid)) continue;

    console.log(`New work found: ${cid}`);

    const url = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${cid}/`;
    
    // Strategy: Find image URL directly using CID, which usually appears in the image path
    // Example: https://doujin-assets.dmm.co.jp/digital/game/d_738043/d_738043pl.jpg
    
    // Regex to find image tag with CID in src
    // We look for src containing the CID and 'pl' or 'pr' (package large/promo), and capture the whole src and alt
    const imgRegex = new RegExp(`<img[^>]+src="([^"]*${cid}(?:pl|pr)\\.jpg)"[^>]*alt="([^"]+)"`, 'i');
    const itemMatch = html.match(imgRegex);

    let title = `New Work ${cid}`;
    let imageUrl;
    
    if (itemMatch) {
        imageUrl = itemMatch[1];
        title = decodeHtmlEntities(itemMatch[2]);
    } else {
        // Try relaxed search: just find the image URL with CID
        const simpleImgMatch = html.match(new RegExp(`src="([^"]*${cid}(?:pl|pr)\\.jpg)"`, 'i'));
        if (simpleImgMatch) {
            imageUrl = simpleImgMatch[1];
            // Try to find title from link text if alt is missing or extraction failed
            const linkTextMatch = html.match(new RegExp(`<a[^>]*${cid}[^>]*>([\\s\\S]*?)</a>`, 'i'));
            if (linkTextMatch) {
                 // Remove tags from link text
                 title = decodeHtmlEntities(linkTextMatch[1].replace(/<[^>]+>/g, '').trim());
            }
        } else {
            console.warn(`Could not find image for ${cid}, skipping.`);
            continue;
        }
    }

    // Convert 'pl.jpg' (package large) to 'pr.jpg' (promo) if that's the convention, 
    // but 'pr' is often better for portfolios. Let's use what we found, or replace if 'pl'
    // The existing json uses 'pr.jpg'.
    if (imageUrl.includes('pl.jpg')) {
        imageUrl = imageUrl.replace('pl.jpg', 'pr.jpg');
    }

    // Detect category from imageUrl
    let category = 'その他';
    if (imageUrl.includes('/game/')) category = 'ゲーム';
    else if (imageUrl.includes('/cg/')) category = 'CG集';
    else if (imageUrl.includes('/comic/')) category = 'コミック';

    maxId++;
    const newItem = {
      id: maxId,
      title: title.trim(),
      description: "", 
      imageUrl: imageUrl,
      fanzaUrl: url,
      affiliateUrl: generateAffiliateUrl(url),
      category: category
    };
    
    newItems.push(newItem);
    works.push(newItem);
    existingCids.add(cid); // Prevent duplicates in current run
  }

  if (newItems.length > 0) {
    console.log(`Adding ${newItems.length} new works:`);
    newItems.forEach(w => console.log(`- [${w.id}] ${w.title}`));
    
    await fs.writeFile(DATA_PATH, JSON.stringify(works, null, 2), 'utf-8');
    console.log('works.json updated.');
  } else {
    console.log('No new works found.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
