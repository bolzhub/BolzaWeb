import type { MetadataRoute } from "next";
import { FACTIONS, factionPath } from "@/lib/BolzaBoxes/factions";
import { PUZZLES } from "@/lib/RootBrainTeasers/puzzles";

const BASE = "https://bolzanocrafts.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const paths = [
        "",
        "/BolzaBoxes",
        "/BolzaBoxes/configurations",
        ...FACTIONS.map((f) => `/BolzaBoxes/boxes/${f.slug}`),
        "/BolzaBoxes/making-of",
        "/BolzaBoxes/gallery",
        "/Recommendations",
        "/RootBrainTeasers",
        ...PUZZLES.map((p) => `/RootBrainTeasers/${p.number}`),
        "/herodotus",
        "/ADR",
    ];
    return paths.map((path) => ({ url: `${BASE}${path}` }));
}