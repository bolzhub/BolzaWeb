// Langues du site (hors Tintin). Partagé entre serveur et client.
export type Lang = "en" | "fr";

export const LANGS: Lang[] = ["en", "fr"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

// Texte disponible dans les deux langues
export type Localized = Record<Lang, string>;

export function isLang(v: string | null | undefined): v is Lang {
    return v === "en" || v === "fr";
}

// Choix de la langue sans cookie : celle préférée par le navigateur (fr ou en)
export function langFromAcceptLanguage(header: string | null): Lang {
    if (!header) return DEFAULT_LANG;
    for (const part of header.split(",")) {
        const code = part.trim().slice(0, 2).toLowerCase();
        if (isLang(code)) return code;
    }
    return DEFAULT_LANG;
}
