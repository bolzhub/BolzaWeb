"use client";

import { useState } from "react";
import Link from "next/link";
import PdfViewer from "@/components/RootBrainTeasers/PdfViewer";
import ZoomImage from "@/components/RootBrainTeasers/ZoomImage";
import MistakeBox from "@/components/RootBrainTeasers/MistakeBox";
import { LOGO_SOURCES } from "@/components/site/Logo";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { useLang } from "@/lib/i18n/LanguageContext";
import type { Lang, Localized } from "@/lib/i18n/lang";

export type SectionId = "rules" | "teaser" | "solution";
export type SectionContent = { url: string; kind: "pdf" | "image" };
export type LocalizedContent = Record<Lang, SectionContent>;
export type PuzzleContents = Partial<Record<SectionId, LocalizedContent>>;

const SECTIONS: { id: SectionId; label: Localized }[] = [
    { id: "rules", label: { en: "Rules", fr: "Règles" } },
    { id: "teaser", label: { en: "Brain teaser", fr: "Casse-tête" } },
    { id: "solution", label: { en: "Solution", fr: "Solution" } },
];

// Le contenu occupe la zone entre ces deux barres, pour que rien ne le recouvre
const TOP_BAR = "4rem";
const VIEWER_BG = "#2b1d12";
const BOTTOM_BAR = "calc(4.75rem + env(safe-area-inset-bottom, 0px))";

const PILL = "rounded-full bg-cream/95 shadow-md text-ink";
const TAB = "whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors";

export default function PuzzleViewer({ puzzleNumber, contents }: { puzzleNumber: number; contents: PuzzleContents }) {
    const lang = useLang();
    const fr = lang === "fr";
    // Onglets des seules sections qui ont un fichier ; avec une seule section, pas d'onglets du tout
    const available = SECTIONS.filter(({ id }) => contents[id]);
    const showTabs = available.length > 1;
    const first = available[0]?.id ?? "rules";
    const [section, setSection] = useState<SectionId>(first);
    const [visited, setVisited] = useState<SectionId[]>([first]);
    const [mistakeOpen, setMistakeOpen] = useState(false);
    const [hintGone, setHintGone] = useState(false);

    const select = (id: SectionId) => {
        setSection(id);
        setVisited((v) => (v.includes(id) ? v : [...v, id]));
    };

    const hintVisible = contents[section]?.[lang].kind === "image" && !hintGone;

    return (
        <div className="fixed inset-0 overflow-hidden" style={{ background: VIEWER_BG }}>
            {/* Les sections déjà visitées restent montées : changement instantané, position conservée */}
            <div className="absolute left-0 right-0" style={{ top: TOP_BAR, bottom: BOTTOM_BAR }}>
                {SECTIONS.map(({ id, label }) => {
                    if (!visited.includes(id)) return null;
                    const content = contents[id]?.[lang];
                    const active = section === id;

                    if (!content) {
                        return active ? (
                            <p
                                key={id}
                                className="absolute inset-0 flex items-center justify-center text-xl text-parchment/80"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                                {fr ? "Bientôt disponible…" : "Coming soon…"}
                            </p>
                        ) : null;
                    }

                    return content.kind === "pdf" ? (
                        <PdfViewer key={`${id}-${content.url}`} src={content.url} active={active} />
                    ) : (
                        <ZoomImage
                            key={`${id}-${content.url}`}
                            src={content.url}
                            alt={`Puzzle ${puzzleNumber} — ${label[lang]}`}
                            active={active}
                            onInteract={() => setHintGone(true)}
                        />
                    );
                })}
            </div>

            {/* Barre du haut : retour à la page principale, retour à la liste, numéro */}
            <div
                data-nav-row="puzzle"
                className="absolute left-0 right-0 top-0 z-50 flex items-center gap-2 px-3"
                style={{ height: TOP_BAR }}
            >
                <Link href="/" aria-label={fr ? "Accueil" : "Home"} className={`${PILL} p-2`}>
                    <img src={LOGO_SOURCES.small} alt="Bolzano" className="h-7 w-auto" />
                </Link>
                <Link href="/RootBrainTeasers" className={`${PILL} px-3 py-2 text-sm`}>
                    ← Puzzles
                </Link>
                <span className={`${PILL} px-3 py-2 text-sm font-bold`}>Puzzle {puzzleNumber}</span>
                <LanguageSwitch className="ml-auto" />
            </div>

            {/* Indice, qui disparaît dès la première interaction avec l'image */}
            <p
                className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-full bg-black/55 px-4 py-1.5 text-sm text-parchment transition-opacity duration-500 ${
                    hintVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ bottom: `calc(${BOTTOM_BAR} + 0.75rem)` }}
            >
                {fr
                    ? "Molette ou pincement pour zoomer, glisser pour déplacer"
                    : "Scroll or pinch to zoom, drag to move"}
            </p>

            <MistakeBox open={mistakeOpen} puzzleNumber={puzzleNumber} section={section} />

            {/* Barre des sections : au-dessus du cadre, pour qu'on puisse toujours le refermer */}
            <nav
                className="absolute left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100%-1rem)] items-center gap-1 overflow-x-auto rounded-full bg-cream/95 p-1 shadow-lg"
                style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
            >
                {showTabs &&
                    available.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={section === id}
                            onClick={() => select(id)}
                            className={`${TAB} ${section === id ? "bg-ink text-cream" : "text-ink hover:bg-ink/10"}`}
                        >
                            {label[lang]}
                        </button>
                    ))}

                {showTabs && <span className="mx-1 h-5 w-px shrink-0 bg-ink/20" aria-hidden="true" />}

                <button
                    type="button"
                    aria-expanded={mistakeOpen}
                    onClick={() => setMistakeOpen((o) => !o)}
                    className={`${TAB} ${mistakeOpen ? "bg-[#7a2e2e] text-white" : "text-ink hover:bg-ink/10"}`}
                >
                    {fr ? "Signaler une erreur" : "Notice a mistake"}
                </button>
            </nav>
        </div>
    );
}
