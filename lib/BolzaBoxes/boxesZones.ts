export const BOXES_IMAGE_WIDTH = 2150;
export const BOXES_IMAGE_HEIGHT = 2800;

export type BoxZone = {
    id: string;
    label: string;
    href: string | null; // null tant que la sous-page n'existe pas
    rect: { x: number; y: number; width: number; height: number };
};

export const BOX_ZONES: BoxZone[] = [
    // --- Rangée 1 ---
    { id: "col1-orange", label: "Colonne orange", href: null, rect: { x: 0, y: 0, width: 274, height: 935 } },
    { id: "col2-bleu", label: "Colonne bleue", href: null, rect: { x: 274, y: 0, width: 256, height: 935 } },
    { id: "col3-vert", label: "Colonne verte", href: null, rect: { x: 530, y: 0, width: 165, height: 935 } },
    { id: "col4-jaune", label: "Colonne jaune", href: null, rect: { x: 695, y: 0, width: 252, height: 935 } },
    { id: "col5-turquoise", label: "Colonne turquoise", href: null, rect: { x: 947, y: 0, width: 216, height: 935 } },
    { id: "col6-violet", label: "Colonne violette", href: null, rect: { x: 1163, y: 0, width: 223, height: 935 } },
    { id: "col7-blanc", label: "Colonne blanche/grise", href: null, rect: { x: 1386, y: 0, width: 446, height: 935 } },
    { id: "col8-noir", label: "Colonne noire", href: null, rect: { x: 1832, y: 0, width: 318, height: 935 } },

    // --- Rangée 2 ---
    { id: "col9-peche", label: "Colonne pêche", href: null, rect: { x: 0, y: 940, width: 300, height: 925 } },
    { id: "col10-rouge", label: "Colonne rouge", href: null, rect: { x: 300, y: 940, width: 360, height: 925 } },
    { id: "col11-gris", label: "Colonne grise", href: null, rect: { x: 660, y: 940, width: 295, height: 925 } },
    { id: "col12-olive", label: "Colonne olive", href: null, rect: { x: 955, y: 940, width: 350, height: 925 } },
    { id: "col13-brunroux", label: "Colonne brun-roux", href: null, rect: { x: 1305, y: 940, width: 250, height: 925 } },
    { id: "col14-brunfonce", label: "Colonne brun foncé (temple)", href: null, rect: { x: 1555, y: 940, width: 270, height: 925 } },
];