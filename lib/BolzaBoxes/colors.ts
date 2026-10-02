export function getContrastTextColor(hex: string): string {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    const [rl, gl, bl] = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    const luminance = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;

    return luminance > 0.5 ? "#1a1a1a" : "#f5f2ea";
}

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

export function frameColor(baseHex: string): string {
    const c = baseHex.replace("#", "");
    const r = Math.round(parseInt(c.substring(0, 2), 16) * 0.86);
    const g = Math.round(parseInt(c.substring(2, 4), 16) * 0.86);
    const b = Math.round(parseInt(c.substring(4, 6), 16) * 0.86);
    return `rgb(${r}, ${g}, ${b})`;
}