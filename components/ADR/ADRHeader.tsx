import type { ReactNode } from "react";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import HomeBunny from "@/components/site/HomeBunny";
import CenteredTitleRow from "@/components/site/CenteredTitleRow";

// Blanc et anthracite, les deux couleurs du sous-site
export const ADR_BG = "#1a1a1a";
const SWITCH_THEME = { track: ADR_BG, active: "#ffffff", activeText: ADR_BG, text: "#ffffff", ring: "#ffffff40" };

// Titre au centre exact de la page ; sur plusieurs lignes, puis réduit, s'il manque de place
export default function ADRHeader({ left, title }: { left?: ReactNode; title: string }) {
    return (
        <CenteredTitleRow
            navRow="life-drawing"
            className="gap-4 pt-5 pb-2 px-6 md:px-10"
            left={left ?? <HomeBunny body="#ffffff" tail={ADR_BG} />}
            // Vertical sur portable pour laisser la place au titre
            right={<LanguageSwitch vertical="mobile" theme={SWITCH_THEME} />}
            title={title}
            titleClassName="text-white text-4xl md:text-5xl tracking-wide leading-tight"
            titleStyle={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        />
    );
}
