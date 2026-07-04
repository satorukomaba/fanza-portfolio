# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

FANZA 同人作品のポートフォリオサイト（`koroke-works.pages.dev`）。Vite 6 + React 19 + TypeScript + Chakra UI v2。

## ビルドと検証

- `npm run test`（Vitest + React Testing Library, jsdom）、`npm run lint`（ESLint 9 フラット構成）、`npm run build`（`tsc && vite build`）の3点で検証する。
- テストファイル（`*.test.tsx` / `src/test/`）は `tsconfig.json` の exclude 対象 — `npm run build` の型チェックには含まれない。
- `tsconfig.json` は `strict` + `noUnusedLocals` + `noUnusedParameters`。未使用の import / 変数はビルドを落とすので残さない。
- ローカル確認は `npm run dev`（Vite dev server）。実ブラウザ検証には Playwright（devDependencies）が使える。

## UI スタイリング

- UI は **Chakra UI v2** のコンポーネントで書く。配色・角丸・フォント等のカスタムは `src/theme.ts`（`extendTheme`）に集約。
- Tailwind は設定済みだが補助的（`animation-delay` / confetti アニメーション程度）。新規 UI に Tailwind クラスは使わず Chakra に寄せる。
- エントリポイントは `src/main.tsx`。`src/main.ts`・`src/counter.ts`・`src/typescript.svg`・`public/vite.svg` は Vite テンプレートの残骸で未使用。

## コンテンツデータ

- 作品データは `src/data/works.json`（型は `src/types/work.ts` の `Work`）。手動編集して構わない。
- `npm run fetch-works`（`scripts/fetch_new_works.mjs`）は **DMM アフィリエイト API**（`api.dmm.com`）で新作を取得し、**新規 CID を追記するだけ**で既存エントリは保持する。環境変数 `DMM_API_ID` / `DMM_AFFILIATE_ID`（API 用・末尾 990〜999 の ID）が必須。
- `scripts/fetch_descriptions.mjs` は description が空の作品の説明文を FANZA 詳細ページから取得する（`--dry-run` / `--limit=N` 対応）。
- GitHub Actions（`.github/workflows/update-works.yml`）が毎日 JST 0:00 に `fetch-works` を実行し、差分があれば `works.json` を自動コミットする。リポジトリ secrets に `DMM_API_ID` / `DMM_AFFILIATE_ID` が必要。
- **FANZA の Web ページは海外 IP をリージョンブロックする**。GitHub Actions からページを直接 fetch するコードは動かない（API は可）。説明文取得は日本 IP のローカルで実行する。

## コミュニケーション

- レビュー結果・レポート・調査まとめなど、**ユーザーに読んでもらう成果物は HTML ファイルにして送る**（チャットには要点だけ書く）。

## デプロイ

- `main` への push で **Cloudflare Pages が本番へ自動デプロイ**する。main を直接触るときは即公開になる点に注意。
- `package.json` の `npm run deploy`（gh-pages）はレガシーで未使用。デプロイに使わない。
- ブランチ / PR 運用は状況次第（固定ルールなし）。
