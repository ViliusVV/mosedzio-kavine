import Image from 'next/image';
import data from '@/data/menu.json'
import { Locale } from '@/i18n-config';

type LocalisedString = {
    lt: string,
    en: string,
}

type MenuGroup = {
    title: LocalisedString
    items: {
        title: LocalisedString
        note?: LocalisedString
        price: number
    }[]
}

type MenuType = {
    [key: string]: MenuGroup
}

const menuData: MenuType = data as unknown as MenuType;


export function MenuFront(props: {lang: Locale}) {
    return <MenuWrapper>
        <div className='flex gap-36 py-4 px-16'>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup lang={props.lang} group={menuData['soups']}/>
                <MenuGroup lang={props.lang} group={menuData['snacks']}/>
                <MenuGroup lang={props.lang} group={menuData['desserts']}/>
            </div>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup lang={props.lang} group={menuData['hotDishes']}/>
                <MenuGroup lang={props.lang} group={menuData['otherDishes']}/>
                <MenuGroup lang={props.lang} group={menuData['burgers']}/>
            </div>
        </div>


           
        <div style={{width: "60%", height: "60%" }} className="absolute bottom-0 right-0 translate-y-[6%]">
            <Image
                className='object-contain'
                src="/menu_front_bg.png"
                alt=''
                priority
                fill
            />
        </div>
    </MenuWrapper>
}

export function MenuBack(props: {lang: Locale}) {
    return <MenuWrapper>
        <div className='flex gap-36 py-4 px-16'>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup lang={props.lang} group={menuData['soups']}/>
                <MenuGroup lang={props.lang} group={menuData['snacks']}/>
                <MenuGroup lang={props.lang} group={menuData['desserts']}/>
            </div>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup lang={props.lang} group={menuData['hotDishes']}/>
                <MenuGroup lang={props.lang} group={menuData['otherDishes']}/>
                <MenuGroup lang={props.lang} group={menuData['burgers']}/>
            </div>
        </div>


           
        <div style={{width: "40%", height: "40%" }} className="absolute bottom-0 left-0 translate-y-[6%]">
            <Image
                className='object-contain'
                src="/menu_back_bg.png"
                alt=''
                priority
                fill
            />
        </div>
    </MenuWrapper>
}

function MenuWrapper(props: {children: React.ReactNode}) {
    // white background landsape A4 size ration
    return <div  className="w-[297mm] h-[210mm] bg-white text-black relative overflow-hidden">
        {props.children}
    </div>
}

function MenuGroup(props: {group: MenuGroup, lang: Locale}) {
    const lang = props.lang as keyof LocalisedString;

    return <div className="font-serif mb-2">
        <h2 className="text-2xl font-bold">{props.group.title[lang]}</h2>
        <div className="">
        {
            props.group.items.map((item, index) => {
                return <div key={index} className="flex flex-col">
                    <p className="text-lg text-bold italic p-0 m-0">{item.title[lang]} {item.price}€</p>
                    { item.note && 
                        <p className="text-xs font-italic mt-[-6px]">({item.note[lang]})</p>
                    }
                </div>
            })
        }
    </div>
</div>
}