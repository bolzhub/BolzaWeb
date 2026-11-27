import { FACTION_ASSETS_URL, type Faction, type ObjectType } from "./types";
import type { Version } from "./VersionContext";
import type { Localized } from "@/lib/i18n/lang";

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
    name: Localized;
    description?: Localized; // facultative : rien ne s'affiche sans description
    buyUrl?: string;
    objects?: ObjectType[]; // par défaut : container, box, drawer
};

// Chaque entrée ajoutée ici crée la page /BolzaBoxes/boxes/<slug>.
// L'ordre de la barre latérale est défini plus bas, par version (SIDEBAR_ORDER).
const FACTION_DATA = {
    cats: { name: { en: "Marquise de Cat", fr: "Marquise de Chat" }, color: "orange" },
    eyries: { name: { en: "Eyrie Dynasties", fr: "Dynasties de la Canopée" }, color: "blue" },
    alliance: { name: { en: "Woodland Alliance", fr: "Alliance de la Forêt" }, color: "green" },
    vagabond: {
        name: { en: "Vagabond", fr: "Vagabond" },
        color: "greywhite",
        objects: ["container", "box", "drawer", "drawer2"], // deux tiroirs : 9 meeples et cartonnage
    },
    lizards: {
        color: "yellow",
        name: { en: "The Lizard Cult", fr: "Culte des Lézards" },
        description: {
            en: "25 warriors, 1 stone patron. Lizard head with tongue on the side.",
            fr: "25 guerriers, 1 patron de pierre. Tête de lézard avec la langue sur le côté.",
        },
        buyUrl: "#",
    },
    otters: { name: { en: "Riverfolk Company", fr: "Compagnie de la Rivière" }, color: "teal" },
    moles: { name: { en: "Underground Duchy", fr: "Duché Souterrain" }, color: "peach" },
    corvids: { name: { en: "Corvid Conspiracy", fr: "Conspiration des Corvidés" }, color: "purple" },
    rats: { name: { en: "Lord of the Hundreds", fr: "Seigneur des Cents" }, color: "red" },
    badgers: { name: { en: "Keepers in Iron", fr: "Gardiens de Fer" }, color: "gray" },
    frogs: { name: { en: "Lilypad Diaspora", fr: "Diaspora du Nénuphar" }, color: "olive" },
    bats: { name: { en: "Twilight Council", fr: "Conseil Crépusculaire" }, color: "rust" },
    skunks: { name: { en: "Knaves of the Deepwood", fr: "Gredins des Bois-fonds" }, color: "black" },
    setup: { name: { en: "Setup", fr: "Mise en place" }, color: "darkbrown" },
    setup2: { name: { en: "Setup2", fr: "Mise en place 2" }, color: "darkbrown" },
    landmarks: { name: { en: "Landmarks", fr: "Repères" }, color: "darkbrown" },
    cards: { name: { en: "Cards", fr: "Cartes" }, color: "darkbrown", objects: ["holder"] },
    "hirelings-setup": { color: "darkbrown", name: { en: "Hirelings Setup", fr: "Mise en place des mercenaires" } },
    "hirelings-unique": { color: "pink", name: { en: "Hirelings Unique", fr: "Mercenaires uniques" } },
    "hirelings-factions": { color: "lightpink", name: { en: "Hirelings Factions", fr: "Mercenaires de faction" } },
    extra: { name: { en: "Extra", fr: "Extra" }, color: "darkbrown", objects: ["holder"] },
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
        "landmarks",
        "hirelings-setup",
        "hirelings-unique",
        "hirelings-factions",
        "cards",
        "extra",
    ],
};

// Anciens slugs encore accessibles (redirigés vers le nouveau)
export const SLUG_ALIASES: Record<string, FactionSlug> = {
    keepers: "badgers",
};

export const factionPath = (slug: string) => `/BolzaBoxes/boxes/${slug}`;

export const FACTIONS: Faction[] = (Object.keys(FACTION_DATA) as FactionSlug[]).map((slug) => {
    const data: FactionData = FACTION_DATA[slug];
    return {
        slug,
        name: data.name,
        color: PAGE_COLORS[data.color],
        icon: `${FACTION_ASSETS_URL}/${slug}/icon.svg`,
        description: data.description,
        buyUrl: data.buyUrl,
        objects: data.objects ?? ["container", "box", "drawer"],
    };
});

export function getFactionBySlug(slug: string): Faction | undefined {
    return FACTIONS.find((f) => f.slug === slug);
}
