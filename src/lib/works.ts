import type { Work } from '../types/work';

export const SITE_URL = 'https://koroke-works.pages.dev';

/** 作品のカテゴリを返す（明示 category 優先、無ければ画像パスから推定） */
export function getCategory(w: Work): string {
  if (w.category) return w.category;
  if (w.imageUrl.includes('/game/')) return 'ゲーム';
  if (w.imageUrl.includes('/cg/')) return 'CG集';
  if (w.imageUrl.includes('/comic/')) return 'コミック';
  return 'その他';
}

/** fanzaUrl から FANZA の content_id (cid) を取り出す。個別ページの URL キーに使う。 */
export function getCid(w: Work): string | null {
  const m = w.fanzaUrl.match(/cid=([a-z0-9_]+)/);
  return m ? m[1] : null;
}

/** 作品個別ページのサイト内パス */
export function workPath(w: Work): string {
  return `/works/${getCid(w)}`;
}
