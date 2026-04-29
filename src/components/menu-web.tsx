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
        {T(lang, "alergens.notice")}
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
