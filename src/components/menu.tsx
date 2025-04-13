import Image from 'next/image';
import data from '@/data/menu.json'
import { Locale } from '@/i18n-config';
import {  T } from '@/utils/lang';

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
        smallPrice?: number
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
                <MenuGroup lang={props.lang} group={menuData['salads']}/>
                <MenuGroup lang={props.lang} group={menuData['desserts']}/>
                <MenuGroup lang={props.lang} group={menuData['burgers']}/>

                <p className='text-orange-500 italic'>! {T(props.lang, 'alergens.notice')}</p> 
            </div>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup lang={props.lang} group={menuData['hotDishes']}/>
                <MenuGroup lang={props.lang} group={menuData['otherDishes']}/>
            </div>
        </div>

        <div style={{width: "65%", height: "65%" }} className="absolute bottom-0 right-0 translate-y-[6%]">
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
        <div className='flex gap-20 py-4 px-16'>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup gap={-1} lang={props.lang} group={menuData['hotDrinks']}/>
                <MenuGroup gap={-1} lang={props.lang} group={menuData['coldDrinks']}/>
                <MenuGroup gap={-1} lang={props.lang} group={menuData['alcoholCocktails']}/>
            </div>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['vodka']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['brandy']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['rum']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['whiskey']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['tequila']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['vermouth']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['cognac']}/>
            </div>
            <div className='relative z-10 flex flex-col'>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['liquor']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['bitter']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['wine']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['sparklingWine']}/>
                <MenuGroup gap={-2} textSize="text-md" lang={props.lang} group={menuData['beer']}/>

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

function MenuGroup(props: {group: MenuGroup, lang: Locale, gap?: number, textSize?: string}) {
    const lang = props.lang as keyof LocalisedString;
    const offset = props.gap ? `m-[${props.gap}px]` : `m-0`;
    const textSize = props.textSize ? props.textSize : 'text-lg';
    const groupGap = props.gap ? `mb-0` : `mb-2`;

    function getTitle(item: LocalisedString, key: Locale) {
        return item[key as keyof LocalisedString] || item.en || item.lt;
    }

    return <div className={`font-serif ${groupGap}`}>
        <h2 className={`text-2xl font-bold`}>{props.group.title[lang]}</h2>
        <div className="">
        {
            props.group.items.map((item, index) => {
                return <div key={index} className="flex flex-col">
                    <p className={`${textSize} text-bold italic p-0 ${offset}`}>{getTitle(item.title, lang)} { item.smallPrice && `${item.smallPrice}€/`}{item.price}€ </p>
                    { item.note && 
                        <p className="text-xs font-italic mt-[-6px]">({item.note[lang]})</p>
                    }
                </div>
            })
        }
    </div>
</div>
}