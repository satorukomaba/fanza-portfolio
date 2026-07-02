# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

FANZA 同人作品のポートフォリオサイト（`koroke-works.pages.dev`）。Vite 6 + React 19 + TypeScript + Chakra UI v2。

## ビルドと検証

- Lint・テストは無し。**変更の検証は `npm run build`（`tsc && vite build`）が唯一の経路** — 型エラーはここで出る。
- `tsconfig.json` は `strict` + `noUnusedLocals` + `noUnusedParameters`。未使用の import / 変数はビルドを落とすので残さない。
- ローカル確認は `npm run dev`（Vite dev server）。

## UI スタイリング

- UI は **Chakra UI v2** のコンポーネントで書く。配色・角丸・フォント等のカスタムは `src/theme.ts`（`extendTheme`）に集約。
- Tailwind は設定済みだが補助的（`animation-delay` / confetti アニメーション程度）。新規 UI に Tailwind クラスは使わず Chakra に寄せる。
- エントリポイントは `src/main.tsx`。`src/main.ts`・`src/counter.ts`・`src/typescript.svg`・`public/vite.svg` は Vite テンプレートの残骸で未使用。

## コンテンツデータ

- 作品データは `src/data/works.json`（型は `src/types/work.ts` の `Work`）。手動編集して構わない。
- `npm run fetch-works`（`scripts/fetch_new_works.mjs`）が FANZA/DMM をスクレイピングし、**新規 CID を追記するだけ**で既存エントリは保持する（手動で入れた説明文などは消えない）。
- GitHub Actions（`.github/workflows/update-works.yml`）が毎日 JST 0:00 に `fetch-works` を実行し、差分があれば `works.json` を自動コミットする。
- スクレイパは FANZA の HTML 構造と成人向け Cookie（`age_check_done=1; isAdult=1`）への正規表現依存で壊れやすい。サイト構造が変わると抽出が失敗する。

## デプロイ

- `main` への push で **Cloudflare Pages が本番へ自動デプロイ**する。main を直接触るときは即公開になる点に注意。
- `package.json` の `npm run deploy`（gh-pages）はレガシーで未使用。デプロイに使わない。
- ブランチ / PR 運用は状況次第（固定ルールなし）。
