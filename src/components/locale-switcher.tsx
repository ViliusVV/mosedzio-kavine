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