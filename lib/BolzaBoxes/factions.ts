import { FACTION_ASSETS_URL, type Faction, type ObjectType } from "./types";
import type { Version } from "./VersionContext";

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
    pink: "#d9809e",
    lightpink: "#f2c4cd",
} as const;

type FactionData = {
    color: keyof typeof PAGE_COLORS;
    name?: string; // par défaut : le slug avec une majuscule
    description?: string; // par défaut : « Description coming soon. »
    buyUrl?: string;
    objects?: ObjectType[]; // par défaut : container, box, drawer
};

// Chaque entrée ajoutée ici crée la page /BolzaBoxes/boxes/<slug>.
// L'ordre de la barre latérale est défini plus bas, par version (SIDEBAR_ORDER).
const FACTION_DATA = {
    cats: { color: "orange" },
    eyries: { color: "blue" },
    alliance: { color: "green" },
    vagabond: { color: "greywhite" },
    lizards: {
        color: "yellow",
        name: "The Lizard Cult",
        description: "25 warriors, 1 stone patron. Lizard head with tongue on the side.",
        buyUrl: "#",
    },
    otters: { color: "teal" },
    moles: { color: "peach" },
    corvids: { color: "purple" },
    rats: { color: "red" },
    badgers: { color: "gray" },
    frogs: { color: "olive" },
    bats: { color: "rust" },
    skunks: { color: "black" },
    setup: { color: "darkbrown" },
    setup2: { color: "darkbrown" },
    landmarks: { color: "darkbrown" },
    cards: { color: "darkbrown", objects: ["holder"] },
    "hirelings-setup": { color: "darkbrown", name: "Hirelings Setup" },
    "hirelings-unique": { color: "pink", name: "Hirelings Unique" },
    "hirelings-factions": { color: "lightpink", name: "Hirelings Factions" },
    extra: { color: "darkbrown", objects: ["holder"] },
} satisfies Record<string, FactionData>;

export type FactionSlug = keyof typeof FACTION_DATA;

// Ordre des icônes de la barre latérale, propre à chaque version
export const SIDEBAR_ORDER: Record<Version, FactionSlug[]> = {
    international: [
        "cats",
        "eyries",
        "alliance",
        "vagabond",
        "lizards",
        "otters",
        "moles",
        "corvids",
        "rats",
        "badgers",
        "frogs",
        "bats",
        "skunks",
        "setup",
        "setup2",
        "landmarks",
        "cards",
        "extra",
    ],
    french: [
        "cats",
        "eyries",
        "alliance",
        "vagabond",
        "lizards",
        "otters",
        "moles",
        "corvids",
        "rats",
        "badgers",
        "setup",
        "hirelings-setup",
        "hirelings-unique",
        "hirelings-factions",
        "landmarks",
        "extra",
    ],
};

// Anciens slugs encore accessibles (redirigés vers le nouveau)
export const SLUG_ALIASES: Record<string, FactionSlug> = {
    keepers: "badgers",
};

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
        icon: `${FACTION_ASSETS_URL}/${slug}/icon.svg`,
        description: data.description ?? "Description coming soon.",
        buyUrl: data.buyUrl,
        objects: data.objects ?? ["container", "box", "drawer"],
    };
});

export function getFactionBySlug(slug: string): Faction | undefined {
    return FACTIONS.find((f) => f.slug === slug);
}
