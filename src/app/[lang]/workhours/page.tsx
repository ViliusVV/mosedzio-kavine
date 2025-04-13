import PageTemplate from "@/components/page-template";

export default function WorktimePage() {
    return <PageTemplate>
        <div className="flex flex-col gap-[32px]">            
            <h1 className="text-4xl">Darbo laikas</h1>
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl mb-2 underline">Baras</h3>
                <p className="text-xl">Pirmadienis - Ketvirtadienis 11:00 - 22:00</p>
                <p className="text-xl">Pektadienis -Šeštadienis  11:00 - 00:00</p>
                <p className="text-xl">Sekmadienis 11:00 - 22:00</p>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl mb-2 underline">Virtuve</h3>
                <p className="text-xl">Pirmadienis - Sekmadienis 11:00 - 21:00</p>
            </div>
        </div>
    </PageTemplate>
}