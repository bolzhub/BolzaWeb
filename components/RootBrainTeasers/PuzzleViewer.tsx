"use client";

import { useState } from "react";
import Link from "next/link";
import PanImage from "@/components/RootBrainTeasers/PanImage";
import MistakeBox from "@/components/RootBrainTeasers/MistakeBox";

export type SectionId = "rules" | "teaser" | "solution";
export type PuzzleImageUrls = Partial<Record<SectionId, string>>;

const SECTIONS: { id: SectionId; label: string }[] = [
    { id: "rules", label: "Rules" },
    { id: "teaser", label: "Brain teaser" },
    { id: "solution", label: "Solution" },
];

const PILL = "rounded-full bg-[#ECE5D8]/95 shadow-md text-[#3a352c]";
const TAB = "whitespace-nowrap rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors";

export default function PuzzleViewer({
    puzzleNumber,
    images,
}: {
    puzzleNumber: number;
    images: PuzzleImageUrls;
}) {
    const [section, setSection] = useState<SectionId>("rules");
    const [visited, setVisited] = useState<SectionId[]>(["rules"]);
    const [mistakeOpen, setMistakeOpen] = useState(false);
    const [hintGone, setHintGone] = useState(false);

    const select = (id: SectionId) => {
        setSection(id);
        setVisited((v) => (v.includes(id) ? v : [...v, id]));
    };

    const hintVisible = Boolean(images[section]) && !hintGone;

    return (
        <div className="fixed inset-0 overflow-hidden" style={{ background: "#2b1d12" }}>
            {/* Les sections déjà visitées restent montées : changement instantané, position conservée */}
            {SECTIONS.map(({ id, label }) => {
                if (!visited.includes(id)) return null;
                const src = images[id];
                const active = section === id;

                if (src) {
                    return (
                        <PanImage
                            key={id}
                            src={src}
                            alt={`Puzzle ${puzzleNumber} — ${label}`}
                            active={active}
                            onInteract={() => setHintGone(true)}
                        />
                    );
                }
                return active ? (
                    <p
                        key={id}
                        className="absolute inset-0 flex items-center justify-center text-xl text-[#F3ECDC]/80"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Coming soon…
                    </p>
                ) : null;
            })}

            {/* Haut gauche : retour à la page principale, retour à la liste, numéro */}
            <div className="absolute top-3 left-3 z-50 flex items-center gap-2">
                <Link href="/" aria-label="Home" className={`${PILL} p-2`}>
                    <img src="/logo/logo-icon.svg" alt="Bolzano" className="h-7 w-auto" />
                </Link>
                <Link href="/RootBrainTeasers" className={`${PILL} px-3 py-2 text-sm`}>
                    ← Puzzles
                </Link>
                <span className={`${PILL} px-3 py-2 text-sm font-bold`}>Puzzle {puzzleNumber}</span>
            </div>

            {/* Indice, qui disparaît dès le premier glissement */}
            <p
                className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-full bg-black/55 px-4 py-1.5 text-sm text-[#F3ECDC] transition-opacity duration-500 ${hintVisible ? "opacity-100" : "opacity-0"
                    }`}
                style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
            >
                Drag to explore
            </p>

            <MistakeBox open={mistakeOpen} puzzleNumber={puzzleNumber} section={section} />

            {/* Barre des sections : au-dessus du cadre, pour qu'on puisse toujours le refermer */}
            <nav
                className="absolute left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100%-1rem)] items-center gap-1 overflow-x-auto rounded-full bg-[#ECE5D8]/95 p-1 shadow-lg"
                style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
            >
                {SECTIONS.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        aria-pressed={section === id}
                        onClick={() => select(id)}
                        className={`${TAB} ${section === id
                                ? "bg-[#3a352c] text-[#ECE5D8]"
                                : "text-[#3a352c] hover:bg-[#3a352c]/10"
                            }`}
                    >
                        {label}
                    </button>
                ))}

                <span className="mx-1 h-5 w-px shrink-0 bg-[#3a352c]/20" aria-hidden="true" />

                <button
                    type="button"
                    aria-expanded={mistakeOpen}
                    onClick={() => setMistakeOpen((o) => !o)}
                    className={`${TAB} ${mistakeOpen
                            ? "bg-[#7a2e2e] text-white"
                            : "text-[#3a352c] hover:bg-[#3a352c]/10"
                        }`}
                >
                    Notice a mistake
                </button>
            </nav>
        </div>
    );
}