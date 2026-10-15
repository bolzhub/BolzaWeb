import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleViewer, { type SectionContent } from "@/components/RootBrainTeasers/PuzzleViewer";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";
import { resolveImageSrc } from "@/lib/media/url";

type Props = { params: Promise<{ number: string }> };

function findPuzzle(raw: string) {
    const n = Number(raw);
    return PUZZLES.find((p) => p.number === n);
}

// Un chemin en .pdf ouvre le lecteur PDF, tout le reste ouvre la vue image zoomable
function toContent(path?: string): SectionContent | undefined {
    if (!path) return undefined;
    return { url: resolveImageSrc(path), kind: /\.pdf$/i.test(path) ? "pdf" : "image" };
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

    const files = puzzle.files ?? {};
    const contents = {
        rules: toContent(files.rules),
        teaser: toContent(files.teaser),
        solution: toContent(files.solution),
    };

    return <PuzzleViewer puzzleNumber={puzzle.number} contents={contents} />;
}