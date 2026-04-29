# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Next.js 15 with Turbopack) on `localhost:3000`
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — `next lint` (ESLint flat config extending `next/core-web-vitals` + `next/typescript`)

There is no test suite.

## Project Overview

Marketing/info site for **Mosėdžio kavinė** (a café in Mosėdis, Lithuania), production domain `mosedziokavine.lt`. Static-rendered Next.js App Router site with three locales and a printable menu.

## Architecture

### Locales (`src/i18n-config.ts`)

- Locales: `lt` (default), `en`, `lv`. The default `lt` is the only locale indexed (`public/robots.txt` disallows `/lv` and `/en`).
- Routes live under `src/app/[lang]/...`. `generateStaticParams` in `src/app/layout.tsx` pre-renders all three.
- `src/app/page.tsx` (the `/` route) renders the `lt` menu directly so the bare domain shows the LT menu without redirecting.
- Translations are stored in `src/data/i18n.json` (one object per locale). Use `T(lang, key)` from `src/utils/lang.ts` — it falls back through `lt` then the raw key. `StringKey` is the union of keys and is the typed contract for translation calls.
- Menu items in `src/data/menu.json` carry their own `{lt, en}` `LocalisedString` shape (no `lv`); `MenuGroup` in `src/components/menu.tsx` falls back to `en` then `lt` when the active locale is missing.

### Proxy (`src/proxy.ts`)

Next 16's proxy file (formerly "middleware" — the file convention was renamed). The proxy does **not** handle locale prefixing for normal pages. It only intercepts `/qr-redirect` and redirects the visitor to `/<negotiated-locale>` based on `Accept-Language`. The matcher excludes `api`, `_next/static`, `_next/image`, and `favicon.ico`. Don't extend this to rewrite all routes — pages already cover the per-locale paths via `[lang]`.

### Pages

- `[lang]/menu` — main menu (front + back) wrapped in `ScrollHorizontal` so the fixed-width A4 menu can scroll on small screens.
- `[lang]/contacts`, `[lang]/workhours` — info pages using `PageTemplate` (which provides the topbar + footer).
- `[lang]/print` — bare front+back menu with no chrome, intended for QR/print contexts. Disallowed in `robots.txt`.
- `dev/page.tsx` — internal helper page; also disallowed in `robots.txt`.

### Menu rendering (`src/components/menu.tsx`)

`MenuFront`/`MenuBack` render a fixed `297mm × 210mm` (landscape A4) white canvas with positioned background images from `/public/menu_front_bg.png` and `/menu_back_bg.png`. Layout uses Tailwind flex columns; `MenuGroup`'s `gap`/`textSize` props control density per column. When adjusting layout, remember the menu must remain print-accurate at A4 — the `[lang]/print` page is what gets photographed/printed.

### Static SEO assets

`public/robots.txt` and `public/sitemap.xml` are hand-maintained. When adding a new public page, add it to `sitemap.xml` (LT only) and confirm it isn't in the `Disallow` list.

## Conventions

- Path alias `@/*` → `src/*` (set in `tsconfig.json`).
- Pages that take a locale use the `PageParams` type from `src/types.ts` (`{ params: Promise<{ lang: Locale }> }`) — `params` must be awaited.
- Tailwind v4 via `@tailwindcss/postcss`; no `tailwind.config` file — utility classes are used directly.
- Footer year in `PageTemplate` derives from `Date().slice(11, 15)` — leave as-is unless replacing both year display and copyright handling.