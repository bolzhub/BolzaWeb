"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Crayon qui ouvre une fenêtre de renommage. onRename renvoie un message d'erreur, ou null si c'est bon.
// suffix : texte fixe affiché après le champ (extension d'un fichier, non modifiable)
export function RenameButton({
    title,
    value: initial,
    suffix = "",
    placeholder,
    size = "sm",
    className = "",
    onRename,
}: {
    title: string;
    value: string;
    suffix?: string;
    placeholder?: string;
    size?: "sm" | "md";
    className?: string;
    onRename: (value: string) => Promise<string | null>;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initial);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function show() {
        setValue(initial);
        setError(null);
        setOpen(true);
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!value.trim()) return;
        setBusy(true);
        setError(null);
        const err = await onRename(value.trim());
        setBusy(false);
        if (err) setError(err);
        else setOpen(false);
    }

    return (
        <>
            <button
                onClick={show}
                aria-label={title}
                title="Renommer"
                className={`shrink-0 rounded-full p-1.5 opacity-50 hover:bg-black/5 hover:opacity-100 ${className}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    className={size === "md" ? "h-5 w-5" : "h-4 w-4"}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.9 4.1a2.1 2.1 0 0 1 3 3L8.5 18.5 4 20l1.5-4.5L16.9 4.1Z"
                    />
                </svg>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
                    onClick={() => setOpen(false)}
                >
                    <form
                        onSubmit={submit}
                        className="w-full max-w-md space-y-3 rounded-2xl bg-white p-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="min-w-0 break-words text-sm font-semibold leading-snug">
                                Renommer « {initial}
                                {suffix} »
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Fermer"
                                className="opacity-60 hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex items-center rounded-lg border border-black/15 focus-within:border-black/50">
                            <input
                                autoFocus
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                placeholder={placeholder}
                                className="min-w-0 flex-1 rounded-lg px-3 py-2 outline-none"
                            />
                            {suffix && <span className="pr-3 text-sm opacity-50">{suffix}</span>}
                        </div>
                        {error && <p className="text-sm text-red-700">{error}</p>}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-4 py-2 text-sm hover:bg-black/5"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={busy || !value.trim() || value.trim() === initial}
                                className="rounded-lg bg-[#2b2926] px-4 py-2 text-sm text-white disabled:opacity-50"
                            >
                                {busy ? "…" : "Renommer"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

// Renomme un dossier. Sans onRenamed, la page est simplement rafraîchie.
export default function RenameSongButton({
    diskName,
    name,
    onRenamed,
    size = "sm",
    className = "",
}: {
    diskName: string;
    name: string;
    onRenamed?: (slug: string) => void;
    size?: "sm" | "md";
    className?: string;
}) {
    const router = useRouter();

    async function rename(value: string): Promise<string | null> {
        const res = await fetch("/api/chant/songs", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ song: diskName, name: value }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return data.error ?? "Erreur.";
        if (onRenamed) onRenamed(data.song.slug);
        else router.refresh();
        return null;
    }

    return (
        <RenameButton
            title={`Renommer ${name}`}
            value={name}
            placeholder="Titre de la chanson - Nom du groupe ou chanteur"
            size={size}
            className={className}
            onRename={rename}
        />
    );
}
