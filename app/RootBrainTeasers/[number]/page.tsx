import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleViewer, { type SectionContent } from "@/components/RootBrainTeasers/PuzzleViewer";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";
import { resolveImageSrc } from "@/lib/media/url";
import { getLang } from "@/lib/i18n/server";

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
    const lang = await getLang();
    const site = lang === "fr" ? "Casse-têtes Root" : "Root Brain Teasers";
    return {
        title: puzzle ? `Puzzle ${puzzle.number} — ${site}` : site,
        description: puzzle?.description[lang],
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
