import { BOX_ZONES } from "./boxesZones";
import { colorFromLabel } from "./colors";
import type { Faction } from "./types";

// 🎛️ Renseignez ici le nom affiché, la description et le lien d'achat
// de chaque faction. Toute faction absente de cette liste récupère un
// nom généré depuis son slug et une description provisoire.
const FACTION_DETAILS: Record<
    string,
    { name: string; description: string; buyUrl?: string }
> = {
    lizards: {
        name: "The Lizard Cult",
        description:
            "25 warriors, 1 stone patron. Lizard head with tongue on the side.",
        buyUrl: "#",
    },
};

function slugFromHref(href: string): string {
    return href.split("/").filter(Boolean).pop()!;
}

function toTitleCase(slug: string): string {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
}

const seenSlugs = new Set<string>();

export const FACTIONS: Faction[] = BOX_ZONES.filter((zone) => {
    if (!zone.href) return false;
    const slug = slugFromHref(zone.href);
    if (seenSlugs.has(slug)) return false; // une faction peut couvrir plusieurs zones
    seenSlugs.add(slug);
    return true;
}).map((zone) => {
    const slug = slugFromHref(zone.href!);
    const details = FACTION_DETAILS[slug];
    return {
        slug,
        name: details?.name ?? toTitleCase(slug),
        color: colorFromLabel(zone.label),
        icon: `/projects/BolzaBoxes/factions/${slug}/icon.svg`,
        description: details?.description ?? "Description à venir.",
        buyUrl: details?.buyUrl,
    };
});

export function getFactionBySlug(slug: string): Faction | undefined {
    return FACTIONS.find((f) => f.slug === slug);
}