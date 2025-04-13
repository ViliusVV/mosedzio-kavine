import Image from 'next/image';

export function MenuFront() {
    return <MenuWrapper>
        Front Menu

        <div style={{width: "60%", height: "30%" }} className="absolute bottom-0 translate-x-[-9%] translate-y-[6%]">
            <Image
            className='object-contain'
            src="/menu_front_bg.png"
            alt="Next.js logo"
            fill
            />
        </div>
    </MenuWrapper>
}

export function MenuBack() {
    return <MenuWrapper>
        Back Menu
    </MenuWrapper>
}

function MenuWrapper(props: {children: React.ReactNode}) {
    // white background landsape A4 size ration
    return <div className="w-[297mm] h-[210mm] bg-white text-black relative overflow-hidden box-border">
        {props.children}
    </div>
}