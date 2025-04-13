import { MenuBack, MenuFront } from "@/components/menu";
import PageTemplate from "@/components/page-template";


export default function MenuPage() {
    return <PageTemplate>
        <ScrollHorizontal>
            <MenuFront/>
        </ScrollHorizontal>
        <ScrollHorizontal>
            <MenuBack/>
        </ScrollHorizontal>
    </PageTemplate>
}

function ScrollHorizontal(props: { children: React.ReactNode }) {
    return <div className="max-w-screen overflow-x-scroll">
        {props.children}
    </div>
}