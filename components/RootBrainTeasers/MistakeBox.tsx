"use client";

import { useEffect, useRef, useState } from "react";

const MAX_LENGTH = 2000;

type Pos = { x: number; y: number };

function parentSize(el: HTMLElement | null) {
    const parent = el?.offsetParent as HTMLElement | null;
    return {
        w: parent?.clientWidth ?? window.innerWidth,
        h: parent?.clientHeight ?? window.innerHeight,
    };
}

// Garde le cadre entièrement visible à l'écran
function clampPos(p: Pos, el: HTMLElement | null): Pos {
    const { w: pw, h: ph } = parentSize(el);
    const w = el?.offsetWidth ?? 352;
    const h = el?.offsetHeight ?? 280;
    return {
        x: Math.min(Math.max(0, p.x), Math.max(0, pw - w)),
        y: Math.min(Math.max(0, p.y), Math.max(0, ph - h)),
    };
}

export default function MistakeBox({
    open,
    puzzleNumber,
    section,
}: {
    open: boolean;
    puzzleNumber: number;
    section: string; // section visible au moment de l'envoi
}) {
    const boxRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ id: number; startX: number; startY: number; originX: number; originY: number } | null>(null);

    const [pos, setPos] = useState<Pos | null>(null);
    const [text, setText] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    // À l'ouverture : position initiale (1re fois) ou recadrage (si la fenêtre a changé)
    useEffect(() => {
        if (!open) return;
        const el = boxRef.current;
        if (!el) return;
        setPos((p) => {
            const { w: pw, h: ph } = parentSize(el);
            return clampPos(p ?? { x: (pw - el.offsetWidth) / 2, y: ph * 0.16 }, el);
        });
    }, [open]);

    // Recadrage quand la fenêtre est redimensionnée
    useEffect(() => {
        if (!open) return;
        const onResize = () => setPos((p) => (p ? clampPos(p, boxRef.current) : p));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [open]);

    const send = async () => {
        if (!text.trim() || status === "sending") return;
        setStatus("sending");
        try {
            const res = await fetch("/api/brain-teasers/mistake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, puzzle: puzzleNumber, section }),
            });
            if (!res.ok) throw new Error();
            setStatus("sent");
            setText("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <div
            ref={boxRef}
            role="dialog"
            aria-label={`Report a mistake in puzzle ${puzzleNumber}`}
            className={`absolute left-0 top-0 z-40 rounded-2xl bg-[#ECE5D8] text-[#3a352c] shadow-2xl ring-1 ring-black/15 ${open ? "block" : "hidden"
                }`}
            style={{
                width: "min(22rem, calc(100% - 1rem))",
                transform: pos ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
                visibility: pos ? "visible" : "hidden",
            }}
        >
            {/* Barre de titre : c'est elle qu'on attrape pour déplacer le cadre */}
            <div
                className="flex items-center gap-2 rounded-t-2xl bg-[#3a352c] px-4 py-2.5 text-[#ECE5D8] cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: "none" }}
                onPointerDown={(e) => {
                    if (!pos || drag.current) return;
                    if (e.pointerType === "mouse" && e.button !== 0) return;
                    e.currentTarget.setPointerCapture(e.pointerId);
                    drag.current = {
                        id: e.pointerId,
                        startX: e.clientX,
                        startY: e.clientY,
                        originX: pos.x,
                        originY: pos.y,
                    };
                }}
                onPointerMove={(e) => {
                    const d = drag.current;
                    if (!d || d.id !== e.pointerId) return;
                    setPos(
                        clampPos(
                            { x: d.originX + e.clientX - d.startX, y: d.originY + e.clientY - d.startY },
                            boxRef.current
                        )
                    );
                }}
                onPointerUp={(e) => {
                    if (drag.current?.id === e.pointerId) drag.current = null;
                }}
                onPointerCancel={(e) => {
                    if (drag.current?.id === e.pointerId) drag.current = null;
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="9" cy="6" r="1.8" />
                    <circle cx="15" cy="6" r="1.8" />
                    <circle cx="9" cy="12" r="1.8" />
                    <circle cx="15" cy="12" r="1.8" />
                    <circle cx="9" cy="18" r="1.8" />
                    <circle cx="15" cy="18" r="1.8" />
                </svg>
                <span className="text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                    Notice a mistake · Puzzle {puzzleNumber}
                </span>
            </div>

            <div className="p-3">
                {/* Pas de <form> : Entrée = retour à la ligne, seul le bouton envoie */}
                <textarea
                    value={text}
                    maxLength={MAX_LENGTH}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (status !== "idle") setStatus("idle");
                    }}
                    placeholder="Describe the mistake you noticed…"
                    rows={5}
                    className="w-full resize-none rounded-lg bg-[#3a352c]/8 px-3 py-2 text-base outline-none placeholder:text-[#3a352c]/40 focus:ring-2 focus:ring-[#3a352c]/30"
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-[#3a352c]/70">
                        {status === "sent" && "Thanks, sent!"}
                        {status === "error" && "Couldn't send, please try again."}
                    </p>
                    <button
                        type="button"
                        onClick={send}
                        disabled={!text.trim() || status === "sending"}
                        className="shrink-0 rounded-full bg-[#7a2e2e] px-5 py-2 text-sm text-white transition-colors hover:bg-[#8f3636] disabled:opacity-40"
                    >
                        {status === "sending" ? "Sending…" : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}