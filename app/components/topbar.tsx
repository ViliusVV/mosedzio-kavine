import Link from "next/link";

export default function Topbar() {
    return (
        <div className="flex justify-center items-center bg-white pt-8 dark:bg-black w-full h-[20px] gap-4">
            <TopbarItem name="Menu" href="/menu" />
            <TopbarItem name="Darbo laikas" href="/cotacts" />
            <TopbarItem name="Kontaktai" href="/worktime" />
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