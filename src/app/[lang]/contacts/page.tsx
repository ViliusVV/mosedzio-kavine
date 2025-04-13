import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";


export default async function ContactsPage({ params }: PageParams) {
    const { lang } = await params;

    function t(key: StringKey) {
        return T(lang, key);
    }

    return <PageTemplate lang={lang}>
        <div className="flex flex-col gap-[32px] row-start-2 w-full">
            <h1 className="text-4xl">{t('contacts')}</h1>
            <div className="max-w-sreen-sm">
                <p className="text-xl">{t("phone")}: +370 645 44112</p>
                <p className="text-xl ">{t("address")}: Skuodo r., Mosėdis, Kęstučio g. 6a</p>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2221.457358443992!2d21.573653311940706!3d56.16648635994115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e54118263eea29%3A0x34818a0c2c94bdb!2zTW9zxJdkxb5pbyBrYXZpbsSX!5e0!3m2!1slt!2slt!4v1744536419247!5m2!1slt!2slt" 
                    width="100%"
                    height="100%"
                    style={{"border":"0"}} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    </PageTemplate>
}