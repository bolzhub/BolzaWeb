import { mediaUrl } from "@/lib/media/url";

// 📁 Tous les fichiers du projet BolzaBoxes affichés par le site, en un seul endroit.
// Chemins relatifs au dossier du projet : /mnt/Bolzananas/Projets/Root_BolzaBoxes sur la Pi
// (~/Projets/Root_BolzaBoxes sur les autres machines). Après un déplacement de fichier, c'est ici qu'on corrige.
export const PROJECT_ROOT = "Projets/Root_BolzaBoxes";

export const MEDIA = {
    // Grande image de l'accueil (et, en attendant, de Galerie et Making of)
    hero: {
        international: "Workshop/9-Photoshoot/Scenes/signal-2026-05-10-161743_005.jpeg",
        french: "Workshop/9-Photoshoot/Scenes/main.png",
    },
    // Image des blocs de présentation de l'accueil
    section: {
        international: "Workshop/9-Photoshoot/Scenes/English_prototypes.jpg",
        french: "Workshop/9-Photoshoot/Scenes/photo2.jpg",
    },
    // Plan cliquable de la page Configurations
    boxesMap: {
        international: "Workshop/4-Game_box_layouts/International/side_designs-English.png",
        french: "Workshop/4-Game_box_layouts/French_Marauder/side_designs-French.png",
    },
    // Dossier par défaut des pages Boîtes : Factions/<slug>/icon.svg et Factions/<slug>/<version>/<fichier>,
    // le fichier étant nommé <objet>-<vue>-<vitre>.<ext> (ex. box-full-glass.jpg, drawer-mesh-no-glass.glb)
    factions: "Workshop/12-Website/Factions",
};

// 🎯 Fichiers des pages Boîtes pris ailleurs que dans le dossier par défaut.
// Clé : "<slug>/<version>/<objet>-<vue>-<vitre>" (sans extension) ; "*" à la place de la version = les deux.
// Valeur : chemin du fichier, relatif au dossier du projet. Une entrée ici l'emporte sur le placeholder.
//   objets : container, box, drawer, holder — vues : full, empty, logos, mesh, video, in-box, stickers
//   vitre : glass (Window / Avec vitre), no-glass (No Window / Sans vitre)
export const FACTION_FILES: Record<string, string> = {
    // "cats/international/box-full-glass": "Workshop/9-Photoshoot/Scenes/photo2.jpg",
    // "cats/*/drawer-mesh-no-glass": "Models/International/Cats/drawer.glb",
};

export function projectMediaUrl(relativePath: string, width?: number): string {
    return mediaUrl(`${PROJECT_ROOT}/${relativePath}`, width);
}
