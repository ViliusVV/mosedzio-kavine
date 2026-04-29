# Menu Redesign — Modern Dark Bistro Web View

**Status:** Approved (design phase)
**Date:** 2026-04-29
**Scope:** Web (`/`, `/[lang]/menu`, `/[lang]/contacts`, `/[lang]/workhours`) + shared chrome
**Out of scope:** `/[lang]/print`, `src/components/menu.tsx` (`MenuFront`/`MenuBack`), print backgrounds, `menu.json` data shape, `middleware.ts`, `sitemap.xml`, `robots.txt`

## Goal

Replace the current web menu — which mirrors the A4 print menu and feels dated — with a dark-bistro aesthetic, a sticky chip-based section nav, and a lighter brand-coherent variant for the contacts and workhours pages. The print page (`Ctrl+P` target) must continue to render the existing `MenuFront`/`MenuBack` components unchanged.

## Visual Language

| Token | Dark (menu) | Light (contacts, workhours) |
| --- | --- | --- |
| Surface | `#1d1814` | `#f6efe3` |
| Text | `#efe5d3` | `#2b211a` |
| Accent | `#d8a657` (gold) | `#a14a2a` (terracotta) |
| Display font | Playfair Display (`next/font/google`) | Same |
| Body font | Geist Sans (existing) | Same |

Item names render in italic display serif; prices render in tabular gold/terracotta. Section dividers use a 32px × 2px accent rule under each section heading.

## Components

### New

- **`src/components/menu-web.tsx`** — server component. Renders the menu page body: hero, chip nav, all sections. Iterates `Object.entries(menuData)` from `src/data/menu.json` once, producing both chips and sections in declaration order. Each section uses the group's `title` (localised via existing `LocalisedString` lookup) and the optional `note` as a subtitle below the title.
- **`src/components/menu-chip-nav.tsx`** — `'use client'` component. Receives `{ id, label }[]` for each section. Renders a sticky horizontally-scrolling pill bar. On click, smooth-scrolls to `#<id>`. Uses `IntersectionObserver` to highlight the chip whose section is currently in view and to auto-scroll the chip bar so the active chip stays visible on phones.

### Modified

- **`src/components/page-template.tsx`** — adds `theme: "dark" | "light"` prop, default `"light"`. Swaps surface, text, and footer colour classes based on theme. Footer copy unchanged.
- **`src/components/topbar.tsx`** — adds `theme` prop. Dark variant: dark surface, cream text, gold underline + accent text on the active link. Light variant: cream surface, dark text, terracotta accent. Active-link detection stays as-is.
- **`src/components/locale-switcher.tsx`** — uses `currentColor` so it inherits text colour from the surrounding topbar; no API change.
- **`src/app/layout.tsx`** — adds `Playfair_Display` from `next/font/google` next to the existing Geist fonts and exposes it via a `--font-display` CSS variable. `globals.css` (or Tailwind utilities) maps it to a `font-display` class.
- **`src/app/[lang]/menu/page.tsx`** — replaces the `MenuFront`/`MenuBack` + `ScrollHorizontal` body with `<MenuWeb lang={lang}/>` inside `PageTemplate theme="dark"`.
- **`src/app/page.tsx`** — unchanged. Already proxies to `MenuPage` with `lang: "lt"`; picks up the new design automatically.
- **`src/app/[lang]/contacts/page.tsx`** — adopts kicker / serif title / accent rule treatment. `PageTemplate theme="light"`.
- **`src/app/[lang]/workhours/page.tsx`** — same treatment.
- **`src/data/i18n.json`** — adds one new key: `tagline.short` (LT/EN/LV).

### Untouched

- `src/app/[lang]/print/page.tsx`
- `src/components/menu.tsx` (`MenuFront`, `MenuBack`, `MenuGroup`, `MenuWrapper`)
- `public/menu_front_bg.png`, `public/menu_back_bg.png`
- `src/middleware.ts`, `public/sitemap.xml`, `public/robots.txt`
- `src/data/menu.json` (data shape and ordering)

## Page Structure (`/menu`)

