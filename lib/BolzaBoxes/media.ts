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

// 🧩 Modèles 3D (STL du dossier Models/) affichés en vue Mesh et proposés au téléchargement.
// Le STL est converti à la volée en GLB pour le visualiseur ; le téléchargement donne le STL d'origine.
// Tiroirs : Drawers/Snap_fit/Final (un tiroir n'a pas de variante avec / sans vitre).
// Conteneurs : Containers/With_window/Snap_fit (avec vitre seulement : pas encore de snap-fit sans vitre).
const MODELS = "Models";
const DRAWERS: Record<"international" | "french", Record<string, string>> = {
    international: {
        cats: "International/Drawers/Snap_fit/Final/EnD01-cats.stl",
        eyries: "International/Drawers/Snap_fit/Final/EnD02-eyries.stl",
        alliance: "International/Drawers/Snap_fit/Final/EnD03-alliance.stl",
        vagabond: "International/Drawers/Snap_fit/Final/EnD04.1Bis-vagabond.9_meeples.stl", // seul .1 de Final
        lizards: "International/Drawers/Snap_fit/Final/EnD05.1-lizards.main.stl",
        otters: "International/Drawers/Snap_fit/Final/EnD06-otters.stl",
        moles: "International/Drawers/Snap_fit/Final/EnD07-moles.stl",
        corvids: "International/Drawers/Snap_fit/Final/EnD08-corvids.stl",
        rats: "International/Drawers/Snap_fit/Final/EnD09-rats.stl",
        badgers: "International/Drawers/Snap_fit/Final/EnD10-badgers.stl",
        setup: "International/Drawers/Snap_fit/Final/EnDa-setup.stl",
        setup2: "International/Drawers/Snap_fit/Final/EnDa.2-setup2.stl",
        landmarks: "International/Drawers/Snap_fit/Final/EnDb.1-landmarks.first.stl",
    },
    french: {
        cats: "French/Drawers/Snap_fit/Final/FrD01.1-cats.main.stl",
        eyries: "French/Drawers/Snap_fit/Final/FrD02-eyries.stl",
        alliance: "French/Drawers/Snap_fit/Final/FrD03-alliance.stl",
        vagabond: "French/Drawers/Snap_fit/Final/FrD04.1-vagabond.9_meeples.stl",
        lizards: "French/Drawers/Snap_fit/Final/FrD05.1-lizards.main.stl",
        otters: "French/Drawers/Snap_fit/Final/FrD06-otters.stl",
        moles: "French/Drawers/Snap_fit/Final/FrD07-moles.stl",
        corvids: "French/Drawers/Snap_fit/Final/FrD08-corvids.stl",
        rats: "French/Drawers/Snap_fit/Final/FrD09-rats.stl",
        badgers: "French/Drawers/Snap_fit/Final/FrD10-badgers.stl",
        setup: "French/Drawers/Snap_fit/Final/FrDa-setup.stl",
        landmarks: "French/Drawers/Snap_fit/Final/FrDb.1-landmarks.first.stl",
        "hirelings-setup": "French/Drawers/Snap_fit/Final/FrDc.a-hireling.setup.stl",
        "hirelings-unique": "French/Drawers/Snap_fit/Final/FrDc.0.1-hirelings.porcupines_stag_weasels.stl",
        "hirelings-factions": "French/Drawers/Snap_fit/Final/FrDc.1.1-hirelings.cats_eyries.stl",
    },
};
// Second tiroir (objet drawer2, « Drawer 2 » sur le site)
const DRAWERS_2: Record<"international" | "french", Record<string, string>> = {
    international: { vagabond: "International/Drawers/Snap_fit/Final/EnD04.2-vagabond.cardboard.stl" },
    french: { vagabond: "French/Drawers/Snap_fit/Final/FrD04.2-vagabond.cardboard.stl" },
};
const CONTAINERS: Record<"international" | "french", Record<string, string>> = {
    international: {
        cats: "International/Containers/With_window/Snap_fit/EnC01-cats-975.stl",
        eyries: "International/Containers/With_window/Snap_fit/EnC02-eyries-900.stl",
        alliance: "International/Containers/With_window/Snap_fit/EnC03-alliance-850.stl",
        vagabond: "International/Containers/With_window/Snap_fit/EnC04-vagabond-950.stl",
        lizards: "International/Containers/With_window/Snap_fit/C-En-Lizards-875.stl",
        otters: "International/Containers/With_window/Snap_fit/EnC06-otters-0.4_compatible_fixed.stl",
        moles: "International/Containers/With_window/Snap_fit/C-En-Moles-725-OK.stl",
        corvids: "International/Containers/With_window/Snap_fit/C-En-Corvids-875-OK.stl",
        rats: "International/Containers/With_window/Snap_fit/EnC09-rats-950.stl",
        badgers: "International/Containers/With_window/Snap_fit/C-En-Badgers.stl",
        frogs: "International/Containers/With_window/Snap_fit/EnC12-frogs-900.stl",
        bats: "International/Containers/With_window/Snap_fit/EnC11-bats.stl",
        skunks: "International/Containers/With_window/Snap_fit/EnC13-skunks-900_fixed.stl",
        setup: "International/Containers/With_window/Snap_fit/EnCa-setup/FrCa-setup-975.stl",
        setup2: "International/Containers/With_window/Snap_fit/EnCa.2-setup.2.stl",
        landmarks: "International/Containers/With_window/Snap_fit/EnCb-landmarks.stl",
    },
    french: {
        cats: "French/Containers/With_window/Snap_fit/FrC01-cats/C-Fr-Cats-875.stl",
        eyries: "French/Containers/With_window/Snap_fit/FrC02-eyries/FrC02-eyries-800.stl",
        alliance: "French/Containers/With_window/Snap_fit/FrC03-alliance/FrC03-alliance-850.stl",
        vagabond: "French/Containers/With_window/Snap_fit/FrC04-vagabond/FrC04-vagabond-950.stl",
        lizards: "French/Containers/With_window/Snap_fit/FrC05-lizards/C-Fr-Lizards-900.stl",
        otters: "French/Containers/With_window/Snap_fit/FrC06-otters/FrC06-otters-0.4_compatible_fixed.stl",
        moles: "French/Containers/With_window/Snap_fit/FrC07-moles/FrC07-moles-750.stl",
        corvids: "French/Containers/With_window/Snap_fit/FrC08-corvids/FrC08-corvids-875-OK.stl",
        rats: "French/Containers/With_window/Snap_fit/FrC09-rats/FrC09-rats-825.stl",
        badgers: "French/Containers/With_window/Snap_fit/FrC10-badgers/FrC10-badgers-800.stl",
        setup: "French/Containers/With_window/Snap_fit/FrCa-setup/FrCa-setup-975.stl",
        landmarks: "French/Containers/With_window/Snap_fit/FrCb-landmarks.stl",
    },
};

