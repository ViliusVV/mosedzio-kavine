import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";
import { StringKey, T } from "@/utils/lang";

export default async function WorktimePage(props: PageParams) {
    const { lang } = await props.params;

    function l(key: StringKey) {
        return T(lang, key);
    }

    return <PageTemplate lang={lang}>
        <div className="flex flex-col gap-[32px]">            
            <h1 className="text-4xl">{l('working.hours')}</h1>
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl mb-2 underline">{l('bar')}</h3>
                <p className="text-xl">{l('monday')} - {l('thursday')} 11:00 - 22:00</p>
                <p className="text-xl">{l('friday')} - {l('saturday')}  11:00 - 00:00</p>
                <p className="text-xl">{l('sunday')} 11:00 - 22:00</p>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl mb-2 underline">{l('kitchen')}</h3>
                <p className="text-xl">{l('monday')} - {l('sunday')} 11:00 - 21:00</p>
            </div>
        </div>
    </PageTemplate>
}