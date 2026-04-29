export const i18n = {
    defaultLocale: "lt",
    locales: ["lt", "en", "lv", "de", "ru"],
  } as const;
  
export type Locale = (typeof i18n)["locales"][number];