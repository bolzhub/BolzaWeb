import type { Localized } from "@/lib/i18n/lang";

// Couleurs des boîtes Root, utilisables par nom
export const PUZZLE_COLORS = {
    orange: "#F3852A",
    blue: "#4F64A8",
    green: "#3AAA42",
    yellow: "#F5F187",
    teal: "#5FC6C1",
    purple: "#9764A8",
    red: "#E3293C",
    pink: "#F78BA9",
    greywhite: "#d8d3c8",
    darkbrown: "#4a3222",
} as const;

export type PuzzleColor = keyof typeof PUZZLE_COLORS;

export type PuzzleFiles = {
    rules?: string; // PDF
    teaser?: string; // image (jpg, png…)
    solution?: string; // PDF
};

export type Puzzle = {
    number: number;
    description: Localized;
    color?: PuzzleColor;
    href?: string;
    files?: PuzzleFiles; // même formats de chemins que pour les autres images
};

// Lien de l'icône placée au début de la liste (assets pour créer ses propres puzzles)
export const ASSETS_LINK = {
    href: "#", // TODO : adresse réelle (page interne ou lien externe)
    label: { en: "Make your own", fr: "Crée les tiens" } as Localized,
    description: {
        en: "Download the assets and build your own puzzles.",
        fr: "Télécharge les ressources et construis tes propres puzzles.",
    } as Localized,
};

export const PUZZLES: Puzzle[] = [
    {
        number: 1,
        color: "purple",
        description: {
            en: "Puzzle proposed during the 2025 French national championship. Win with the Corvids.",
            fr: "Puzzle proposé lors du Championnat de France 2025. Gagne avec les Corvidés.",
        },
        files: {
            rules: "/api/media/Crafts/Root_Brain_Teasers/CdF_2025/Rendu/puzzle_rules.pdf",
            teaser: "/api/media/Crafts/Root_Brain_Teasers/CdF_2025/Rendu/puzzle.png",
            solution: "/api/media/Crafts/Root_Brain_Teasers/CdF_2025/Rendu/puzzle_solution.pdf",
        },
    },
    {
        number: 2,
        color: "darkbrown",
        description: {
            en: "Puzzle A proposed during the 2026 French national championship. Trivia question.",
            fr: "Puzzle A proposé lors du Championnat de France 2026. Question de culture Root.",
        },
        files: {
            rules: "/api/media/Crafts/Root_Brain_Teasers/CdF_2026/Puzzle_A/puzzle_rules.pdf",
        },
    },
    {
        number: 3,
        color: "greywhite",
        description: {
            en: "Puzzle B proposed during the 2026 French national championship. Win with the Vagabond on the very first turn of the game.",
            fr: "Puzzle B proposé lors du Championnat de France 2026. Gagne avec le Vagabond dès le tout premier tour de la partie.",
        },
        files: {
            rules: "/api/media/Crafts/Root_Brain_Teasers/CdF_2026/Puzzle_B/Rendu/puzzle_rules.pdf",
            teaser: "/api/media/Crafts/Root_Brain_Teasers/CdF_2026/Puzzle_B/Rendu/puzzle.png",
            solution: "/api/media/Crafts/Root_Brain_Teasers/CdF_2026/Puzzle_B/Rendu/puzzle_solution.pdf",
        },
    },
];
