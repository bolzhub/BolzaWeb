export type ObjectType = "box" | "drawer" | "container";
export type ViewModeType = "image" | "video" | "mesh" | "link";
export type Glass = "glass" | "no-glass";

export type ViewMode = {
    id: string;
    label: string;
    type: ViewModeType;
};

export type Faction = {
    slug: string;
    name: string;
    color: string;
    icon: string;
    description: string;
    buyUrl?: string;
};

export const OBJECT_TYPES: { id: ObjectType; label: string }[] = [
    { id: "container", label: "Container" },
    { id: "box", label: "Box" },
    { id: "drawer", label: "Drawer" },
];

// 🎛️ Ajustez cette liste si vous ajoutez/retirez des modes de vue
export const VIEW_MODES: ViewMode[] = [
    { id: "full", label: "Full", type: "image" },
    { id: "empty", label: "Empty", type: "image" },
    { id: "logos", label: "Logos", type: "image" },
    { id: "mesh", label: "Mesh", type: "mesh" },
    { id: "video", label: "Video", type: "video" },
    { id: "in-box", label: "In Box", type: "image" },
    { id: "stickers", label: "Stickers", type: "image" },
    { id: "buy", label: "Buy", type: "link" },
];

const EXT_BY_TYPE: Record<ViewModeType, string> = {
    image: "jpg",
    video: "mp4",
    mesh: "glb",
    link: "",
};

export function getAssetPath(
    factionSlug: string,
    objectType: ObjectType,
    viewMode: ViewMode,
    glass: Glass
): string {
    const ext = EXT_BY_TYPE[viewMode.type];
    return `/projects/BolzaBoxes/factions/${factionSlug}/${objectType}-${viewMode.id}-${glass}.${ext}`;
}