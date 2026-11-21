"use client";

import { LANGS } from "@/lib/i18n/lang";
import { useLang, useSetLang } from "@/lib/i18n/LanguageContext";

// Sélecteur de langue, identique sur tout le site (en haut à droite de chaque barre de navigation).
// Il porte son propre fond pour rester lisible sur n'importe quelle page.
export default function LanguageSwitch({ className = "" }: { className?: string }) {
    const lang = useLang();
    const setLang = useSetLang();

    return (
        <div
            role="group"
            aria-label={lang === "fr" ? "Langue" : "Language"}
            className={`inline-flex shrink-0 items-center gap-0.5 rounded-full bg-cream/95 p-0.5 shadow-md ring-1 ring-ink/10 ${className}`}
            style={{ fontFamily: "var(--font-playfair)" }}
        >
            {LANGS.map((l) => {
                const active = l === lang;
                return (
                    <button
                        key={l}
                        type="button"
                        lang={l}
                        aria-pressed={active}
                        aria-label={l === "fr" ? "Français" : "English"}
                        onClick={() => setLang(l)}
                        className={`rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors ${
                            active ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
                        }`}
                    >
                        {l.toUpperCase()}
                    </button>
                );
            })}
        </div>
    );
}
