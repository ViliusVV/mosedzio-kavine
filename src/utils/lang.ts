import data from "@/data/i18n.json"

type LangData = {
    lt: {
        [key: string]: string
    },
    en: {
        [key: string]: string
    }
}

const langData = data as unknown as LangData

export function T(lang: "lt" | "en", key: string): string {
    return langData[lang][key] || langData[lang]["lt"] || key
}