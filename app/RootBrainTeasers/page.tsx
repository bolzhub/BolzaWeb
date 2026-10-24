import type { Metadata } from "next";
import Link from "next/link";
import ForestBackground from "@/components/RootBrainTeasers/ForestBackground";
import PuzzlePiece from "@/components/RootBrainTeasers/PuzzlePiece";
import AssetsEntry from "@/components/RootBrainTeasers/AssetsEntry";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";

export const metadata: Metadata = {
    title: "Root Brain Teasers",
    description: "Small puzzles to solve online, based on the board game Root.",
};

const CSS = `
/* Taille des pièces : 2 par ligne sur mobile, 4 sur grand écran avec 4 éléments */
.rbt-grid { --rbt-size: clamp(8rem, 38vw, 13rem); }
@media (min-width: 768px) {
    .rbt-grid { --rbt-size: clamp(11rem, 20vw, 17rem); }
}

@keyframes rbt-joy {
    0%   { transform: translateY(0) rotate(0deg) scale(1); }
    30%  { transform: translateY(-14px) rotate(140deg) scale(1.12); }
    65%  { transform: translateY(-6px) rotate(290deg) scale(1.08); }
    100% { transform: translateY(0) rotate(360deg) scale(1); }
}
@keyframes rbt-wiggle {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    25%      { transform: rotate(-8deg) translateY(-8px); }
    50%      { transform: rotate(8deg) translateY(-4px); }
    75%      { transform: rotate(-4deg) translateY(-6px); }
}
.rbt-item:hover .rbt-icon,
.rbt-item:focus-visible .rbt-icon {
    animation: rbt-joy 0.85s ease-in-out;
}
.rbt-item:hover .rbt-icon-wiggle,
.rbt-item:focus-visible .rbt-icon-wiggle {
    animation: rbt-wiggle 0.7s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
    .rbt-item:hover .rbt-icon,
    .rbt-item:focus-visible .rbt-icon,
    .rbt-item:hover .rbt-icon-wiggle,
    .rbt-item:focus-visible .rbt-icon-wiggle {
        animation: none;
    }
}
`;

export default function RootBrainTeasersPage() {
    return (
        <main className="relative min-h-screen flex flex-col">
            <style>{CSS}</style>
            <ForestBackground />

            <header className="px-6 md:px-10 py-6">
                <Link
                    href="/"
                    className="inline-block rounded-full bg-[#ECE5D8]/95 px-4 py-2 shadow-md"
                >
                    <picture>
                        <source media="(max-width: 480px)" srcSet="/logo/logo-icon.svg" />
                        <source media="(max-width: 768px)" srcSet="/logo/logo-medium.svg" />
                        <img src="/logo/logo-full.svg" alt="Bolzano" className="h-8 md:h-10" />
                    </picture>
                </Link>
            </header>

            <section className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 pb-16">
                <h1
                    className="text-center text-4xl md:text-6xl text-[#F3ECDC]"
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