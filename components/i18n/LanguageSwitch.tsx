"use client";

import { LANGS } from "@/lib/i18n/lang";
import { useLang, useSetLang } from "@/lib/i18n/LanguageContext";

// Couleurs du sélecteur : fond de la pastille, bulle de la langue active et son texte, texte inactif
// `ring` : contour de la pastille, utile quand son fond se confond avec celui de la page
// `inactiveOpacity` : opacité de la langue non choisie (0.6 par défaut)
export type SwitchTheme = {
    track: string;
    active: string;
    activeText: string;
    text: string;
    ring?: string;
    inactiveOpacity?: number;
};

// Thème par défaut : crème et encre, comme la page principale
const DEFAULT_THEME: SwitchTheme = { track: "#ece5d8f2", active: "#3a352c", activeText: "#ece5d8", text: "#3a352c" };

// Sélecteur de langue, présent en haut à droite de chaque barre de navigation.
// Chaque sous-site peut lui passer ses propres couleurs.
// `vertical` : "mobile" l'empile sur portable et le remet à l'horizontale à partir de md.
export default function LanguageSwitch({
    className = "",
    theme = DEFAULT_THEME,
    vertical,
}: {
    className?: string;
    theme?: SwitchTheme;
    vertical?: "mobile";
}) {
    const lang = useLang();
    const setLang = useSetLang();

    return (
        <div
            role="group"
            aria-label={lang === "fr" ? "Langue" : "Language"}
            // items-stretch : en vertical, les deux boutons prennent la même largeur,
            // donc la bulle active épouse le contour de la pastille comme à l'horizontale
            className={`inline-flex shrink-0 items-stretch gap-0.5 rounded-full p-0.5 shadow-md ring-1 ring-black/10 ${
                vertical === "mobile" ? "flex-col md:flex-row" : ""
            } ${className}`}
            style={{
                fontFamily: "var(--font-playfair)",
                backgroundColor: theme.track,
                ...(theme.ring && { boxShadow: `0 0 0 1px ${theme.ring}, 0 4px 6px -1px rgb(0 0 0 / 0.1)` }),
            }}
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
                        className={`rounded-full px-2.5 py-1 text-center text-xs font-bold tracking-wide transition-[color,background-color,opacity] ${
                            active ? "" : "opacity-(--inactive) hover:opacity-100"
                        }`}
                        style={
                            active
                                ? { backgroundColor: theme.active, color: theme.activeText }
                                : ({
                                      color: theme.text,
                                      "--inactive": theme.inactiveOpacity ?? 0.6,
                                  } as React.CSSProperties)
                        }
                    >
                        {l.toUpperCase()}
                    </button>
                );
            })}
        </div>
    );
}
