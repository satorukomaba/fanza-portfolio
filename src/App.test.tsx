import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  // 年齢確認を通過した状態にして本編（Hero + 作品グリッド）を描画させる
  localStorage.setItem('age_verified', 'true');
});

describe('Hero のナビゲーション', () => {
  it('「作品一覧を見る」のアンカー先 (#works) がページ内に実在する', () => {
    render(<App />);

    const link = screen.getByRole('link', { name: '作品一覧を見る' });
    const href = link.getAttribute('href') ?? '';
    expect(href).toBe('#works');

    // href が指す id を持つ要素が存在すること（=クリックでスクロール先がある）
    const targetId = href.replace('#', '');
    expect(document.getElementById(targetId)).not.toBeNull();
  });

  it('カテゴリ変更で表示件数が初期値 (12件) にリセットされる', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 初期表示は 12 件
    expect(screen.getAllByText('詳細を見る')).toHaveLength(12);

    // さらに表示 → 24 件
    await user.click(screen.getByRole('button', { name: /さらに表示/ }));
    await waitFor(() => expect(screen.getAllByText('詳細を見る')).toHaveLength(24));

    // カテゴリ変更 (CG集は12件超) → 12 件にリセットされる
    await user.click(screen.getByRole('button', { name: 'CG集' }));
    await waitFor(() => expect(screen.getAllByText('詳細を見る')).toHaveLength(12));
  });

  it('JSON-LD の作品アイテムに description が含まれる', () => {
    render(<App />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const data = JSON.parse(script!.textContent ?? '{}');
    const items = data.itemListElement as Array<{ item: { description?: string } }>;
    const withDescription = items.filter((e) => !!e.item.description);
    expect(withDescription.length).toBeGreaterThan(0);
  });

  it('「Webサイトへ」は自サイトではなく FANZA サークルページへの外部リンク', () => {
    render(<App />);

    const link = screen.getByRole('link', { name: 'Webサイトへ' });
    const href = link.getAttribute('href') ?? '';

    expect(href).toContain('dmm.co.jp');
    expect(href).toContain('id=208444');
    expect(href).not.toContain('koroke-works.pages.dev');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel') ?? '').toContain('noopener');
  });
});
