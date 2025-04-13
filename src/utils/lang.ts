import data from "@/data/i18n.json"
import { Locale } from "@/i18n-config"

type LangData = {
    lt: {
        [key: string]: string
    },
    en: {
        [key: string]: string
    },
    lv: {
        [key: string]: string
    }
}

const langData = data as unknown as LangData

export type StringKey = keyof typeof data["lt"] | keyof typeof data["en"] | keyof typeof data["lv"]

export function T(lang: Locale, key: StringKey): string {
    return langData[lang][key] || langData[lang]["lt"] || key as string
}