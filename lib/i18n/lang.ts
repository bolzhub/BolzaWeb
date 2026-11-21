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

// Choix de la langue sans cookie : celle que le navigateur préfère parmi fr et en,
// en respectant les priorités annoncées (« de-DE,en;q=0.5,fr;q=0.8 » → fr)
export function langFromAcceptLanguage(header: string | null): Lang {
    if (!header) return DEFAULT_LANG;
    let best: { lang: Lang; q: number } | null = null;
    for (const part of header.split(",")) {
        const [tag, ...params] = part.trim().split(";");
        const code = tag.trim().slice(0, 2).toLowerCase();
        if (!isLang(code)) continue;
        const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
        const q = qParam ? Number(qParam.slice(2)) : 1;
        if (!Number.isFinite(q) || q <= 0) continue;
        if (!best || q > best.q) best = { lang: code, q }; // à égalité, la première citée l'emporte
    }
    return best?.lang ?? DEFAULT_LANG;
}
