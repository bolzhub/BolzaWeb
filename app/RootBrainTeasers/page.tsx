import type { Metadata } from "next";
import ForestBackground from "@/components/RootBrainTeasers/ForestBackground";
import PuzzlePiece from "@/components/RootBrainTeasers/PuzzlePiece";
import AssetsEntry from "@/components/RootBrainTeasers/AssetsEntry";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";
import Link from "next/link";
import { ResponsiveLogo } from "@/components/site/Logo";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { getLang } from "@/lib/i18n/server";

const TEXT = {
    en: { title: "Root Brain Teasers", description: "Small puzzles to solve online, based on the board game Root." },
    fr: {
        title: "Casse-têtes Root",
        description: "De petits puzzles à résoudre en ligne, basés sur le jeu de société Root.",
    },
};

export async function generateMetadata(): Promise<Metadata> {
    return TEXT[await getLang()];
}

export default async function RootBrainTeasersPage() {
    const lang = await getLang();
    return (
        <main className="relative min-h-screen flex flex-col">
            <ForestBackground />

            <header data-nav-row="root" className="flex items-center justify-between gap-4 px-6 md:px-10 py-6">
                <Link href="/" className="inline-block rounded-full bg-cream/95 px-4 py-2 shadow-md">
                    <ResponsiveLogo />
                </Link>
                <LanguageSwitch />
            </header>

            <section className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 pb-16">
                <h1
                    className="text-center text-4xl md:text-6xl text-parchment"
                    style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 700,
                        textShadow: "0 2px 6px rgba(0,0,0,0.45)",
                    }}
                >
                    {TEXT[lang].title}
                </h1>

                <ul className="rbt-grid flex flex-wrap justify-center gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-14 mt-12 md:mt-16">
                    {PUZZLES.map((puzzle, i) => (
                        <li key={puzzle.number}>
                            <PuzzlePiece puzzle={puzzle} index={i} lang={lang} />
                        </li>
                    ))}
                    <li>
                        <AssetsEntry lang={lang} />
                    </li>
                </ul>
            </section>
        </main>
    );
}
