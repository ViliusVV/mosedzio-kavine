import PageTemplate from "@/components/page-template";

export default function ContactsPage() {
    return <PageTemplate>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-8 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="text-4xl">Kontaktai</h1>
                <p className="text-xl"><strong>UAB "Bartva"</strong></p>
                <p className="text-xl">Tel. nr.: +370 600 00000</p>
                <p className="text-xl">Adresas xxx,xxx,xxx</p>
            </main>
        </div>
    </PageTemplate>
}