// 🎬 Vidéos de présentation (version française), réencodées pour le web depuis Workshop/11-Videos/Result/
// (les .mov d'origine, à 11 Mbit/s, sont trop lourds pour être servis depuis la Pi)
const VIDEOS = "Workshop/11-Videos/Web";
const FRENCH_VIDEOS: Record<string, string> = {
    cats: "Marquise_de_Cat.mp4",
    eyries: "Eyrie_Dynasties.mp4",
    alliance: "Woodland_Alliance.mp4",
    lizards: "Lizard_Cult.mp4",
    otters: "Riverfolk_Company.mp4",
    moles: "Underground_Duchy.mp4",
    corvids: "Corvid_Conspiracy.mp4",
    rats: "Lord_of_the_Hundreds.mp4",
    badgers: "Keepers_in_Iron.mp4",
    setup: "Setup.mp4",
};

function videoEntries(): Record<string, string> {
    const entries: Record<string, string> = {};
    for (const [slug, file] of Object.entries(FRENCH_VIDEOS)) {
        entries[`${slug}/french/box-video-glass`] = `${VIDEOS}/${file}`;
        entries[`${slug}/french/box-video-no-glass`] = `${VIDEOS}/${file}`;
    }
    return entries;
}

function modelEntries(): Record<string, string> {
    const entries: Record<string, string> = {};
    for (const version of ["international", "french"] as const) {
        for (const [slug, file] of Object.entries(DRAWERS[version])) {
            entries[`${slug}/${version}/drawer-mesh-glass`] = `${MODELS}/${file}`; // tiroir : pas de variante vitre
        }
        for (const [slug, file] of Object.entries(DRAWERS_2[version])) {
            entries[`${slug}/${version}/drawer2-mesh-glass`] = `${MODELS}/${file}`;
        }
        for (const [slug, file] of Object.entries(CONTAINERS[version])) {
            entries[`${slug}/${version}/container-mesh-glass`] = `${MODELS}/${file}`;
        }
    }
    return entries;
}

// 🎯 Fichiers des pages Boîtes pris ailleurs que dans le dossier par défaut.
// Clé : "<slug>/<version>/<objet>-<vue>-<vitre>" (sans extension) ; "*" à la place de la version = les deux.
// Valeur : chemin du fichier, relatif au dossier du projet. Une entrée ici l'emporte sur le placeholder.
//   objets : container, box, drawer, drawer2 (second tiroir), holder — vues : full, empty, logos, mesh, video, in-box, stickers
//   vitre : glass (Window / Avec vitre), no-glass (No Window / Sans vitre) ; toujours glass pour un tiroir
//   (vue video : objet box, la vidéo montre l'ensemble)
// Pour la vue mesh, un .stl ou un .glb convient.
export const FACTION_FILES: Record<string, string> = {
    ...modelEntries(),
    ...videoEntries(),
    // "cats/international/box-full-glass": "Workshop/9-Photoshoot/Scenes/photo2.jpg",
};

export function projectMediaUrl(relativePath: string, width?: number): string {
    return mediaUrl(`${PROJECT_ROOT}/${relativePath}`, width);
}
