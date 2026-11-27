"use client";

import type { Faction } from "@/lib/BolzaBoxes/types";
import { useLang } from "@/lib/i18n/LanguageContext";
import type { Lang } from "@/lib/i18n/lang";

export default function FactionInfo({
    faction,
    textColor,
    lang: forcedLang,
}: {
    faction: Faction;
    textColor: string;
    lang?: Lang; // langue imposée (mesures), sinon celle du site
}) {
    const siteLang = useLang();
    const lang = forcedLang ?? siteLang;
    return (
        <div className="flex flex-col gap-3" style={{ color: textColor }}>
            <div className="hidden lg:flex items-center gap-3">
                <img src={faction.icon} alt="" className="h-8 w-8 shrink-0" />
                <h1
                    className="text-3xl md:text-4xl tracking-wide"
                    style={{ fontFamily: "var(--font-cinzel-decorative)", fontWeight: 700 }}
                >
                    {faction.name[lang]}
                </h1>
            </div>
            <p className="opacity-80 leading-relaxed lg:text-xl" style={{ fontFamily: "var(--font-cinzel)" }}>
                {faction.description[lang]}
            </p>
        </div>
    );
}
