import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://bolzanocrafts.com";
    return [
        "",
        "/BolzaBoxes",
        "/BolzaBoxes/boxes",
        "/BolzaBoxes/configurations",
        "/BolzaBoxes/making-of",
        "/BolzaBoxes/gallery",
        "/Recommendations",
        "/herodotus",
        "/ADR",
    ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}