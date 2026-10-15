import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleViewer from "@/components/RootBrainTeasers/PuzzleViewer";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";
import { resolveImageSrc } from "@/lib/media/url";

type Props = { params: Promise<{ number: string }> };

function findPuzzle(raw: string) {
    const n = Number(raw);
    return PUZZLES.find((p) => p.number === n);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { number } = await params;
    const puzzle = findPuzzle(number);
    return {
        title: puzzle ? `Puzzle ${puzzle.number} — Root Brain Teasers` : "Root Brain Teasers",
        description: puzzle?.description,
    };
}

export default async function PuzzlePage({ params }: Props) {
    const { number } = await params;
    const puzzle = findPuzzle(number);
    if (!puzzle) notFound();

    const paths = puzzle.images ?? {};
    const images = {
        rules: paths.rules ? resolveImageSrc(paths.rules) : undefined,
        teaser: paths.teaser ? resolveImageSrc(paths.teaser) : undefined,
        solution: paths.solution ? resolveImageSrc(paths.solution) : undefined,
    };

    return <PuzzleViewer puzzleNumber={puzzle.number} images={images} />;
}