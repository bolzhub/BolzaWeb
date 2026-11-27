// Dossiers entiers rendus publics : tout fichier à l'intérieur (et dans
// leurs sous-dossiers) devient accessible.
export const PUBLIC_FOLDERS: string[] = [
    "Projets/Life_Drawing",
    "Crafts/Life_Drawing", // dessins archivés (hors synchronisation)
    "Projets/Root_BolzaBoxes",
    "Crafts/Root_Brain_Teasers", // puzzles (hors synchronisation)
    // "Projets/herodotus",
    // Ajoute ici chaque nouveau dossier que tu veux rendre public
];

// Fichiers isolés rendus publics, un par un, même s'ils se trouvent
// dans un dossier par ailleurs privé. Chemin exact, pas de préfixe.
export const PUBLIC_FILES: string[] = [
    // "Projets/Root_BolzaBoxes/Workshop/9-Photoshoot/Scenes/photo2.jpg",
    // Ajoute ici chaque nouveau fichier isolé que tu veux rendre public
];
