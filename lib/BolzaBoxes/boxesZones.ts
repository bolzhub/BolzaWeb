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

const INTERNATIONAL_ZONES: BoxZone[] = [
    // --- Rangée 1 ---
    { id: "col1-orange", label: "Colonne orange", faction: "cats", rect: { x: 0, y: 0, width: 274, height: 935 } },
    { id: "col2-bleu", label: "Colonne bleue", faction: "eyries", rect: { x: 274, y: 0, width: 256, height: 935 } },
    { id: "col3-vert", label: "Colonne verte", faction: "alliance", rect: { x: 530, y: 0, width: 165, height: 935 } },
    { id: "col4-jaune", label: "Colonne jaune", faction: "lizards", rect: { x: 695, y: 0, width: 252, height: 935 } },
    { id: "col5-turquoise", label: "Colonne turquoise", faction: "otters", rect: { x: 947, y: 0, width: 216, height: 935 } },
    { id: "col6-violet", label: "Colonne violette", faction: "corvids", rect: { x: 1163, y: 0, width: 223, height: 935 } },
    { id: "col7-blanc", label: "Colonne blanche/grise", faction: "vagabond", rect: { x: 1386, y: 0, width: 446, height: 935 } },
    { id: "col8-noir", label: "Colonne noire", faction: "skunks", rect: { x: 1832, y: 0, width: 318, height: 935 } },

    // --- Rangée 2 ---
    { id: "col9-peche", label: "Colonne pêche", faction: "moles", rect: { x: 0, y: 940, width: 300, height: 925 } },
    { id: "col10-rouge", label: "Colonne rouge", faction: "rats", rect: { x: 300, y: 940, width: 360, height: 925 } },
    { id: "col11-gris", label: "Colonne grise", faction: "keepers", rect: { x: 660, y: 940, width: 295, height: 925 } },
    { id: "col12-olive", label: "Colonne olive", faction: "frogs", rect: { x: 955, y: 940, width: 350, height: 925 } },
    { id: "col13-brunroux", label: "Colonne brun-roux", faction: "bats", rect: { x: 1305, y: 940, width: 250, height: 925 } },
    { id: "col14-brunfonce", label: "Colonne brun foncé (temple)", faction: "landmarks", rect: { x: 1555, y: 940, width: 270, height: 925 } },
    { id: "col15-brunfonce", label: "Colonne brun foncé (+)", faction: "extra", rect: { x: 1825, y: 940, width: 300, height: 925 } },

    // --- Rangée 3 ---
    { id: "col16-brunfonce", label: "Colonne brun foncé (setup)", faction: "setup", rect: { x: 0, y: 1865, width: 270, height: 925 } },
    { id: "col17-brunfonce", label: "Colonne brun foncé (cards)", faction: "cards", rect: { x: 270, y: 1865, width: 1500, height: 925 } },
    { id: "col18-brunfonce", label: "Colonne brun foncé (setup2)", faction: "setup2", rect: { x: 1900, y: 1865, width: 270, height: 925 } },
];

const FRENCH_ZONES: BoxZone[] = [
    // --- Rangée 1 ---
    { id: "fr-orange", label: "Colonne orange", faction: "cats", rect: { x: 8, y: 7, width: 293, height: 929 } },
    { id: "fr-bleu", label: "Colonne bleue", faction: "eyries", rect: { x: 313, y: 7, width: 265, height: 929 } },
    { id: "fr-vert", label: "Colonne verte", faction: "alliance", rect: { x: 590, y: 7, width: 175, height: 929 } },
    { id: "fr-blanc", label: "Colonne blanche/grise", faction: "vagabond", rect: { x: 777, y: 7, width: 454, height: 929 } },
    { id: "fr-jaune", label: "Colonne jaune", faction: "lizards", rect: { x: 1243, y: 7, width: 260, height: 929 } },
    { id: "fr-turquoise", label: "Colonne turquoise", faction: "otters", rect: { x: 1512, y: 7, width: 215, height: 929 } },
    { id: "fr-peche", label: "Colonne pêche", faction: "moles", rect: { x: 1735, y: 7, width: 323, height: 929 } },
    { id: "fr-violet", label: "Colonne violette", faction: "corvids", rect: { x: 2069, y: 7, width: 199, height: 929 } },

    // --- Rangée 2 ---
    { id: "fr-rouge", label: "Colonne rouge", faction: "rats", rect: { x: 7, y: 940, width: 346, height: 928 } },
    { id: "fr-gris", label: "Colonne grise", faction: "keepers", rect: { x: 359, y: 940, width: 287, height: 928 } },
    { id: "fr-bois", label: "Panneau bois", faction: null, rect: { x: 654, y: 940, width: 1614, height: 928 } },

    // --- Rangée 3 ---
    { id: "fr-rose", label: "Colonne rose", faction: null, rect: { x: 8, y: 1871, width: 266, height: 930 } },
    { id: "fr-rose-clair", label: "Grand panneau rose clair", faction: null, rect: { x: 280, y: 1871, width: 1031, height: 930 } },
    { id: "fr-sac", label: "Colonne brun foncé (sac)", faction: null, rect: { x: 1315, y: 1871, width: 211, height: 930 } },
    { id: "fr-de", label: "Colonne brun foncé (setup)", faction: "setup", rect: { x: 1531, y: 1871, width: 265, height: 930 } },
    { id: "fr-temple", label: "Colonne brun foncé (temple)", faction: "landmarks", rect: { x: 1802, y: 1871, width: 155, height: 930 } },
    { id: "fr-loupe", label: "Colonne brun foncé (loupe)", faction: null, rect: { x: 1963, y: 1871, width: 305, height: 930 } },
];

export const BOXES_LAYOUTS: Record<Version, BoxesLayout> = {
    international: { width: 2150, height: 2800, zones: INTERNATIONAL_ZONES },
    french: { width: 2278, height: 2809, zones: FRENCH_ZONES },
};
