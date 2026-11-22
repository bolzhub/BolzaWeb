"use client";

import { useSyncExternalStore } from "react";
import GlobeScene, { BACKGROUND } from "./GlobeScene";
import CenteredTitleRow from "@/components/site/CenteredTitleRow";
import HomeBunny from "@/components/site/HomeBunny";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { useLang } from "@/lib/i18n/LanguageContext";

const CREAM = "#ece5d8";
const SWITCH_THEME = { track: BACKGROUND, active: CREAM, activeText: BACKGROUND, text: CREAM, ring: `${CREAM}40` };

// Page de présentation : le globe tel que le jeu le génère aujourd'hui, un nouveau terrain à chaque visite.
// ?seed=<n> fixe le terrain ; ?capture affiche le globe seul (aperçu de la page principale).
export default function HumanAway() {
    const fr = useLang() === "fr";
    // paramètres de l'URL, lus côté client (vides pendant le rendu serveur)
    const search = useSyncExternalStore(
        () => () => {},
        () => window.location.search,
        () => null,
    );
    const params = new URLSearchParams(search ?? "");
    const fixedSeed = Number(params.get("seed"));
    const capture = params.has("capture");

    return (
        <main className="fixed inset-0 overflow-hidden" style={{ backgroundColor: BACKGROUND }}>
            {search !== null && (
                <GlobeScene
                    seed={Number.isInteger(fixedSeed) && fixedSeed > 0 ? fixedSeed : undefined}
                    capture={capture}
                />
            )}

            {!capture && (
                <>
                    {/* La barre laisse passer les gestes vers le globe, sauf sur ses boutons */}
                    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
                        <CenteredTitleRow
                            navRow="human-away"
                            className="gap-4 px-6 py-5 md:px-10"
                            left={<HomeBunny body={CREAM} tail={BACKGROUND} />}
                            right={<LanguageSwitch theme={SWITCH_THEME} />}
                            title="Human Away"
                            titleClassName="text-2xl md:text-4xl tracking-wide leading-tight"
                            titleStyle={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: CREAM }}
                        />
                    </header>

                    <p
                        className="pointer-events-none absolute inset-x-0 bottom-[calc(2.5rem+env(safe-area-inset-bottom,0px))] z-10 px-6 text-center text-lg italic tracking-wide md:text-2xl"
                        style={{ fontFamily: "var(--font-playfair)", color: CREAM }}
                    >
                        {fr ? "Jeu vidéo en développement" : "Video game in development"}
                    </p>
                </>
            )}
        </main>
    );
}
