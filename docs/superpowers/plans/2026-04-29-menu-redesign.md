# Menu Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current A4-print-mirroring web menu with a modern dark-bistro layout with sticky chip navigation, while leaving the print page (`/[lang]/print`) and the `MenuFront`/`MenuBack` components in `src/components/menu.tsx` completely untouched. Apply a lighter brand-coherent variant to the contacts and workhours pages.

**Architecture:** Two new components — `menu-web.tsx` (server) renders the menu body from `src/data/menu.json` directly; `menu-chip-nav.tsx` (`'use client'`) handles the sticky horizontally-scrolling chip bar with smooth scroll and IntersectionObserver-driven active state. Existing `PageTemplate`, `Topbar`, and `LocaleSwitcher` gain a `theme: "dark" | "light"` prop (default `"light"`) so the menu page renders dark and the contacts/workhours pages render in the lighter variant. Section ordering and chip set are derived directly from `Object.entries(menuData)` — no hardcoded section list.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `next/font/google`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-04-29-menu-redesign-design.md`

**Conventions for this plan:**
- Every task ends with `npm run build` + `npm run lint` to verify nothing broke. The project has no test suite.
- Per the user's request, **do not commit anything** — they'll inspect each task's diff manually before deciding what to commit.
- All hex colours come from the spec's design tokens table — no improvising.

---

## File Structure

| Path | Action | Responsibility |
| --- | --- | --- |
| `src/app/layout.tsx` | modify | Load Playfair Display + EB Garamond fonts, expose CSS variables |
| `src/app/globals.css` | modify | Drop the `prefers-color-scheme: dark` auto-inversion (themes are now explicit per page); register the new font variables |
| `src/components/page-template.tsx` | modify | Accept `theme` prop, apply theme surface/text/footer colours |
| `src/components/topbar.tsx` | modify | Accept `theme` prop, apply theme colours, keep brand link, support active route highlight |
| `src/components/locale-switcher.tsx` | modify | Accept `accent` className prop, highlight active locale, inherit text colour |
| `src/data/i18n.json` | modify | Add `tagline.short` for LT/EN/LV |
| `src/components/menu-chip-nav.tsx` | create | Sticky horizontally-scrolling chip bar (client) |
| `src/components/menu-web.tsx` | create | Server component rendering hero, chip nav, sections, allergen banner |
| `src/app/[lang]/menu/page.tsx` | modify | Use `<MenuWeb>` inside `<PageTemplate theme="dark">` |
| `src/app/[lang]/contacts/page.tsx` | modify | Light variant treatment |
| `src/app/[lang]/workhours/page.tsx` | modify | Light variant treatment |
| `src/app/[lang]/print/page.tsx` | **untouched** | Continues to render `<MenuFront>`/`<MenuBack>` |
| `src/components/menu.tsx` | **untouched** | Print components stay as-is |
| `src/data/menu.json` | **untouched** | Single source of section ordering |

---

## Task 1: Load fonts and clean globals.css

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

**Why:** The dark-bistro look uses Playfair Display for display headings and EB Garamond for italic item names. We also need to drop the `prefers-color-scheme: dark` auto-inversion in `globals.css` because each page now declares its own theme — if we left the auto-flip in, a user with system dark mode would see the contacts page invert unexpectedly.

- [ ] **Step 1:** Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const garamond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mosėdžio kavinė",
  description: "Mosėdžio kavinė. Grill patikalai, pietūs, maitas išsinešimui.",
  creator: "Vilius Valinskis",
  keywords: ["Mosėdžio kavinė", "Mosėdis", "kavinė", "restoranas", "maistas", "kavinė mosėdyje", "kavinė skuodė", "maistas išsinešimui", "maistas į namus", "mosedžio kavinė", "mosedžio kavinė", "mosedžio restoranas", "restaurant in mosėdis", "restaurant"],
};

export async function generateStaticParams() {
  return [{ lang: "lt" }, { lang: "en" }, { lang: "lv" }];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${garamond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2:** Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --font-display: var(--font-display);
  --font-serif: var(--font-serif);
}

body {
  font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
}
```

- [ ] **Step 3:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: build completes; lint shows no new errors.

---

## Task 2: Add `theme` prop to `PageTemplate`

**Files:**
- Modify: `src/components/page-template.tsx`

**Why:** `PageTemplate` is shared across all non-print pages. Threading a `theme` prop through it (default `"light"`) keeps the contacts/workhours pages working with no other changes while enabling the dark variant for the menu page.

