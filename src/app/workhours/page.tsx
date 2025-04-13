import PageTemplate from "@/components/page-template";

export default function WorktimePage() {
    return <PageTemplate>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl">Darbo laikas</h1>
                <h3 className="text-4xl">Baras</h1>
                <p className="text-xl">Pirmadienis- Ketvirtadienis 11:00 - 22:00</p>
                <p className="text-xl">Pektadienis-Šeštadienis  11:00 - 00:00</p>
                <p className="text-xl">Sekmadieniais 11:00 - 22:00</p>
                <h3 className="text-4xl">Virtuve</h3>
                <p className="text-xl">Pirmadienis - Sekmadienis 11:00 - 21:00</p>
            </main>
        </div>
    </PageTemplate>
}