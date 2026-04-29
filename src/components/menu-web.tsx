import data from "@/data/menu.json";
import { Locale } from "@/i18n-config";
import { StringKey, T } from "@/utils/lang";
import MenuTabs, { TabDef } from "./menu-tabs";
import { ChipDef } from "./menu-chip-nav";

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

const TAB_CONFIG: { id: string; labelKey: StringKey; keys: string[] }[] = [
  {
    id: "patiekalai",
    labelKey: "tab.food",
    keys: ["soups", "snacks", "salads", "hotDishes", "burgers", "otherDishes", "desserts"],
  },
  {
    id: "gerimai",
    labelKey: "tab.drinks",
    keys: ["hotDrinks", "coldDrinks", "alcoholCocktails", "wine", "sparklingWine", "beer"],
  },
  {
    id: "stiprieji",
    labelKey: "tab.spirits",
    keys: ["vodka", "brandy", "whiskey", "rum", "tequila", "gin", "liquor", "bitter", "cognac"],
  },
];

function pickLang(s: LocalisedString | undefined, lang: Locale): string {
  if (!s) return "";
  return (s as Record<string, string | undefined>)[lang] ?? s.en ?? s.lt ?? "";
}

export default function MenuWeb(props: { lang: Locale }) {
  const lang = props.lang;

  const tabs: TabDef[] = TAB_CONFIG.map((tab) => ({
    id: tab.id,
    label: T(lang, tab.labelKey),
    chips: tab.keys
      .filter((k) => menuData[k])
      .map<ChipDef>((k) => ({
        id: k,
        label: pickLang(menuData[k].title, lang),
      })),
  }));

  const panels: Record<string, React.ReactNode> = Object.fromEntries(
    TAB_CONFIG.map((tab) => [
      tab.id,
      tab.keys
        .filter((k) => menuData[k])
        .map((k) => <Section key={k} id={k} group={menuData[k]} lang={lang} />),
    ]),
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8">
      <header className="pt-10 pb-6">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#d8a657]">Mosėdis · Žemaitija</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mt-2 text-[#efe5d3]">
          Mosėdžio kavinė
        </h1>
        <p className="text-sm sm:text-base text-[#efe5d3]/70 mt-2">{T(lang, "tagline.short")}</p>
      </header>

      <MenuTabs tabs={tabs} panels={panels} allergenNotice={T(lang, "alergens.notice")} />
    </div>
  );
}

function Section(props: { id: string; group: MenuGroup; lang: Locale }) {
  const { group, lang } = props;
  const subtitle = group.note ? pickLang(group.note, lang) : null;

  return (
    <section id={props.id} className="scroll-mt-28">
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
        <div className="font-[family-name:var(--font-garamond)] italic text-base sm:text-[17px] text-[#efe5d3]">
          {pickLang(item.title, lang)}
        </div>
        {note && <div className="text-xs text-[#efe5d3]/60 mt-0.5">{note}</div>}
      </div>
      <div className="font-[family-name:var(--font-garamond)] tabular-nums text-[#d8a657] text-base sm:text-[17px] shrink-0">
        {item.smallPrice ? `${formatPrice(item.smallPrice)} / ${formatPrice(item.price)}` : formatPrice(item.price)}
      </div>
    </li>
  );
}

function formatPrice(p: number): string {
  return p.toFixed(2).replace(".", ",") + " €";
}