- [ ] **Step 1:** Replace `src/components/page-template.tsx` with:

```tsx
import { Locale } from "@/i18n-config";
import Topbar from "./topbar";

export type PageTheme = "dark" | "light";

const surfaces: Record<PageTheme, string> = {
  dark: "bg-[#1d1814] text-[#efe5d3]",
  light: "bg-[#f6efe3] text-[#2b211a]",
};

const footerColors: Record<PageTheme, string> = {
  dark: "text-[#efe5d3]/60",
  light: "text-[#2b211a]/60",
};

export default function PageTemplate(props: {
  lang: Locale;
  theme?: PageTheme;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const theme: PageTheme = props.theme ?? "light";

  return (
    <div className={`${surfaces[theme]} min-h-screen flex flex-col`}>
      <Topbar lang={props.lang} theme={theme} />
      <main className="flex-1 w-full">{props.children}</main>
      <footer className={`flex flex-wrap items-center justify-center py-8 text-sm ${footerColors[theme]}`}>
        <p>{`UAB "Bartva" ${new Date().getFullYear()}`}</p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Note: at this point `Topbar` does not yet accept `theme`; the build will currently still succeed because TypeScript only complains at the call site if the prop is required. We will add it next so this doesn't drift. If TypeScript errors here about the unknown `theme` prop on `Topbar`, proceed to Task 3 immediately and re-run build after.

---

## Task 3: Add `theme` prop to `Topbar` and active-route highlight

**Files:**
- Modify: `src/components/topbar.tsx`

**Why:** The topbar must follow the page theme. The mockup also shows the active route highlighted with the accent colour (gold on dark, terracotta on light). Active state requires `usePathname`, so `TopbarItem` becomes a small client subcomponent in this same file.

- [ ] **Step 1:** Replace `src/components/topbar.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./locale-switcher";
import { StringKey, T } from "@/utils/lang";
import { Locale } from "@/i18n-config";
import type { PageTheme } from "./page-template";

const themes: Record<PageTheme, { bar: string; brand: string; link: string; accent: string }> = {
  dark: {
    bar: "bg-[#1d1814]/95 backdrop-blur border-b border-[#efe5d3]/10 text-[#efe5d3]",
    brand: "text-[#efe5d3]",
    link: "text-[#efe5d3]/80 hover:text-[#efe5d3]",
    accent: "text-[#d8a657]",
  },
  light: {
    bar: "bg-[#f6efe3]/95 backdrop-blur border-b border-[#2b211a]/10 text-[#2b211a]",
    brand: "text-[#2b211a]",
    link: "text-[#2b211a]/70 hover:text-[#2b211a]",
    accent: "text-[#a14a2a]",
  },
};

export default function Topbar(props: { lang: Locale; theme?: PageTheme }) {
  const theme: PageTheme = props.theme ?? "light";
  const t = themes[theme];
  function tr(key: StringKey) {
    return T(props.lang, key);
  }

  return (
    <div className={`w-full ${t.bar}`}>
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 px-4 sm:px-8 py-4">
        <Link href={`/${props.lang}`} className={`font-[family-name:var(--font-display)] text-base sm:text-lg tracking-wide ${t.brand}`}>
          Mosėdžio kavinė
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <TopbarItem lang={props.lang} label={tr("menu")} href="/menu" linkClass={t.link} accentClass={t.accent} />
          <TopbarItem lang={props.lang} label={tr("working.hours")} href="/workhours" linkClass={t.link} accentClass={t.accent} />
          <TopbarItem lang={props.lang} label={tr("contacts")} href="/contacts" linkClass={t.link} accentClass={t.accent} />
        </nav>
        <LocaleSwitcher linkClass={t.link} accentClass={t.accent} />
      </div>
    </div>
  );
}

