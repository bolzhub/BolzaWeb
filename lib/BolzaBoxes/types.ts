import type { Localized } from "@/lib/i18n/lang";
import type { Version } from "./VersionContext";
import { GLB_VERSION } from "@/lib/media/glbVersion";
import { FACTION_FILES, MEDIA, PROJECT_ROOT, projectMediaUrl } from "./media";

export type ObjectType = "box" | "drawer" | "drawer2" | "drawer3" | "drawer4" | "container" | "holder";
export const DRAWER_IDS: ObjectType[] = ["drawer", "drawer2", "drawer3", "drawer4"];
export type ViewModeType = "image" | "video" | "mesh" | "link";
export type Glass = "glass" | "no-glass";

export type ViewMode = {
    id: string;
    label: Localized;
    type: ViewModeType;
    hidden?: boolean; // vue masquée sur le site (fichiers et placeholders conservés)
};

export type Faction = {
    slug: string;
    name: Localized;
    color: string;
    icon: string;
    description?: Localized;
    buyUrl?: string;
    objects: ObjectType[];
    // Tiroirs par version, avec leur nom (un seul « Drawer » si la version n'est pas listée) ;
    // sur le site ce sont les objets drawer, drawer2, drawer3, drawer4, dans cet ordre
    drawers?: Partial<Record<Version, Localized[]>>;
};

export const OBJECT_TYPES: { id: ObjectType; label: Localized }[] = [
    { id: "container", label: { en: "Container", fr: "Conteneur" } },
    { id: "box", label: { en: "Box", fr: "Boîte" } },
    { id: "drawer", label: { en: "Drawer", fr: "Tiroir" } },
    { id: "drawer2", label: { en: "Drawer 2", fr: "Tiroir 2" } }, // tiroirs supplémentaires (voir Faction.drawers)
    { id: "drawer3", label: { en: "Drawer 3", fr: "Tiroir 3" } },
    { id: "drawer4", label: { en: "Drawer 4", fr: "Tiroir 4" } },
    { id: "holder", label: { en: "Holder", fr: "Support" } },
];

// 🎛️ Ajustez cette liste si vous ajoutez/retirez des modes de vue
export const VIEW_MODES: ViewMode[] = [
    { id: "full", label: { en: "Full", fr: "Pleine" }, type: "image" },
    { id: "empty", label: { en: "Empty", fr: "Vide" }, type: "image" },
    { id: "logos", label: { en: "Logos", fr: "Logos" }, type: "image", hidden: true },
    { id: "mesh", label: { en: "Mesh", fr: "Maillage 3D" }, type: "mesh" },
    { id: "video", label: { en: "Video", fr: "Vidéo" }, type: "video" },
    { id: "in-box", label: { en: "In Box", fr: "Dans la boîte" }, type: "image", hidden: true },
    { id: "stickers", label: { en: "Stickers", fr: "Autocollants" }, type: "image", hidden: true },
    { id: "buy", label: { en: "Buy", fr: "Acheter" }, type: "link" },
];

const EXT_BY_TYPE: Record<ViewModeType, string> = {
    image: "jpg",
    video: "mp4",
    mesh: "glb",
    link: "",
};

// Fichiers de chaque boîte : voir lib/BolzaBoxes/media.ts (dossier par défaut et fichiers pris ailleurs)
export const FACTION_ASSETS_RELATIVE = `${PROJECT_ROOT}/${MEDIA.factions}`;
export const FACTION_ASSETS_URL = `/api/media/${FACTION_ASSETS_RELATIVE}`;

// Nom du fichier d'une vue dans le dossier par défaut, identique dans les deux dossiers de version
export function assetFileName(objectType: ObjectType, viewMode: ViewMode, glass: Glass): string {
    return `${objectType}-${viewMode.id}-${glass}.${EXT_BY_TYPE[viewMode.type]}`;
}

export const isDrawer = (o: ObjectType) => DRAWER_IDS.includes(o);

// Objets d'une faction dans une version : « drawer » est remplacé par autant de tiroirs que la version en a
export function factionObjects(faction: Faction, version: Version): ObjectType[] {
    const count = faction.drawers?.[version]?.length ?? 1;
    return faction.objects.flatMap((o) => (o === "drawer" ? DRAWER_IDS.slice(0, count) : [o]));
}

// Nom affiché d'un objet (le nom propre d'un tiroir s'il en a un dans cette version)
export function objectLabel(faction: Faction, id: ObjectType, lang: "en" | "fr", version: Version): string {
    const names = faction.drawers?.[version];
    const index = DRAWER_IDS.indexOf(id);
    if (names && index !== -1 && names[index]) return names[index][lang];
    return OBJECT_TYPES.find((o) => o.id === id)!.label[lang];
}

// Un tiroir est le même avec ou sans vitre : ses fichiers sont toujours ceux « glass »
export function effectiveGlass(objectType: ObjectType, glass: Glass): Glass {
    return isDrawer(objectType) ? "glass" : glass;
}

const IMAGE_WIDTH = 1600;

// Chemin d'une vue relatif au dossier du projet : fichier désigné dans FACTION_FILES, sinon dossier par défaut
export function assetRelativePath(
    factionSlug: string,
    version: Version,
    objectType: ObjectType,
    viewMode: ViewMode,
    glass: Glass,
): string {
    glass = effectiveGlass(objectType, glass);
    const name = `${objectType}-${viewMode.id}-${glass}`;
    const chosen = FACTION_FILES[`${factionSlug}/${version}/${name}`] ?? FACTION_FILES[`${factionSlug}/*/${name}`];
    return chosen ?? `${MEDIA.factions}/${factionSlug}/${version}/${assetFileName(objectType, viewMode, glass)}`;
}

export function getAssetPath(
    factionSlug: string,
    version: Version,
    objectType: ObjectType,
    viewMode: ViewMode,
    glass: Glass,
): string {
    const relative = assetRelativePath(factionSlug, version, objectType, viewMode, glass);
    const url = projectMediaUrl(relative);
    // Un modèle STL est converti en GLB par /api/media pour le visualiseur 3D
    if (relative.toLowerCase().endsWith(".stl")) return `${url}?as=glb&v=${GLB_VERSION}`;
    // Photos : version WebP réduite (les originaux font 3024 px et plusieurs Mo)
    if (viewMode.type === "image") return `${url}?w=${IMAGE_WIDTH}`;
    return url;
}

// Lien de téléchargement d'une vue : fichier d'origine (STL ou GLB), sous un nom lisible
export function getDownloadPath(
    factionSlug: string,
    version: Version,
    objectType: ObjectType,
    viewMode: ViewMode,
    glass: Glass,
): string {
    const relative = assetRelativePath(factionSlug, version, objectType, viewMode, glass);
    const ext = relative.slice(relative.lastIndexOf("."));
    const name = isDrawer(objectType)
        ? `${factionSlug}-${version}-${objectType}${ext}`
        : `${factionSlug}-${version}-${objectType}-${glass}${ext}`;
    return `${projectMediaUrl(relative)}?download=${encodeURIComponent(name)}`;
}

// Vues proposées sur le site (sans celles masquées pour l'instant)
export const VISIBLE_VIEW_MODES = VIEW_MODES.filter((v) => !v.hidden);

export const MESH_VIEW = VIEW_MODES.find((v) => v.type === "mesh")!;

// Les meshs de remplacement générés portent cette signature dans leur en-tête glTF ("generator")
export const PLACEHOLDER_MESH_SIGNATURE = "BolzaBoxes placeholder";
