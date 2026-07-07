import { describe, it, expect } from 'vitest';
import { renderWorkHtml } from './generate-static-pages.mjs';

const template = `<!doctype html><html lang="ja"><head>
<title>OLD TITLE</title>
<meta name="description" content="old desc">
<meta property="og:title" content="old og">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://koroke-works.pages.dev/">
</head><body><div id="root"></div><script type="module" src="/assets/index-abc.js"></script></body></html>`;

const work = {
  id: 59,
  title: '転生したらHだった件3 "特別版" & more',
  description: '説明文テキスト。',
  imageUrl: 'https://img.example/d_776567pr.jpg',
  fanzaUrl: 'https://www.dmm.co.jp/dc/doujin/-/detail/=/cid=d_776567/',
  affiliateUrl: 'https://al.dmm.co.jp/?lurl=x&af_id=korokke-001',
  category: 'ゲーム',
};

const html = renderWorkHtml(template, work, 'https://koroke-works.pages.dev');

describe('renderWorkHtml', () => {
  it('作品タイトルを title にし、旧タイトルは消す', () => {
    expect(html).toContain('<title>転生したらHだった件3');
    expect(html).not.toContain('OLD TITLE');
  });

  it('canonical を作品ページ URL にする（旧ルート canonical は消す）', () => {
    expect(html).toContain('rel="canonical" href="https://koroke-works.pages.dev/works/d_776567"');
    expect(html).not.toContain('href="https://koroke-works.pages.dev/"');
  });

  it('旧 og:title を消して作品用メタに置き換える', () => {
    expect(html).not.toContain('old og');
    expect(html).toContain('property="og:url" content="https://koroke-works.pages.dev/works/d_776567"');
  });

  it('CreativeWork 構造化データを埋め込む（Product/Offer は使わない）', () => {
    expect(html).toContain('"@type":"CreativeWork"');
    expect(html).not.toContain('"@type":"Product"');
    expect(html).not.toContain('"@type":"Offer"');
  });

  it('本文スニペットは露骨画像を含まず、テキストと FANZA リンクを持つ', () => {
    expect(html).not.toContain('<img');
    expect(html).toContain('説明文テキスト。');
    expect(html).toContain('al.dmm.co.jp');
  });

  it('属性値の " をエスケープして content 属性を壊さない', () => {
    // meta content 内では " が &quot; になっていること
    expect(html).toContain('&quot;特別版&quot;');
    // 生の " で content 属性が途中終了していないこと
    expect(html).not.toContain('content="転生したらHだった件3 "特別版"');
  });

  it('JS バンドルの script は保持する', () => {
    expect(html).toContain('/assets/index-abc.js');
  });
});