function TopbarItem(props: {
  lang: Locale;
  label: string;
  href: string;
  linkClass: string;
  accentClass: string;
}) {
  const pathname = usePathname() ?? "";
  const target = `/${props.lang}${props.href}`;
  const active = pathname === target || pathname.startsWith(`${target}/`);
  return (
    <Link
      href={target}
      className={`text-[10px] sm:text-xs tracking-[0.18em] uppercase transition ${active ? props.accentClass : props.linkClass}`}
    >
      {props.label}
    </Link>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: clean build. If `LocaleSwitcher` errors about unknown `linkClass`/`accentClass` props, that's expected — Task 4 fixes it.

---

## Task 4: Update `LocaleSwitcher` to accept theme classes

**Files:**
- Modify: `src/components/locale-switcher.tsx`

**Why:** The switcher currently has no colour styling and no active-locale indication. To match the topbar theme it accepts class strings instead of importing theme tokens directly, keeping it framework-agnostic. The active locale is highlighted with the accent class.

- [ ] **Step 1:** Replace `src/components/locale-switcher.tsx` with:

```tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, Locale } from "@/i18n-config";

export default function LocaleSwitcher(props: { linkClass: string; accentClass: string }) {
  const pathname = usePathname() ?? "/";
  const currentLocale = pathname.split("/")[1] as Locale | undefined;

  const redirectedPathname = (locale: Locale) => {
    const segments = pathname.split("/");
    if (segments.length < 2 || segments[1] === "") {
      return `/${locale}`;
    }
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.18em] uppercase">
      {i18n.locales.map((locale, i) => {
        const active = locale === currentLocale;
        return (
          <span key={locale} className="flex items-center gap-2">
            <Link
              href={redirectedPathname(locale)}
              className={`transition ${active ? props.accentClass : props.linkClass}`}
              aria-current={active ? "true" : undefined}
            >
              {locale.toUpperCase()}
            </Link>
            {i < i18n.locales.length - 1 && <span className="opacity-30">·</span>}
          </span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: clean build. Open `http://localhost:3000/lt/contacts` after `npm run dev` and confirm the topbar uses the cream/terracotta light theme; switching to `/lt/menu` will still show the *old* menu body but the topbar should now sit on a dark background once Task 7 lands.

---

## Task 5: Add `tagline.short` to `i18n.json`

**Files:**
- Modify: `src/data/i18n.json`

**Why:** The hero subtitle is the only new piece of localised copy. Everything else reuses existing keys or comes from `menu.json`.

- [ ] **Step 1:** Replace `src/data/i18n.json` with:

```json
{
    "en": {
        "menu": "Menu",
        "phone": "Phone",
        "address": "Address",
        "contacts": "Contacts",
        "working.hours": "Working hours",
        "bar": "Bar",
        "kitchen": "Kitchen",
        "monday": "Monday",
        "thursday": "Thursday",
        "friday": "Friday",
        "saturday": "Saturday",
        "sunday": "Sunday",
        "alergens.notice": "Ask your waiter about allergens",
        "tagline.short": "Žemaitiški patiekalai, grilis ir pietūs."
    },
    "lt": {
        "menu": "Meniu",
        "phone": "Tel. nr.",
        "address": "Adresas",
        "contacts": "Kontaktai",
        "working.hours": "Darbo laikas",
        "bar": "Baras",
        "kitchen": "Virtuvė",
        "monday": "Pirmadienis",
        "thursday": "Ketvirtadienis",
        "friday": "Penktadienis",
        "saturday": "Šeštadienis",
        "sunday": "Sekmadienis",
        "alergens.notice": "Dėl alergenų kreiptis į padavėją",
        "tagline.short": "Žemaitiški patiekalai, grilis ir pietūs."
    },
    "lv": {
        "menu": "Ēdienkarte",
        "phone": "Tālruņa numurs",
        "address": "Adrese",
        "contacts": "Kontakti",
        "working.hours": "Darba laiks",
        "bar": "Bārs",
        "kitchen": "Virtuve",
        "monday": "Pirmdiena",
        "thursday": "Ceturtdiena",
        "friday": "Piektdiena",
        "saturday": "Sestdiena",
        "sunday": "Svētdiena",
        "alergens.notice": "Par alerģijām jautājiet viesmīlim",
        "tagline.short": "Žemaitiešu ēdieni, grils un pusdienas."
    }
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: clean build. The new key is now reachable via `T(lang, "tagline.short")`.

---

## Task 6: Build the chip-nav client component

**Files:**
- Create: `src/components/menu-chip-nav.tsx`

**Why:** Sticky horizontally-scrolling chip bar with smooth scroll-to-section, active-chip detection via `IntersectionObserver`, auto-scroll of the chip bar to keep the active chip visible on phones, and a `prefers-reduced-motion` fallback to instant jumps.

- [ ] **Step 1:** Create `src/components/menu-chip-nav.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type ChipDef = { id: string; label: string };

const STICKY_OFFSET_PX = 52; // height of the chip bar itself; topbar is not sticky

export default function MenuChipNav(props: { chips: ChipDef[] }) {
  const [activeId, setActiveId] = useState<string>(props.chips[0]?.id ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = props.chips
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el != null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      {
        rootMargin: `-${STICKY_OFFSET_PX + 8}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [props.chips]);

  useEffect(() => {
    const chip = chipRefs.current[activeId];
    const container = containerRef.current;
    if (!chip || !container) return;
    const chipLeft = chip.offsetLeft;
    const chipRight = chipLeft + chip.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;
    if (chipLeft < viewLeft || chipRight > viewRight) {
      const target = chipLeft - container.clientWidth / 2 + chip.offsetWidth / 2;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    }
  }, [activeId]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET_PX;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  return (
    <div
      ref={containerRef}
      className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 flex gap-2 overflow-x-auto bg-[#1d1814]/95 backdrop-blur border-b border-[#efe5d3]/10 scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {props.chips.map((c) => {
        const active = c.id === activeId;
        return (
          <a
            key={c.id}
            ref={(el) => {
              chipRefs.current[c.id] = el;
            }}
            href={`#${c.id}`}
            onClick={(e) => handleClick(e, c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] tracking-wide whitespace-nowrap border transition ${
              active
                ? "bg-[#d8a657] text-[#1d1814] border-[#d8a657]"
                : "border-[#d8a657]/40 text-[#efe5d3]/85 hover:border-[#d8a657]"
            }`}
          >
            {c.label}
          </a>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: clean build. Component is exported but not yet used.

---

## Task 7: Build the `MenuWeb` server component

**Files:**
- Create: `src/components/menu-web.tsx`

**Why:** Renders the entire menu body for `/menu`: hero, chip bar, all sections, allergen banner. Iterates `Object.entries(menuData)` exactly once so chips and sections share the same source-of-truth ordering. Passes only `{ id, label }[]` to the client chip-nav component — no menu data crosses the server/client boundary.

- [ ] **Step 1:** Create `src/components/menu-web.tsx` with:

```tsx
import data from "@/data/menu.json";
import { Locale } from "@/i18n-config";
import { T } from "@/utils/lang";
import MenuChipNav, { ChipDef } from "./menu-chip-nav";

type LocalisedString = { lt: string; en: string; lv?: string };

type MenuItem = {
  title: LocalisedString;
  note?: LocalisedString;
  price: number;
  smallPrice?: number;
};

type MenuGroup = {
  title: LocalisedString;
  note?: LocalisedString;
  items: MenuItem[];
};

const menuData = data as unknown as Record<string, MenuGroup>;

function pickLang(s: LocalisedString | undefined, lang: Locale): string {
  if (!s) return "";
  return (s as Record<string, string | undefined>)[lang] ?? s.en ?? s.lt ?? "";
}

export default function MenuWeb(props: { lang: Locale }) {
  const lang = props.lang;
  const groups = Object.entries(menuData);

  const chips: ChipDef[] = groups.map(([key, group]) => ({
    id: key,
    label: pickLang(group.title, lang),
  }));

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8">
      <header className="pt-10 pb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#d8a657]">Mosėdis · Žemaitija</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mt-2 text-[#efe5d3]">Mosėdžio kavinė</h1>
        <p className="text-sm sm:text-base text-[#efe5d3]/70 mt-2">{T(lang, "tagline.short")}</p>
      </header>

      <MenuChipNav chips={chips} />

      <div className="mt-2 mb-4 px-3 py-2 border-l-2 border-[#d8a657] bg-[#d8a657]/[0.06] text-sm text-[#efe5d3]/85">
        ! {T(lang, "alergens.notice")}
      </div>

      <div className="flex flex-col gap-12 pt-6 pb-24">
        {groups.map(([key, group]) => (
          <Section key={key} id={key} group={group} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function Section(props: { id: string; group: MenuGroup; lang: Locale }) {
  const { group, lang } = props;
  const subtitle = group.note ? pickLang(group.note, lang) : null;

  return (
    <section id={props.id} className="scroll-mt-24">
      <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[#efe5d3]">
        {pickLang(group.title, lang)}
      </h2>
      {subtitle && <p className="text-sm text-[#efe5d3]/65 mt-1">{subtitle}</p>}
      <div className="w-8 h-[2px] bg-[#d8a657] mt-3 mb-5" />
      <ul className="flex flex-col">
        {group.items.map((item, i) => (
          <Item key={i} item={item} lang={lang} />
        ))}
      </ul>
    </section>
  );
}

function Item(props: { item: MenuItem; lang: Locale }) {
  const { item, lang } = props;
  const note = item.note ? pickLang(item.note, lang) : null;
  return (
    <li className="flex items-baseline gap-3 py-2 border-b border-[#efe5d3]/[0.06]">
      <div className="flex-1 min-w-0">
        <div className="font-[family-name:var(--font-serif)] italic text-base sm:text-[17px] text-[#efe5d3]">
          {pickLang(item.title, lang)}
        </div>
        {note && <div className="text-xs text-[#efe5d3]/60 mt-0.5">{note}</div>}
      </div>
      <div className="font-[family-name:var(--font-serif)] tabular-nums text-[#d8a657] text-base sm:text-[17px] shrink-0">
        {item.smallPrice ? `${formatPrice(item.smallPrice)} / ${formatPrice(item.price)}` : formatPrice(item.price)}
      </div>
    </li>
  );
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace(".", ",") + " €";
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

Expected: clean build. Component is not yet wired into a route.

---

## Task 8: Wire `MenuWeb` into the menu page

**Files:**
- Modify: `src/app/[lang]/menu/page.tsx`

**Why:** The menu route currently renders `<MenuFront>`/`<MenuBack>` inside `<ScrollHorizontal>` wrappers. Replace that with `<MenuWeb>` inside `<PageTemplate theme="dark">`. The print page (`/[lang]/print`) and `/` (which proxies to this page) automatically pick up the new design — and the print page is unaffected because it imports directly from `src/components/menu.tsx`.

- [ ] **Step 1:** Replace `src/app/[lang]/menu/page.tsx` with:

```tsx
import MenuWeb from "@/components/menu-web";
import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";

export default async function MenuPage(props: PageParams) {
  const { lang } = await props.params;

  return (
    <PageTemplate lang={lang} theme="dark">
      <MenuWeb lang={lang} />
    </PageTemplate>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

- [ ] **Step 3:** Manual smoke test in dev:

```bash
npm run dev
```

Then open in browser:
- `http://localhost:3000/lt` — should render the new dark menu (root proxies to this page).
- `http://localhost:3000/lt/menu` — same dark menu.
- `http://localhost:3000/lt/print` — must render **identically to before**: A4 fixed-size MenuFront/MenuBack components with their print background images. If anything changed here, stop and investigate `src/components/menu.tsx` was not modified.

---

## Task 9: Restyle the contacts page

**Files:**
- Modify: `src/app/[lang]/contacts/page.tsx`

**Why:** Apply the lighter brand variant — display-serif heading, terracotta accent rule, restyled info rows and map card. Same content, no new translations.

- [ ] **Step 1:** Replace `src/app/[lang]/contacts/page.tsx` with:

```tsx
import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";

export default async function ContactsPage({ params }: PageParams) {
  const { lang } = await params;
  function t(key: StringKey) {
    return T(lang, key);
  }

  return (
    <PageTemplate lang={lang} theme="light">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#2b211a]">
          {t("contacts")}
        </h1>
        <div className="w-8 h-[2px] bg-[#a14a2a] mt-3 mb-8" />
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-base sm:text-lg">
          <dt className="text-[#2b211a]/60 uppercase text-xs tracking-[0.18em] self-baseline">{t("phone")}</dt>
          <dd>
            <a href="tel:+37064544112" className="hover:text-[#a14a2a] transition">+370 645 44112</a>
          </dd>
          <dt className="text-[#2b211a]/60 uppercase text-xs tracking-[0.18em] self-baseline">{t("address")}</dt>
          <dd>Skuodo r., Mosėdis, Kęstučio g. 6a</dd>
        </dl>
        <div className="relative h-[400px] md:h-[500px] mt-10 rounded-md overflow-hidden border border-[#2b211a]/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2221.457358443992!2d21.573653311940706!3d56.16648635994115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e54118263eea29%3A0x34818a0c2c94bdb!2zTW9zxJdkxb5pbyBrYXZpbsSX!5e0!3m2!1slt!2slt!4v1744536419247!5m2!1slt!2slt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </PageTemplate>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

- [ ] **Step 3:** Manual check at `http://localhost:3000/lt/contacts` — page should be cream/dark text with terracotta rule and topbar in light variant.

---

## Task 10: Restyle the workhours page

**Files:**
- Modify: `src/app/[lang]/workhours/page.tsx`

**Why:** Same lighter brand variant treatment, applied to the simpler workhours layout.

- [ ] **Step 1:** Replace `src/app/[lang]/workhours/page.tsx` with:

```tsx
import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";

export default async function WorktimePage(props: PageParams) {
  const { lang } = await props.params;
  function l(key: StringKey) {
    return T(lang, key);
  }

  return (
    <PageTemplate lang={lang} theme="light">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#2b211a]">
          {l("working.hours")}
        </h1>
        <div className="w-8 h-[2px] bg-[#a14a2a] mt-3 mb-8" />

        <div className="grid sm:grid-cols-2 gap-8">
          <Block title={l("bar")} hours={`${l("monday")} – ${l("sunday")}`} time="11:00 – 22:00" />
          <Block title={l("kitchen")} hours={`${l("monday")} – ${l("sunday")}`} time="11:00 – 21:00" />
        </div>
      </div>
    </PageTemplate>
  );
}

function Block(props: { title: string; hours: string; time: string }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2b211a]">{props.title}</h2>
      <p className="text-[#2b211a]/70 mt-2 text-sm uppercase tracking-[0.12em]">{props.hours}</p>
      <p className="text-2xl text-[#a14a2a] mt-1 tabular-nums">{props.time}</p>
    </div>
  );
}
```

- [ ] **Step 2:** Verify build and lint pass:

```bash
npm run build && npm run lint
```

- [ ] **Step 3:** Manual check at `http://localhost:3000/lt/workhours` — light variant with terracotta rule and time accents.

---

## Task 11: Final verification across all routes

**Files:** none modified.

**Why:** End-to-end pass to confirm nothing regressed and that the print page is still pixel-identical.

- [ ] **Step 1:** Production build and lint:

```bash
npm run build
npm run lint
```

Both must succeed cleanly.

- [ ] **Step 2:** Start the production preview:

```bash
npm run start
```

- [ ] **Step 3:** Visit each route in the browser, on a wide viewport and a narrow one (≤ 380 px DevTools simulator):

| Route | Expected |
| --- | --- |
| `/` | Dark menu (proxies to `/lt/menu`). Chip bar sticks; active chip tracks scroll. |
| `/lt/menu` | Same as above. |
| `/en/menu` | Same layout, English titles from `menu.json`. |
| `/lv/menu` | Same layout, Latvian titles where present, English fallback otherwise. |
| `/lt/contacts` | Light variant. Terracotta rule. Phone link tappable. Map iframe loads. |
| `/lt/workhours` | Light variant. Two cards (bar / kitchen). Terracotta time. |
| `/lt/print` | **Pixel-identical to current production.** Print background images render, A4 dimensions intact. |
| Print preview (`Ctrl+P` on `/lt/print`) | Two A4 landscape pages. |

- [ ] **Step 4:** Spot checks:

- Locale switcher: switching from LT → EN on `/lt/menu#wine` should land on `/en/menu#wine` (chip ids are stable).
- The chip whose section starts at the top of the viewport is highlighted in gold. Scrolling slowly through 2-3 sections updates the active chip.
- The chip bar auto-scrolls horizontally so the active chip is centred when reached via scroll on mobile.
- `prefers-reduced-motion: reduce` (toggle in DevTools → Rendering): chip click jumps instantly with no smooth scroll.
- Topbar active route highlight: on `/lt/menu` the "Meniu" link is gold; on `/lt/contacts` "Kontaktai" is terracotta.

- [ ] **Step 5:** Regression sanity:

- `/qr-redirect` still works (middleware untouched). Visit `http://localhost:3000/qr-redirect` and confirm it redirects to `/lt`, `/en`, or `/lv` based on `Accept-Language`.

If any check fails, the relevant earlier task is the place to fix — re-run that task's steps and rebuild.

---

## Notes for the implementer

- **Do not commit anything.** The user is reviewing diffs manually. Stop after Task 11 and surface the result; let them decide what (if anything) to commit.
- **Do not modify `src/components/menu.tsx` or `src/app/[lang]/print/page.tsx`** under any circumstance. They are the print target. If you find yourself wanting to refactor either file to "share code", stop — the duplication is intentional.
- **Section ordering authority:** `src/data/menu.json` only. No mapping table or hardcoded section list anywhere in `menu-web.tsx` or `menu-chip-nav.tsx`. If a future change wants to reorder the menu, the data file is the single touchpoint.
- **Tailwind classes for theme tokens** are written as arbitrary values (`bg-[#1d1814]`) rather than custom Tailwind theme tokens to keep the change surface small. Promoting them to `@theme` tokens in `globals.css` is a fine follow-up but not required for this plan.
