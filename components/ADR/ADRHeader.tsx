import type { ReactNode } from "react";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";

export default function ADRHeader({ left, title }: { left: ReactNode; title: string }) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-8 pb-2 px-4 md:px-8">
            <div className="justify-self-start">{left}</div>
            <h1
                className="text-center text-white m-0 text-5xl tracking-wide"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
                {title}
            </h1>
            <LanguageSwitch className="justify-self-end self-start" />
        </div>
    );
}
