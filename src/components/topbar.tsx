"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./locale-switcher";
import { StringKey, T } from "@/utils/lang";
import { Locale } from "@/i18n-config";
import type { PageTheme } from "./page-template";

const themes: Record<PageTheme, { bar: string; brand: string; link: string; accent: string }> = {
  dark: {
    bar: "w-full bg-[#1d1814] border-b border-[#efe5d3]/10 text-[#efe5d3]",
    brand: "text-[#efe5d3]",
    link: "text-[#efe5d3]/80 hover:text-[#efe5d3]",
    accent: "text-[#d8a657]",
  },
  light: {
    bar: "w-full bg-[#f6efe3] border-b border-[#2b211a]/10 text-[#2b211a]",
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
    <div className={t.bar}>
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