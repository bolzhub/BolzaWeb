import type { Faction } from "./types";

// Teintes adoucies utilisées pour le fond des pages de faction
const PAGE_COLORS = {
    orange: "#e07b39",
    blue: "#3b6ea5",
    green: "#4a7a4a",
    yellow: "#d4b106",
    teal: "#2fa3a3",
    purple: "#7a4f9e",
    greywhite: "#d8d3c8",
    black: "#2b2b2b",
    peach: "#e8a87c",
    red: "#a83232",
    gray: "#8a8a85",
    olive: "#6b6b2e",
    rust: "#8a4b2e",
    darkbrown: "#4a3222",
} as const;

type FactionData = {
    color: keyof typeof PAGE_COLORS;
    name?: string; // par défaut : le slug avec une majuscule
    description?: string; // par défaut : « Description coming soon. »
    buyUrl?: string;
};

// L'ordre de cette liste est celui de la barre latérale.
// Chaque entrée ajoutée ici crée la page /BolzaBoxes/boxes/<slug>.
const FACTION_DATA = {
    cats: { color: "orange" },
    eyries: { color: "blue" },
    alliance: { color: "green" },
    lizards: {
        color: "yellow",
        name: "The Lizard Cult",
        description: "25 warriors, 1 stone patron. Lizard head with tongue on the side.",
        buyUrl: "#",
    },
    otters: { color: "teal" },
    corvids: { color: "purple" },
    vagabond: { color: "greywhite" },
    skunks: { color: "black" },
    moles: { color: "peach" },
    rats: { color: "red" },
    keepers: { color: "gray" },
    frogs: { color: "olive" },
    bats: { color: "rust" },
    landmarks: { color: "darkbrown" },
    extra: { color: "darkbrown" },
    setup: { color: "darkbrown" },
    cards: { color: "darkbrown" },
    setup2: { color: "darkbrown" },
} satisfies Record<string, FactionData>;

export type FactionSlug = keyof typeof FACTION_DATA;

export const factionPath = (slug: string) => `/BolzaBoxes/boxes/${slug}`;

function toTitleCase(slug: string): string {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export const FACTIONS: Faction[] = (Object.keys(FACTION_DATA) as FactionSlug[]).map((slug) => {
    const data: FactionData = FACTION_DATA[slug];
    return {
        slug,
        name: data.name ?? toTitleCase(slug),
        color: PAGE_COLORS[data.color],
        icon: `/projects/BolzaBoxes/factions/${slug}/icon.svg`,
        description: data.description ?? "Description coming soon.",
        buyUrl: data.buyUrl,
    };
});

export function getFactionBySlug(slug: string): Faction | undefined {
    return FACTIONS.find((f) => f.slug === slug);
}