1. **Topbar** (dark variant) — existing nav, dark surface, gold underline on active route.
2. **Hero** — `kicker` ("Mosėdis · Žemaitija"), display-serif `<h1>` with the café name, body-serif tagline from the new `tagline.short` i18n key. ~120–150px tall on desktop, smaller on mobile.
3. **Sticky chip nav** — `position: sticky; top: 0`. Horizontally scrollable pill bar containing one chip per `menu.json` group, in declaration order. The chip text is the group's localised `title`. Active chip uses the gold fill; inactive chips are outlined.
4. **Sections** — vertical stack, one per `menu.json` group, in the same order as the chips. Each section has:
   - Section `<h2>` in display serif (group title, localised).
   - Optional subtitle below in muted cream (group `note`, localised, if present).
   - 32×2px gold accent rule under the heading.
   - Items as rows: italic serif name on the left, optional muted note below the name, gold tabular price on the right. `smallPrice` (when present) renders inline as `{small}€/{full}€`, matching current behaviour.
5. **Allergen notice** — single banner with a gold left border, placed just before the food sections. Driven by the existing `alergens.notice` i18n key. Replaces the inline orange line currently inside `MenuFront`.
6. **Footer** — existing `PageTemplate` footer in dark variant.

The print page is unchanged: a separate route that continues to render `<MenuFront>` and `<MenuBack>` exactly as today.

## Section Ordering

Driven entirely by the order of keys in `src/data/menu.json`. No hardcoded list of section keys exists in the new components. Adding, removing, or reordering a group in `menu.json` automatically updates both the chip bar and the rendered sections.

## Light Variant (`/contacts`, `/workhours`)

These pages keep their existing copy and information. Visual changes only:

- Cream surface, dark text, terracotta accent.
- Page heading uses the same display-serif `<h1>` + accent rule pattern as menu sections.
- No kicker on these pages — page heading is the single localised label (`working.hours`, `contacts`) followed by the accent rule.
- Map iframe on contacts retains current dimensions; the surrounding card gets cream/terracotta styling.

## Translation

- Group titles and notes already live in `menu.json` and are read directly. No new translations needed for sections.
- New i18n key in `src/data/i18n.json`: `tagline.short` (LT/EN/LV) for the menu hero subtitle.
- All other copy reuses existing keys.

## Behaviour Details

- **Smooth-scroll target offset:** chip clicks scroll the section's heading just below the sticky chip bar — calculate offset from chip-bar height at click time.
- **Active chip detection:** the section whose top is closest to the chip bar's bottom edge is "active". Use a single `IntersectionObserver` with a `rootMargin` that accounts for the chip-bar height.
- **Reduced motion:** respect `prefers-reduced-motion` — fall back to instant jump instead of smooth scroll.
- **Locale switching:** changing locale via `LocaleSwitcher` reloads the same path — chip ids are derived from the menu.json group key (stable, locale-independent), so the user lands on the same section.
- **Server vs client split:** `menu-web.tsx` is a server component. It computes `chips` ({ id, label } per group) and renders the static section list. It hands `chips` to `<MenuChipNav>` (client) for the interactive sticky bar. No menu data crosses to the client beyond chip ids and labels.

## Constraints / Non-Goals

- **No new dependencies.** Tailwind v4 utilities, `next/font/google`, and existing libs only.
- **No food photography.** Text-only design; can be revisited later if assets become available.
- **No light/dark toggle.** Dark for menu, light for contacts/workhours, fixed.
- **No changes to `menu.json`.** Adding a `category` cluster field, group ordering tweaks, or a separate spirits taxonomy are explicitly deferred so the data file remains the single ordering authority.
- **No automated tests.** Project has no test suite; implementation will be verified by `npm run build`, `npm run lint`, and manual browser checks.

## Verification

- `npm run build` — succeeds.
- `npm run lint` — clean.
- Manual: `/lt`, `/en`, `/lv`, `/lt/menu`, `/lt/contacts`, `/lt/workhours`, `/lt/print` rendered in browser. `/lt/print` must look pixel-identical to current production.
- Manual: chip nav verified on a narrow viewport (≤ 380px) and on desktop. Sticky behaviour verified, active-chip tracking verified.

## Files Touched (summary)

```
modified:   src/app/layout.tsx
modified:   src/app/[lang]/menu/page.tsx
modified:   src/app/[lang]/contacts/page.tsx
modified:   src/app/[lang]/workhours/page.tsx
modified:   src/components/page-template.tsx
modified:   src/components/topbar.tsx
modified:   src/components/locale-switcher.tsx
modified:   src/data/i18n.json
new:        src/components/menu-web.tsx
new:        src/components/menu-chip-nav.tsx
unchanged:  src/app/[lang]/print/page.tsx
unchanged:  src/components/menu.tsx
unchanged:  src/data/menu.json
```
