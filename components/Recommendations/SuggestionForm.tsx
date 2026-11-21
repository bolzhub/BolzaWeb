"use client";

import { useState } from "react";
import { FG } from "@/lib/Recommendations/theme";
import { useSendMessage } from "@/lib/useSendMessage";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function SuggestionForm() {
    const fr = useLang() === "fr";
    const [text, setText] = useState("");
    const { status, send, reset } = useSendMessage("/api/recommendations/suggest");

    const handleSubmit = async () => {
        if (!text.trim() || status === "sending") return;
        if (await send({ message: text })) setText("");
    };

    return (
        <div className="rounded-xl p-5" style={{ backgroundColor: `${FG}0D` }}>
            <p className="text-sm mb-3" style={{ color: FG, fontFamily: "var(--font-playfair)" }}>
                {fr
                    ? "D’après mes suggestions, propose-moi quelque chose !"
                    : "Based on my suggestions, suggest something to me!"}
            </p>

            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    if (status !== "idle") reset();
                }}
                placeholder={fr ? "Écris ta recommandation ici…" : "Write your recommendation here…"}
                rows={3}
                className="w-full resize-none rounded-lg px-4 py-3 text-sm outline-none"
                style={{
                    backgroundColor: `${FG}14`,
                    color: FG,
                }}
            />

            <div className="flex items-center justify-between mt-3">
                <p className="text-xs" style={{ color: `${FG}66` }}>
                    {status === "sent" && (fr ? "Merci, c’est envoyé !" : "Thanks, sent!")}
                    {status === "error" && (fr ? "Échec de l’envoi, réessaie." : "Couldn't send, please try again.")}
                </p>

                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || status === "sending"}
                    className="rounded-full px-5 py-2 text-sm transition-opacity disabled:opacity-30"
                    style={{ backgroundColor: FG, color: "#1E2420" }}
                >
                    {status === "sending" ? (fr ? "Envoi…" : "Sending…") : fr ? "Envoyer" : "Send"}
                </button>
            </div>
        </div>
    );
}
