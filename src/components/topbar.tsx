import Link from "next/link";
import LocaleSwitcher from "./locale-switcher";
import { StringKey, T } from "@/utils/lang";
import { Locale } from "@/i18n-config";

export default async function Topbar(props: {lang: Locale}) {
    function t(key: StringKey) {
        return T(props.lang, key);
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex justify-center items-center bg-white pt-8 dark:bg-black w-full h-[20px] gap-4 px-4">
                <div className="flex-1"/>
                <div className="flex flex-1 gap-4 justify-center">
                    <TopbarItem lang={props.lang} name={t('menu')} href="/menu" />
                    <TopbarItem lang={props.lang} name={t('working.hours')} href="/workhours" />
                    <TopbarItem lang={props.lang} name={t('contacts')} href="/contacts" />
                </div>
                <div className="flex-1">
                    <LocaleSwitcher/>
                </div>
            </div>
        </div>
    );
}

function TopbarItem(props: {name: string, href: string, lang?: string}) {
    const link = props.lang == null ? `/lt/${props.href}` : `/${props.lang}${props.href}`;
    
    return <div className="flex items-center gap-2 hover:underline hover:underline-offset-4">
        <Link href={link}>
            <p className="text-sm ">{props.name.toUpperCase()}</p>
        </Link>
    </div>;
}