import { MenuBack, MenuFront } from "@/components/menu";
import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";


export default async function MenuPage(props: PageParams) {
    const { lang } = await props.params;

    return <PageTemplate lang={lang}>
        <ScrollHorizontal>
            <MenuFront lang={lang}/>
        </ScrollHorizontal>
        <ScrollHorizontal>
            <MenuBack lang={lang}/>
        </ScrollHorizontal>
    </PageTemplate>
}

function ScrollHorizontal(props: { children: React.ReactNode }) {
    return <div className="max-w-screen overflow-x-auto">
        {props.children}
    </div>
}