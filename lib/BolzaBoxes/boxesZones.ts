import type { Version } from "./VersionContext";
import type { FactionSlug } from "./factions";

export type BoxZone = {
    id: string; // unique au sein d'une version
    label: string;
    faction: FactionSlug | null; // null : zone non cliquable
    rect: { x: number; y: number; width: number; height: number };
};

// Chaque version a sa propre image, donc ses propres dimensions et son propre découpage
export type BoxesLayout = {
    width: number;
    height: number;
    zones: BoxZone[];
};

// Coordonnées mesurées sur les rectangles de couleur de l'image (séparateurs exclus)
const INTERNATIONAL_ZONES: BoxZone[] = [
    // --- Rangée 1 ---
    { id: "cats", label: "Colonne orange", faction: "cats", rect: { x: 3, y: 5, width: 271, height: 928 } },
    { id: "eyries", label: "Colonne bleue", faction: "eyries", rect: { x: 275, y: 5, width: 255, height: 928 } },
    { id: "alliance", label: "Colonne verte", faction: "alliance", rect: { x: 531, y: 5, width: 165, height: 928 } },
    { id: "lizards", label: "Colonne jaune", faction: "lizards", rect: { x: 697, y: 5, width: 250, height: 928 } },
    { id: "otters", label: "Colonne turquoise", faction: "otters", rect: { x: 948, y: 5, width: 215, height: 928 } },
    { id: "corvids", label: "Colonne violette", faction: "corvids", rect: { x: 1164, y: 5, width: 223, height: 928 } },
    {
        id: "vagabond",
        label: "Colonne blanche/grise",
        faction: "vagabond",
        rect: { x: 1388, y: 5, width: 444, height: 928 },
    },
    { id: "skunks", label: "Colonne noire", faction: "skunks", rect: { x: 1833, y: 5, width: 315, height: 928 } },

    // --- Rangée 2 ---
    { id: "moles", label: "Colonne pêche", faction: "moles", rect: { x: 2, y: 937, width: 325, height: 928 } },
    { id: "rats", label: "Colonne rouge", faction: "rats", rect: { x: 328, y: 937, width: 340, height: 928 } },
    { id: "badgers", label: "Colonne grise", faction: "badgers", rect: { x: 669, y: 937, width: 297, height: 928 } },
    { id: "frogs", label: "Colonne olive", faction: "frogs", rect: { x: 967, y: 937, width: 334, height: 928 } },
    { id: "bats", label: "Colonne brun-roux", faction: "bats", rect: { x: 1302, y: 937, width: 250, height: 928 } },
    {
        id: "landmarks",
        label: "Colonne brun foncé (temple)",
        faction: "landmarks",
        rect: { x: 1553, y: 937, width: 270, height: 928 },
    },
    {
        id: "extra",
        label: "Colonne brun foncé (+)",
        faction: "extra",
        rect: { x: 1824, y: 937, width: 326, height: 928 },
    },

    // --- Rangée 3 ---
    {
        id: "setup",
        label: "Colonne brun foncé (setup)",
        faction: "setup",
        rect: { x: 3, y: 1867, width: 265, height: 929 },
    },
    {
        id: "cards",
        label: "Panneau gris (cartes)",
        faction: "cards",
        rect: { x: 269, y: 1867, width: 1612, height: 929 },
    },
    {
        id: "setup2",
        label: "Colonne brun foncé (setup2)",
        faction: "setup2",
        rect: { x: 1883, y: 1867, width: 265, height: 929 },
    },
];

const FRENCH_ZONES: BoxZone[] = [
    // --- Rangée 1 ---
    { id: "fr-cats", label: "Colonne orange", faction: "cats", rect: { x: 8, y: 7, width: 293, height: 929 } },
    { id: "fr-eyries", label: "Colonne bleue", faction: "eyries", rect: { x: 313, y: 7, width: 265, height: 929 } },
    { id: "fr-alliance", label: "Colonne verte", faction: "alliance", rect: { x: 590, y: 7, width: 175, height: 929 } },
    {
        id: "fr-vagabond",
        label: "Colonne blanche/grise",
        faction: "vagabond",
        rect: { x: 777, y: 7, width: 454, height: 929 },
    },
    { id: "fr-lizards", label: "Colonne jaune", faction: "lizards", rect: { x: 1243, y: 7, width: 260, height: 929 } },
    {
        id: "fr-otters",
        label: "Colonne turquoise",
        faction: "otters",
        rect: { x: 1512, y: 7, width: 215, height: 929 },
    },
    { id: "fr-moles", label: "Colonne pêche", faction: "moles", rect: { x: 1735, y: 7, width: 325, height: 929 } },
    {
        id: "fr-corvids",
        label: "Colonne violette",
        faction: "corvids",
        rect: { x: 2069, y: 7, width: 199, height: 929 },
    },

    // --- Rangée 2 ---
    { id: "fr-rats", label: "Colonne rouge", faction: "rats", rect: { x: 7, y: 940, width: 346, height: 928 } },
    { id: "fr-badgers", label: "Colonne grise", faction: "badgers", rect: { x: 359, y: 940, width: 287, height: 928 } },
    {
        id: "fr-cartes",
        label: "Panneau gris (cartes)",
        faction: null,
        rect: { x: 654, y: 940, width: 1614, height: 928 },
    },

    // --- Rangée 3 ---
    {
        id: "fr-hirelings-unique",
        label: "Colonne rose foncé",
        faction: "hirelings-unique",
        rect: { x: 8, y: 1871, width: 266, height: 930 },
    },
    {
        id: "fr-hirelings-factions",
        label: "Grand panneau rose clair",
        faction: "hirelings-factions",
        rect: { x: 280, y: 1871, width: 1031, height: 930 },
    },
    {
        id: "fr-hirelings-setup",
        label: "Colonne brun foncé (sac)",
        faction: "hirelings-setup",
        rect: { x: 1315, y: 1871, width: 211, height: 930 },
    },
    {
        id: "fr-setup",
        label: "Colonne brun foncé (dé)",
        faction: "setup",
        rect: { x: 1531, y: 1871, width: 265, height: 930 },
    },
    {
        id: "fr-landmarks",
        label: "Colonne brun foncé (temple)",
        faction: "landmarks",
        rect: { x: 1802, y: 1871, width: 155, height: 930 },
    },
    {
        id: "fr-extra",
        label: "Colonne brun foncé (loupe)",
        faction: "extra",
        rect: { x: 1963, y: 1871, width: 305, height: 930 },
    },
];

export const BOXES_LAYOUTS: Record<Version, BoxesLayout> = {
    international: { width: 2150, height: 2800, zones: INTERNATIONAL_ZONES },
    french: { width: 2278, height: 2809, zones: FRENCH_ZONES },
};
