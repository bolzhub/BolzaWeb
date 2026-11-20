"use client";

import { useState } from "react";
import Link from "next/link";
import { ResponsiveLogo } from "@/components/site/Logo";
import { RED_FLAGS } from "@/lib/RedFlags/redFlags";
import { shuffle, verdict } from "@/lib/RedFlags/game";

const BG = "#2a0b11";
const RED = "#e0313f";

type Phase = "intro" | "name" | "date" | "summary";

const TITLE_FONT = { fontFamily: "var(--font-playfair)", fontWeight: 700 } as const;

export default function RedFlagsGame() {
    const [phase, setPhase] = useState<Phase>("intro");
    const [name, setName] = useState("");
    const [deck, setDeck] = useState<string[]>([]); // ordre de tirage de la partie
    const [count, setCount] = useState(0); // nombre de red flags apparus

    const flags = deck.slice(0, count);
    const exhausted = count >= deck.length;

    function startDate(chosen: string) {
        setName(chosen);
        setDeck(shuffle(RED_FLAGS));
        setCount(1);
        setPhase("date");
    }

    function next() {
        if (exhausted) setPhase("summary");
        else setCount((c) => c + 1);
    }

    const centered = phase === "intro" || phase === "name";

    return (
        <main
            className="relative flex min-h-screen min-h-dvh flex-col text-cream"
            style={{ backgroundColor: BG, fontFamily: "var(--font-manrope)" }}
        >
            {/* En-tête superposé : l'accueil et le choix du prénom se centrent sur tout l'écran */}
            <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10">
                <Link href="/" className="shrink-0">
                    <ResponsiveLogo className="h-8 brightness-0 invert md:h-10" />
                </Link>
                {phase !== "intro" && (
                    <button
                        onClick={() => setPhase("intro")}
                        className="text-sm opacity-60 underline-offset-4 hover:underline hover:opacity-100"
                    >
                        Recommencer
                    </button>
                )}
            </header>

            <div
                className={`mx-auto flex w-full max-w-xl flex-1 flex-col px-6 ${
                    centered ? "py-24" : "pb-8 pt-20 md:pt-24"
                }`}
            >
                {phase === "intro" && <Intro onStart={() => setPhase("name")} />}
                {phase === "name" && <NamePicker onPick={startDate} />}
                {phase === "date" && (
                    <DateScreen
                        name={name}
                        flags={flags}
                        exhausted={exhausted}
                        onContinue={next}
                        onStop={() => setPhase("summary")}
                    />
                )}
                {phase === "summary" && (
                    <Summary name={name} flags={flags} exhausted={exhausted} onReplay={() => setPhase("name")} />
                )}
            </div>
        </main>
    );
}

function Flag({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path d="M5 21V3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            <path d="M6 4h12l-3 4.5 3 4.5H6z" fill={RED} />
        </svg>
    );
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className="rounded-full px-6 py-3 font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: RED }}
        >
            {children}
        </button>
    );
}

function Intro({ onStart }: { onStart: () => void }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <Flag className="h-20 w-20" />
            <h1 className="text-4xl md:text-5xl" style={TITLE_FONT}>
                Jeu des Red Flags
            </h1>
            <p className="max-w-sm opacity-80">
                Ton date te révèle ses red flags, un par un. À chaque fois, tu choisis : tu continues, ou tu mets fin au
                date. Jusqu’où iras-tu ?
            </p>
            <PrimaryButton onClick={onStart}>Lancer le jeu</PrimaryButton>
        </div>
    );
}

function NamePicker({ onPick }: { onPick: (name: string) => void }) {
    const [custom, setCustom] = useState("");

    return (
        <div className="flex flex-1 flex-col justify-center gap-6">
            <h2 className="text-center text-3xl" style={TITLE_FONT}>
                Avec qui as-tu rendez-vous ?
            </h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (custom.trim()) onPick(custom.trim());
                }}
                className="flex gap-2"
            >
                <input
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    autoFocus
                    placeholder="Son prénom"
                    maxLength={30}
                    className="min-w-0 flex-1 rounded-full border border-cream/20 bg-transparent px-4 py-2 outline-none placeholder:text-cream/40 focus:border-cream/60"
                />
                <button
                    type="submit"
                    disabled={!custom.trim()}
                    className="rounded-full border border-cream/40 px-4 py-2 disabled:opacity-30"
                >
                    OK
                </button>
            </form>
        </div>
    );
}

