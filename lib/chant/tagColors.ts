export type TagColor = { solid: string; soft: string; border: string };

// 🎛️ Couleurs imposées (clé = nom du tag en minuscules).
// Exemple pour fixer Romain : romain: "#1d4ed8"
const FIXED_COLORS: Record<string, string> = {
  polyphonie: "#4f6f8f", // bleu ardoise
};

// 🎛️ Palette attribuée dans l'ordre de création aux autres tags
const PALETTE = [
  "#c2410c", // orange
  "#0f766e", // turquoise
  "#6d28d9", // violet
  "#be123c", // rouge
  "#1d4ed8", // bleu
  "#4d7c0f", // vert
  "#a16207", // ocre
  "#a21caf", // fuchsia
  "#0e7490", // cyan
];

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// Au-delà de la palette : teinte tournée de 137,5° (angle d'or) à chaque tag,
// pour que les couleurs successives restent bien distinctes.
function colorAt(position: number): string {
  if (position < PALETTE.length) return PALETTE[position];
  return hslToHex((position * 137.508) % 360, 62, 36);
}

function build(solid: string): TagColor {
  return { solid, soft: `${solid}1f`, border: `${solid}55` };
}

export function getTagColor(tag: string, allTags: string[]): TagColor {
  const key = tag.toLowerCase();
  if (FIXED_COLORS[key]) return build(FIXED_COLORS[key]);

  const colorable = allTags.filter((t) => !FIXED_COLORS[t.toLowerCase()]);
  const index = colorable.findIndex((t) => t.toLowerCase() === key);
  const position =
    index >= 0 ? index : [...tag].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

  return build(colorAt(position));
}