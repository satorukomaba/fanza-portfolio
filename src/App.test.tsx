import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
