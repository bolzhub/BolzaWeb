// 🎛️ Ajustez ces teintes à votre goût — l'ordre compte : les motifs les
// plus spécifiques ("brun foncé") doivent être testés avant les génériques.
const COLOR_KEYWORDS: { match: RegExp; hex: string }[] = [
    { match: /brun foncé/i, hex: "#4a3222" },
    { match: /brun-roux/i, hex: "#8a4b2e" },
    { match: /blanche\/grise/i, hex: "#d8d3c8" },
    { match: /orange/i, hex: "#e07b39" },
    { match: /bleue?/i, hex: "#3b6ea5" },
    { match: /verte?/i, hex: "#4a7a4a" },
    { match: /jaune/i, hex: "#d4b106" },
    { match: /turquoise/i, hex: "#2fa3a3" },
    { match: /violette?/i, hex: "#7a4f9e" },
    { match: /noire?/i, hex: "#2b2b2b" },
    { match: /pêche/i, hex: "#e8a87c" },
    { match: /rouge/i, hex: "#a83232" },
    { match: /grise?/i, hex: "#8a8a85" },
    { match: /olive/i, hex: "#6b6b2e" },
];

export function colorFromLabel(label: string): string {
    for (const { match, hex } of COLOR_KEYWORDS) {
        if (match.test(label)) return hex;
    }
    return "#7a7a70"; // repli neutre si aucun mot-clé ne correspond
}
