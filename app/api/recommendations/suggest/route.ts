import { NextRequest, NextResponse } from "next/server";
import { parseMessage, sendContactMail } from "@/lib/email";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const message = parseMessage(body?.message);
    if (!message) {
        return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const sent = await sendContactMail({
        from: "Recommendations <suggestions@bolzanocrafts.com>",
        subject: "Nouvelle suggestion — Recommendations",
        text: message,
    });

    return sent ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Send failed" }, { status: 500 });
}
