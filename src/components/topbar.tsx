import Link from "next/link";
import LocaleSwitcher from "./locale-switcher";

export default function Topbar() {
    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex justify-center items-center bg-white pt-8 dark:bg-black w-full h-[20px] gap-4 px-4">
                <div className="flex-1"/>
                <div className="flex flex-1 gap-4 justify-center">
                    <TopbarItem name="Menu" href="/menu" />
                    <TopbarItem name="Darbo laikas" href="/workhours" />
                    <TopbarItem name="Kontaktai" href="/contacts" />
                </div>
                <div className="flex-1">
                    <LocaleSwitcher/>
                </div>
            </div>
        </div>
    );
}

function TopbarItem(props: {name: string, href: string}) {
    return <div className="flex items-center gap-2 hover:underline hover:underline-offset-4">
        <Link href={props.href}>
            <p className="text-sm ">{props.name.toUpperCase()}</p>
        </Link>
    </div>;
}