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

export type PuzzleImagePaths = {
    rules?: string;
    teaser?: string;
    solution?: string;
};

export type Puzzle = {
    number: number;
    description: string;
    color?: PuzzleColor;
    href?: string;
    images?: PuzzleImagePaths; // chemins relatifs à la racine du disque, SANS "/api/media/"
};

// Lien de l'icône placée au début de la liste (assets pour créer ses propres puzzles)
export const ASSETS_LINK = {
    href: "#", // TODO : adresse réelle (page interne ou lien externe)
    label: "Make your own",
    description: "Download the assets and build your own puzzles.",
};

export const PUZZLES: Puzzle[] = [
    {
        number: 1,
        color: "purple",
        description: "Puzzle proposed during 2025 French National competition. Win with Corvids.",
        images: {
            rules: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_rules.png",       // TODO : chemins réels
            teaser: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle.jpg",
            solution: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_solution.png",
        },
    },
    {
        number: 2,
        color: "darkbrown",
        description: "Puzzle A proposed during 2025 French National competition. Trivia question.",
        images: {
            rules: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_rules.png",       // TODO : chemins réels
            teaser: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle.jpg",
            solution: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_solution.png",
        },
    },
    {
        number: 3,
        color: "greywhite",
        description: "Puzzle B proposed during 2025 French National competition. Win with Vagabond at very first turn of the game.",
        images: {
            rules: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_rules.png",       // TODO : chemins réels
            teaser: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle.jpg",
            solution: "/api/media/Projets/Root_Puzzles/CdF_2025/Rendu/puzzle_solution.png",
        },
    },
];