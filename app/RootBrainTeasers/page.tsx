import type { Metadata } from "next";
import Link from "next/link";
import ForestBackground from "@/components/RootBrainTeasers/ForestBackground";
import PuzzlePiece from "@/components/RootBrainTeasers/PuzzlePiece";
import AssetsEntry from "@/components/RootBrainTeasers/AssetsEntry";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";
import { ResponsiveLogo } from "@/components/site/Logo";

export const metadata: Metadata = {
    title: "Root Brain Teasers",
    description: "Small puzzles to solve online, based on the board game Root.",
};

export default function RootBrainTeasersPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <ForestBackground />

            <header className="px-6 md:px-10 py-6">
                <Link href="/" className="inline-block rounded-full bg-cream/95 px-4 py-2 shadow-md">
                    <ResponsiveLogo />
                </Link>
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
                    Root Brain Teasers
                </h1>

                <ul className="rbt-grid flex flex-wrap justify-center gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-14 mt-12 md:mt-16">
                    {PUZZLES.map((puzzle, i) => (
                        <li key={puzzle.number}>
                            <PuzzlePiece puzzle={puzzle} index={i} />
                        </li>
                    ))}
                    <li>
                        <AssetsEntry />
                    </li>
                </ul>
            </section>
        </main>
    );
}
