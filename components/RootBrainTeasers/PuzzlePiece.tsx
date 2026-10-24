import Link from "next/link";
import { PUZZLE_COLORS, type Puzzle } from "@/lib/RootBrainTeasers/puzzles";
import { readableTextOn } from "@/lib/colors";

const FALLBACK_COLORS = Object.values(PUZZLE_COLORS);
const DARK = "#2A2018";
const LIGHT = "#FBF5E6";

// Point central visé pour le numéro, dans le repère 24×24 de l'icône.
// Pour décaler tous les numéros d'un coup, modifie ces deux valeurs.
const CENTER = { x: 12, y: 12 };
// Hauteur des chiffres alignés de Playfair ≈ 0,708 em : la ligne de base
// se place à la moitié de cette hauteur sous le point central.
const DIGIT_HALF_HEIGHT = 0.354;

export default function PuzzlePiece({ puzzle, index }: { puzzle: Puzzle; index: number }) {
    const color = puzzle.color
        ? PUZZLE_COLORS[puzzle.color]
        : FALLBACK_COLORS[index % FALLBACK_COLORS.length];
    const href = puzzle.href ?? `/RootBrainTeasers/${puzzle.number}`;
    const digits = String(puzzle.number).length;
    const fontSize = digits === 1 ? 9 : digits === 2 ? 8 : 6.5;

    return (
        <Link
            href={href}
            aria-label={`Puzzle ${puzzle.number} : ${puzzle.description}`}
            className="rbt-item flex flex-col items-center gap-5 text-center outline-none"
        >
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="rbt-icon block w-[var(--rbt-size)] h-[var(--rbt-size)] drop-shadow-[0_8px_8px_rgba(0,0,0,0.4)]"
            >
                <path
                    d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"
                    fill={color}
                    stroke="rgba(0,0,0,0.28)"
                    strokeWidth="0.35"
                    strokeLinejoin="round"
                />
                <text
                    x={CENTER.x}
                    y={CENTER.y + DIGIT_HALF_HEIGHT * fontSize}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="800"
                    fill={readableTextOn(color, DARK, LIGHT)}
                    style={{
                        fontFamily: "var(--font-playfair)",
                        fontVariantNumeric: "lining-nums",
                        fontFeatureSettings: '"lnum" 1',
                    }}
                >
                    {puzzle.number}
                </text>
            </svg>

            <span
                className="text-base md:text-lg leading-relaxed text-parchment/90 max-w-[calc(var(--rbt-size)*1.2)]"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
            >
                {puzzle.description}
            </span>
        </Link>
    );
}