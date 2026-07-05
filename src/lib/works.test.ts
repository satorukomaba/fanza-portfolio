import { describe, it, expect } from 'vitest';
import type { Work } from '../types/work';
import { getCid, getCategory, workPath } from './works';

const w = (o: Partial<Work>): Work => ({
  id: 1,
  title: 't',
  description: '',
  imageUrl: '',
  fanzaUrl: '',
  ...o,
});

describe('getCid', () => {
  it('fanzaUrl から cid を抽出する', () => {
    expect(getCid(w({ fanzaUrl: 'https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_776567/' }))).toBe('d_776567');
  });
  it('cid が無ければ null', () => {
    expect(getCid(w({ fanzaUrl: 'https://example.com/' }))).toBeNull();
  });
});

describe('workPath', () => {
  it('/works/:cid のパスを返す', () => {
    expect(workPath(w({ fanzaUrl: 'https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_1/' }))).toBe('/works/d_1');
  });
});

describe('getCategory', () => {
  it('category があればそれを返す', () => {
    expect(getCategory(w({ category: 'ゲーム', imageUrl: 'https://x/digital/cg/d_1/d_1pr.jpg' }))).toBe('ゲーム');
  });
  it('imageUrl のパスから推定する', () => {
    expect(getCategory(w({ imageUrl: 'https://x/digital/cg/d_1/d_1pr.jpg' }))).toBe('CG集');
  });
});
