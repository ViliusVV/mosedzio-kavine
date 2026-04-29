"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { i18n, Locale } from "@/i18n-config";

export default function LocaleSwitcher(props: { linkClass: string; accentClass: string }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
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
    <>
      {/* Mobile: native select */}
      <select
        className={`sm:hidden text-[10px] tracking-[0.12em] uppercase bg-transparent border border-current rounded px-1 py-0.5 cursor-pointer ${props.linkClass}`}
        value={currentLocale ?? i18n.defaultLocale}
        onChange={(e) => router.push(redirectedPathname(e.target.value as Locale))}
        aria-label="Select language"
      >
        {i18n.locales.map((locale) => (
          <option key={locale} value={locale} className="bg-inherit text-inherit normal-case">
            {locale.toUpperCase()}
          </option>
        ))}
      </select>

      {/* Desktop: dots row */}
      <div className="hidden sm:flex items-center gap-2 text-xs tracking-[0.18em] uppercase">
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
    </>
  );
}
