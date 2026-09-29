// Dossiers entiers rendus publics : tout fichier à l'intérieur (et dans
// leurs sous-dossiers) devient accessible.
export const PUBLIC_FOLDERS: string[] = [
    "Projets/ADR",
    "Projets/Root_Organiser"
    // "Projets/herodotus",
    // Ajoute ici chaque nouveau dossier que tu veux rendre public
];

// Fichiers isolés rendus publics, un par un, même s'ils se trouvent
// dans un dossier par ailleurs privé. Chemin exact, pas de préfixe.
export const PUBLIC_FILES: string[] = [
    // "Projets/Root_Organiser/Extra/Presentation/photo2.jpg",
    // "Projets/Root_Organiser/Extra/Presentation/side_designs-English.png",
    // Ajoute ici chaque nouveau fichier isolé que tu veux rendre public
];