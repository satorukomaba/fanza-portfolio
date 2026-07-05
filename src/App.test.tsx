import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

beforeEach(() => {
  // 年齢確認を通過した状態にして本編（Hero + 作品グリッド）を描画させる
  localStorage.setItem('age_verified', 'true');
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

// 作品カード = href が /works/ で始まる内部リンク
const workCardLinks = () =>
  screen.getAllByRole('link').filter((a) => (a.getAttribute('href') ?? '').startsWith('/works/'));

describe('トップページ（作品一覧）', () => {
  it('「作品一覧を見る」のアンカー先 (#works) がページ内に実在する', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: '作品一覧を見る' });
    const href = link.getAttribute('href') ?? '';
    expect(href).toBe('#works');
    expect(document.getElementById(href.replace('#', ''))).not.toBeNull();
  });

  it('「Webサイトへ」は自サイトではなく FANZA サークルページへの外部リンク', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: 'Webサイトへ' });
    const href = link.getAttribute('href') ?? '';
    expect(href).toContain('dmm.co.jp');
    expect(href).toContain('id=208444');
    expect(href).not.toContain('koroke-works.pages.dev');
  });

  it('カテゴリ変更で表示件数が初期値 (12件) にリセットされる', async () => {
    const user = userEvent.setup();
    renderAt('/');
    expect(workCardLinks()).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: /さらに表示/ }));
    await waitFor(() => expect(workCardLinks()).toHaveLength(24));
    await user.click(screen.getByRole('button', { name: 'CG集' }));
    await waitFor(() => expect(workCardLinks()).toHaveLength(12));
  });

  it('各作品カードが /works/:cid への内部リンクになっている', () => {
    renderAt('/');
    const hrefs = workCardLinks().map((a) => a.getAttribute('href') ?? '');
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs[0]).toMatch(/^\/works\/d_[a-z0-9_]+$/);
  });
});

describe('作品個別ページ /works/:cid', () => {
  it('cid に対応する作品のタイトルと FANZA アフィリンクを表示する', () => {
    renderAt('/works/d_776567');
    expect(screen.getByRole('heading', { name: '転生したらHだった件3' })).toBeInTheDocument();
    const fanza = screen.getByRole('link', { name: /FANZA/ });
    expect(fanza.getAttribute('href')).toContain('al.dmm.co.jp');
    expect(fanza.getAttribute('rel') ?? '').toContain('sponsored');
  });

  it('Product 構造化データ (JSON-LD) を出力する', () => {
    renderAt('/works/d_776567');
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? '{}');
    expect(data['@type']).toBe('Product');
    expect(data.name).toBe('転生したらHだった件3');
    expect(data.offers?.url).toContain('al.dmm.co.jp');
  });

  it('存在しない cid では「見つかりません」を表示する', () => {
    renderAt('/works/d_does_not_exist');
    expect(screen.getByText(/見つかりません/)).toBeInTheDocument();
  });
});
