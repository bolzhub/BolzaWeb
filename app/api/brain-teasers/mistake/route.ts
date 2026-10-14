import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";

const MAX_LENGTH = 2000;
const SECTION_LABELS: Record<string, string> = {
    rules: "Rules",
    teaser: "Brain teaser",
    solution: "Solution",
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const { message, puzzle, section } = body ?? {};

    if (typeof message !== "string" || message.trim().length === 0) {
        return NextResponse.json({ error: "Message vide" }, { status: 400 });
    }
    if (message.length > MAX_LENGTH) {
        return NextResponse.json({ error: "Message trop long" }, { status: 400 });
    }

    // Le puzzle doit exister : évite d'injecter n'importe quoi dans l'objet du mail
    const known = PUZZLES.find((p) => p.number === puzzle);
    if (!known) {
        return NextResponse.json({ error: "Puzzle inconnu" }, { status: 400 });
    }

    const sectionLabel = SECTION_LABELS[section] ?? "Unknown";

    try {
        const { error } = await resend.emails.send({
            from: "Brain Teasers <teasers@bolzanocrafts.com>",
            to: "contact@bolzanocrafts.com",
            subject: `Brain Teaser #${known.number} — mistake reported`,
            text: [
                `Puzzle: #${known.number} (${known.description})`,
                `Section being viewed: ${sectionLabel}`,
                "",
                message,
            ].join("\n"),
        });

        if (error) {
            console.error("Erreur Resend:", error);
            return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Erreur d'envoi d'e-mail:", err);
        return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
    }
}