function DateScreen({
    name,
    flags,
    exhausted,
    onContinue,
    onStop,
}: {
    name: string;
    flags: string[];
    exhausted: boolean;
    onContinue: () => void;
    onStop: () => void;
}) {
    const current = flags[flags.length - 1];
    const previous = flags.slice(0, -1).reverse(); // le plus récent en haut

    return (
        <div className="flex flex-1 flex-col gap-5">
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest opacity-60">Date avec</p>
                <h2 className="text-3xl" style={TITLE_FONT}>
                    {name}
                </h2>
            </div>

            {/* `key` relance l'animation d'apparition à chaque nouveau red flag */}
            <div
                key={flags.length}
                className="animate-[flag-in_400ms_ease-out] rounded-2xl p-5 text-ink shadow-xl"
                style={{ backgroundColor: "#f3ecdc" }}
            >
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-60">
                    <Flag className="h-4 w-4" /> Red flag n°{flags.length}
                </p>
                <p className="text-xl leading-snug">{current}</p>
            </div>

            {/* Boutons juste sous le red flag en cours : la liste qui s'allonge reste en dessous */}
            <div className="flex gap-3">
                <button
                    onClick={onStop}
                    className="flex-1 rounded-full border border-cream/40 px-4 py-3 font-semibold transition hover:bg-cream/5 active:scale-95"
                >
                    Mettre fin au date
                </button>
                <button
                    onClick={onContinue}
                    className="flex-1 rounded-full px-4 py-3 font-semibold text-white transition active:scale-95"
                    style={{ backgroundColor: RED }}
                >
                    {exhausted ? "Plus aucun red flag…" : "Continuer"}
                </button>
            </div>

            {previous.length > 0 && (
                <section>
                    <h3 className="mb-2 text-sm uppercase tracking-widest opacity-60">
                        Déjà accepté{previous.length > 1 ? "s" : ""} ({previous.length})
                    </h3>
                    <FlagList flags={previous} startAt={previous.length} descending />
                </section>
            )}
        </div>
    );
}

function FlagList({ flags, startAt, descending = false }: { flags: string[]; startAt: number; descending?: boolean }) {
    return (
        <ol className="space-y-2">
            {flags.map((f, i) => (
                <li key={f} className="flex gap-3 rounded-xl bg-cream/5 px-4 py-2.5">
                    <span className="w-6 shrink-0 text-right text-sm tabular-nums opacity-50">
                        {descending ? startAt - i : startAt + i}
                    </span>
                    <span>{f}</span>
                </li>
            ))}
        </ol>
    );
}

function Summary({
    name,
    flags,
    exhausted,
    onReplay,
}: {
    name: string;
    flags: string[];
    exhausted: boolean;
    onReplay: () => void;
}) {
    // Le dernier red flag est celui qui a fait arrêter le date (sauf si la liste est épuisée)
    const accepted = exhausted ? flags : flags.slice(0, -1);
    const last = exhausted ? null : flags[flags.length - 1];
    const { title, text } = verdict(accepted.length, exhausted);

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest opacity-60">Fin du date avec {name}</p>
                <h2 className="mt-1 text-4xl" style={{ ...TITLE_FONT, color: RED }}>
                    {title}
                </h2>
                <p className="mx-auto mt-3 max-w-sm opacity-80">{text}</p>
            </div>

            <p className="text-center text-lg">
                Tu as accepté <strong>{accepted.length}</strong> red flag{accepted.length > 1 ? "s" : ""}.
            </p>

            {last && (
                <div className="rounded-2xl p-5 text-ink shadow-xl" style={{ backgroundColor: "#f3ecdc" }}>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-60">
                        <Flag className="h-4 w-4" /> Le red flag de trop
                    </p>
                    <p className="text-xl leading-snug">{last}</p>
                </div>
            )}

            {accepted.length > 0 && (
                <section>
                    <h3 className="mb-2 text-sm uppercase tracking-widest opacity-60">Ce que tu as laissé passer</h3>
                    <FlagList flags={accepted} startAt={1} />
                </section>
            )}

            <div className="flex justify-center pt-2">
                <PrimaryButton onClick={onReplay}>Nouveau date</PrimaryButton>
            </div>
        </div>
    );
}
