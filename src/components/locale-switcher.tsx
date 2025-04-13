"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, Locale } from "@/i18n-config";


export default function LocaleSwitcher() {
  const pathname = usePathname();
  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  // swicher at the end of the row
  return (
    <div className="flex items-center gap-2 justify-end">
        {i18n.locales.map((locale) => {
          return <div className="hover:underline hover:underline-offset-4" key={locale}>
              <Link href={redirectedPathname(locale)}>{locale.toUpperCase()}</Link>
          </div>
        })}
    </div>
  );
}