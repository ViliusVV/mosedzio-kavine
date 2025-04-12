import Image from 'next/image';

export default function Menu() {
    // white background landsape A4 size ration
    return <div id="menu_front" className="w-[297mm] h-[210mm] bg-white text-black relative overflow-hidden">
        <div id="content">
            Hello world! This is a test page for Mosėdžio kavinė menu.
        </div>
        {/* 
        // translate to boottom left corner */}
        <div className="absolute bottom-0 left-0 translate-x-[-30%] translate-y-[50%]">
            <Image
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
        </div>
    </div>
}