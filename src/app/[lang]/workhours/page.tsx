import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";

export default async function WorktimePage(props: PageParams) {
  const { lang } = await props.params;
  function l(key: StringKey) {
    return T(lang, key);
  }

  return (
    <PageTemplate lang={lang} theme="light">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#2b211a]">
          {l("working.hours")}
        </h1>
        <div className="w-8 h-[2px] bg-[#a14a2a] mt-3 mb-8" />

        <div className="grid sm:grid-cols-2 gap-8">
          <Block title={l("bar")} hours={`${l("monday")} – ${l("sunday")}`} time="11:00 – 22:00" />
          <Block title={l("kitchen")} hours={`${l("monday")} – ${l("sunday")}`} time="11:00 – 21:00" />
        </div>
      </div>
    </PageTemplate>
  );
}

function Block(props: { title: string; hours: string; time: string }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2b211a]">{props.title}</h2>
      <p className="text-[#2b211a]/70 mt-2 text-sm uppercase tracking-[0.12em]">{props.hours}</p>
      <p className="text-2xl text-[#a14a2a] mt-1 tabular-nums">{props.time}</p>
    </div>
  );
}
