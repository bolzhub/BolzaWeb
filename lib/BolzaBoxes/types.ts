import type { Localized } from "@/lib/i18n/lang";

export type ObjectType = "box" | "drawer" | "container" | "holder";
export type ViewModeType = "image" | "video" | "mesh" | "link";
export type Glass = "glass" | "no-glass";

export type ViewMode = {
    id: string;
    label: Localized;
    type: ViewModeType;
};

export type Faction = {
    slug: string;
    name: Localized;
    color: string;
    icon: string;
    description: Localized;
    buyUrl?: string;
    objects: ObjectType[];
};

export const OBJECT_TYPES: { id: ObjectType; label: Localized }[] = [
    { id: "container", label: { en: "Container", fr: "Conteneur" } },
    { id: "box", label: { en: "Box", fr: "Boîte" } },
    { id: "drawer", label: { en: "Drawer", fr: "Tiroir" } },
    { id: "holder", label: { en: "Holder", fr: "Support" } },
];

// 🎛️ Ajustez cette liste si vous ajoutez/retirez des modes de vue
export const VIEW_MODES: ViewMode[] = [
    { id: "full", label: { en: "Full", fr: "Pleine" }, type: "image" },
    { id: "empty", label: { en: "Empty", fr: "Vide" }, type: "image" },
    { id: "logos", label: { en: "Logos", fr: "Logos" }, type: "image" },
    { id: "mesh", label: { en: "Mesh", fr: "Maillage 3D" }, type: "mesh" },
    { id: "video", label: { en: "Video", fr: "Vidéo" }, type: "video" },
    { id: "in-box", label: { en: "In Box", fr: "Dans la boîte" }, type: "image" },
    { id: "stickers", label: { en: "Stickers", fr: "Autocollants" }, type: "image" },
    { id: "buy", label: { en: "Buy", fr: "Acheter" }, type: "link" },
];

const EXT_BY_TYPE: Record<ViewModeType, string> = {
    image: "jpg",
    video: "mp4",
    mesh: "glb",
    link: "",
};

// Dossier des fichiers de chaque boîte sur le disque de la Pi :
// /mnt/Bolzananas/Projets/Root_Organiser/Extra/Presentation/Website/Boxes/<slug>/
export const FACTION_ASSETS_URL = "/api/media/Projets/Root_Organiser/Extra/Presentation/Website/Boxes";

export function getAssetPath(factionSlug: string, objectType: ObjectType, viewMode: ViewMode, glass: Glass): string {
    const ext = EXT_BY_TYPE[viewMode.type];
    return `${FACTION_ASSETS_URL}/${factionSlug}/${objectType}-${viewMode.id}-${glass}.${ext}`;
}
