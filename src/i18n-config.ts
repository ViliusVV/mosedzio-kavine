export const i18n = {
    defaultLocale: "lt",
    locales: ["lt", "en"],
  } as const;
  
export type Locale = (typeof i18n)["locales"][number];