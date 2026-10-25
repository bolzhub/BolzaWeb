function channel(v: number): number {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

// Luminance relative (WCAG) d'une couleur #rrggbb
export function luminance(hex: string): number {
    const n = parseInt(hex.replace("#", ""), 16);
    return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

// Parmi deux couleurs de texte, renvoie celle qui contraste le mieux avec le fond
export function readableTextOn(bg: string, dark = "#1a1a1a", light = "#f5f2ea"): string {
    return contrastRatio(bg, dark) >= contrastRatio(bg, light) ? dark : light;
}
