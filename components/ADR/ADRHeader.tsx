import type { ReactNode } from "react";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import HomeBunny from "@/components/site/HomeBunny";

// Blanc et anthracite, les deux couleurs du sous-site
export const ADR_BG = "#1a1a1a";
const SWITCH_THEME = { track: ADR_BG, active: "#ffffff", activeText: ADR_BG, text: "#ffffff", ring: "#ffffff40" };

export default function ADRHeader({ left, title }: { left?: ReactNode; title: string }) {
    return (
        <div
            data-nav-row="life-drawing"
            className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 pt-5 pb-2 px-6 md:px-10"
        >
            <div className="justify-self-start">{left ?? <HomeBunny body="#ffffff" tail={ADR_BG} />}</div>
            <h1
                data-nav-center
                className="trim-cap text-center text-white m-0 text-3xl sm:text-4xl md:text-5xl tracking-wide"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
                {title}
            </h1>
            {/* Vertical sur portable pour laisser la place au titre */}
            <LanguageSwitch className="justify-self-end" vertical="mobile" theme={SWITCH_THEME} />
        </div>
    );
}
