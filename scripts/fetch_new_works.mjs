import fs from 'node:fs/promises';
import path from 'node:path';

// DMM アフィリエイト API (公式 Web API) で新作を取得する。
// 旧実装は FANZA のリストページをスクレイピングしていたが、GitHub Actions の
// 海外 IP がリージョンブロックされ CID 0 件 →「新作なし」と誤判定していたため
// API 経由に移行した。
//
// 必要な環境変数:
//   DMM_API_ID       : https://affiliate.dmm.com/api/ で発行する API ID
//   DMM_AFFILIATE_ID : API 用アフィリエイト ID（末尾 990〜999 のもの）
const API_ENDPOINT = 'https://api.dmm.com/affiliate/v3/ItemList';
const MAKER_ID = '208444'; // FANZA 同人サークル ID

const API_ID = process.env.DMM_API_ID;
const AFFILIATE_ID = process.env.DMM_AFFILIATE_ID;

// 保存する affiliateUrl は既存 58 件と同じ形式で生成する。
// API リクエスト用の 990 番台 ID とは別に、リンク表示用の ID を使う
// （API が返す affiliateURL は al.fanza.co.jp / af_id=xxx-990 形式で既存と食い違うため）。
const LINK_AFFILIATE_ID = process.env.DMM_LINK_AFFILIATE_ID || 'korokke-001';

const PROJECT_ROOT = process.cwd();
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'works.json');

function generateAffiliateUrl(url) {
  const encodedUrl = encodeURIComponent(url);
  return `https://al.dmm.co.jp/?lurl=${encodedUrl}&af_id=${LINK_AFFILIATE_ID}&ch=search_link&ch_id=package_text`;
}

// 画像 URL のパスからカテゴリを推定（既存データと同じ規則）
function detectCategory(imageUrl) {
  if (imageUrl.includes('/game/')) return 'ゲーム';
  if (imageUrl.includes('/cg/')) return 'CG集';
  if (imageUrl.includes('/comic/')) return 'コミック';
  return 'その他';
}

async function fetchItems() {
  const params = new URLSearchParams({
    api_id: API_ID,
    affiliate_id: AFFILIATE_ID,
    site: 'FANZA',
    service: 'doujin',
    floor: 'digital_doujin',
    article: 'maker',
    article_id: MAKER_ID,
    sort: 'date',
    hits: '100',
    output: 'json',
  });

  const res = await fetch(`${API_ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  const json = await res.json();

  const status = json?.result?.status;
  if (status !== 200) {
    throw new Error(`API returned status ${status}: ${JSON.stringify(json?.result?.message ?? json).slice(0, 300)}`);
  }
  return json.result.items ?? [];
}

async function main() {
  if (!API_ID || !AFFILIATE_ID) {
    console.error('DMM_API_ID / DMM_AFFILIATE_ID を環境変数に設定してください。');
    console.error('API ID の発行: https://affiliate.dmm.com/api/');
    process.exit(1);
  }

  // 1. 既存データを読み込み
  let works = [];
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    works = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read works.json, starting empty.', err);
  }

  const existingCids = new Set();
  let maxId = 0;
  works.forEach((w) => {
    if (w.id > maxId) maxId = w.id;
    const match = w.fanzaUrl.match(/cid=([a-z0-9_]+)/);
    if (match) existingCids.add(match[1]);
  });

  console.log(`Loaded ${works.length} existing works. Max ID: ${maxId}`);

  // 2. API から作品一覧を取得
  const items = await fetchItems();
  console.log(`API returned ${items.length} items.`);

  // 作品が 1 件も返らないのは異常（API 側の障害・パラメータ不備など）。
  // 「新作なし」と区別できないため、黙って成功せずエラーで落とす。
  if (items.length === 0) {
    console.error('API returned no items. Check api_id / affiliate_id / maker id.');
    process.exit(1);
  }

  // 3. 発売日の古い順に処理して、新しい作品ほど大きい ID を割り当てる
  const sorted = [...items].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const newItems = [];
  for (const item of sorted) {
    const cid = item.content_id;
    if (!cid || existingCids.has(cid)) continue;

    const imageUrl = item.imageURL?.large || item.imageURL?.list || '';
    if (!imageUrl) {
      console.warn(`[${cid}] no image URL, skipped.`);
      continue;
    }

    maxId++;
    const fanzaUrl = `https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=${cid}/`;
    const newItem = {
      id: maxId,
      title: item.title,
      description: '', // 説明文は scripts/fetch_descriptions.mjs でローカル取得
      imageUrl,
      fanzaUrl,
      affiliateUrl: generateAffiliateUrl(fanzaUrl),
      category: detectCategory(imageUrl),
    };

    newItems.push(newItem);
    works.push(newItem);
    existingCids.add(cid);
  }

  if (newItems.length > 0) {
    console.log(`Adding ${newItems.length} new works:`);
    newItems.forEach((w) => console.log(`- [${w.id}] ${w.title}`));

    await fs.writeFile(DATA_PATH, JSON.stringify(works, null, 2), 'utf-8');
    console.log('works.json updated.');
  } else {
    console.log('No new works found.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
