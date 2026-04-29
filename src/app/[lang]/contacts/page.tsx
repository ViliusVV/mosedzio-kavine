import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";

export default async function ContactsPage({ params }: PageParams) {
  const { lang } = await params;
  function t(key: StringKey) {
    return T(lang, key);
  }

  return (
    <PageTemplate lang={lang} theme="light">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#2b211a]">
          {t("contacts")}
        </h1>
        <div className="w-8 h-[2px] bg-[#a14a2a] mt-3 mb-8" />
        <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-base sm:text-lg">
          <dt className="text-[#2b211a]/60 uppercase text-xs tracking-[0.18em] self-baseline">{t("phone")}</dt>
          <dd>
            <a href="tel:+37064544112" className="hover:text-[#a14a2a] transition">+370 645 44112</a>
          </dd>
          <dt className="text-[#2b211a]/60 uppercase text-xs tracking-[0.18em] self-baseline">{t("address")}</dt>
          <dd>Skuodo r., Mosėdis, Kęstučio g. 6a</dd>
        </dl>
        <div className="relative h-[400px] md:h-[500px] mt-10 rounded-md overflow-hidden border border-[#2b211a]/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2221.457358443992!2d21.573653311940706!3d56.16648635994115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e54118263eea29%3A0x34818a0c2c94bdb!2zTW9zxJdkxb5pbyBrYXZpbsSX!5e0!3m2!1slt!2slt!4v1744536419247!5m2!1slt!2slt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </PageTemplate>
  );
}
