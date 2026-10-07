"use client";

import { useState } from "react";

const FG = "#ECE5D8";

export default function SuggestionForm() {
    const [text, setText] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async () => {
        if (!text.trim() || status === "sending") return;
        setStatus("sending");
        try {
            const res = await fetch("/api/recommendations/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            if (!res.ok) throw new Error();
            setStatus("sent");
            setText("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="rounded-xl p-5" style={{ backgroundColor: `${FG}0D` }}>
            <p
                className="text-sm mb-3"
                style={{ color: FG, fontFamily: "var(--font-playfair)" }}
            >
                Based on my suggestions, suggest something to me!
            </p>

            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    if (status !== "idle") setStatus("idle");
                }}
                placeholder="Écris ta recommandation ici…"
                rows={3}
                className="w-full resize-none rounded-lg px-4 py-3 text-sm outline-none"
                style={{
                    backgroundColor: `${FG}14`,
                    color: FG,
                }}
            />

            <div className="flex items-center justify-between mt-3">
                <p className="text-xs" style={{ color: `${FG}66` }}>
                    {status === "sent" && "Merci, c'est envoyé !"}
                    {status === "error" && "Échec de l'envoi, réessaie."}
                </p>

                <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || status === "sending"}
                    className="rounded-full px-5 py-2 text-sm transition-opacity disabled:opacity-30"
                    style={{ backgroundColor: FG, color: "#1E2420" }}
                >
                    {status === "sending" ? "Envoi…" : "Envoyer"}
                </button>
            </div>
        </div>
    );
}