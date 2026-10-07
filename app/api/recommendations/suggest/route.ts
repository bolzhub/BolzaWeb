import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_LENGTH = 2000;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const { message } = await req.json();

    if (typeof message !== "string" || message.trim().length === 0) {
        return NextResponse.json({ error: "Message vide" }, { status: 400 });
    }
    if (message.length > MAX_LENGTH) {
        return NextResponse.json({ error: "Message trop long" }, { status: 400 });
    }

    try {
        const { error } = await resend.emails.send({
            from: "Recommendations <suggestions@bolzanocrafts.com>",
            to: "contact@bolzanocrafts.com",
            subject: "Nouvelle suggestion — Recommendations",
            text: message,
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