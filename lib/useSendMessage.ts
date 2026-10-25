"use client";

import { useState } from "react";

export type SendStatus = "idle" | "sending" | "sent" | "error";

export function useSendMessage(endpoint: string) {
    const [status, setStatus] = useState<SendStatus>("idle");

    // Renvoie true si l'envoi a réussi
    const send = async (payload: Record<string, unknown>): Promise<boolean> => {
        setStatus("sending");
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error();
            setStatus("sent");
            return true;
        } catch {
            setStatus("error");
            return false;
        }
    };

    return { status, send, reset: () => setStatus("idle") };
}
