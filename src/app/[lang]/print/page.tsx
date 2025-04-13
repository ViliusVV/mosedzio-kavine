import { MenuBack, MenuFront } from "@/components/menu";
import { PageParams } from "@/types";

export default async function MenuPage(props: PageParams) {
    const { lang } = await props.params;

    return <div>
        <MenuFront lang={lang}/>
        <MenuBack lang={lang}/>
    </div>
}
