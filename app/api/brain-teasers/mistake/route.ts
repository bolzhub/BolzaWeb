import { NextRequest, NextResponse } from "next/server";
import { parseMessage, sendContactMail } from "@/lib/email";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";

const SECTION_LABELS: Record<string, string> = {
    rules: "Rules",
    teaser: "Brain teaser",
    solution: "Solution",
};

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    const message = parseMessage(body?.message);
    if (!message) {
        return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Le puzzle doit exister : évite d'injecter n'importe quoi dans l'objet du mail
    const puzzle = PUZZLES.find((p) => p.number === body?.puzzle);
    if (!puzzle) {
        return NextResponse.json({ error: "Unknown puzzle" }, { status: 400 });
    }

    const sectionLabel = SECTION_LABELS[body?.section] ?? "Unknown";

    const sent = await sendContactMail({
        from: "Brain Teasers <teasers@bolzanocrafts.com>",
        subject: `Brain Teaser #${puzzle.number} — mistake reported`,
        text: [
            `Puzzle: #${puzzle.number} (${puzzle.description})`,
            `Section being viewed: ${sectionLabel}`,
            "",
            message,
        ].join("\n"),
    });

    return sent
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: "Send failed" }, { status: 500 });
}