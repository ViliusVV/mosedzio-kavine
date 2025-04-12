export default function WorktimePage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl">Darbo laikas</h1>
                <p className="text-xl">Pirmadieniais - Penktadieniais 10:00 - 20:00</p>
                <p className="text-xl">Šeštadieniais 10:00 - 22:00</p>
                <p className="text-xl">Sekmadieniais 10:00 - 18:00</p>
            </main>
        </div>
    );
}