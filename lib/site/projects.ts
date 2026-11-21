// import { getLatestADRCover } from "@/lib/ADR/galleries";
import type { Lang, Localized } from "@/lib/i18n/lang";

export type ProjectBadge = {
    title: string;
    href: string;
    corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export type Project = {
    id: string;
    title: string;
    href: string;
    color: string;
    previewImage?: string;
    imagePosition?: string;
    imagePositionX?: "left" | "center" | "right"; // horizontale
    badge?: ProjectBadge; // petit disque superposé en coin, menant à un sous-site lié
};

type ProjectData = Omit<Project, "title" | "badge"> & {
    title: Localized;
    badge?: Omit<ProjectBadge, "title"> & { title: Localized };
};

export function getProjects(lang: Lang): Project[] {
    return PROJECTS.map((p) => ({
        ...p,
        title: p.title[lang],
        badge: p.badge && { ...p.badge, title: p.badge.title[lang] },
    }));
}

const PROJECTS: ProjectData[] = [
    {
        id: "bolzaboxes",
        title: { en: "Root BolzaBoxes", fr: "Root BolzaBoxes" },
        href: "/BolzaBoxes",
        color: "#6b7a6b",
        previewImage: "/projects/BolzaBoxes/cover.jpg",
        imagePosition: "top",
        imagePositionX: "left",
        badge: {
            title: { en: "Root Brain Teasers", fr: "Casse-têtes Root" },
            href: "/RootBrainTeasers",
            corner: "top-right",
        },
    },
    {
        id: "herodotus",
        title: { en: "Herodotus The Owl", fr: "La Chouette Hérodote" },
        href: "/herodotus",
        color: "#4a4a3d",
        previewImage: "/projects/herodotus/cover.png",
        imagePosition: "top",
    },
    {
        id: "adr",
        title: { en: "Life Drawing", fr: "Modèle vivant" },
        href: "/ADR",
        color: "#8a7862",
        previewImage: "/projects/ADR/cover.png", //getLatestADRCover(),
    },
    {
        id: "tintin",
        title: { en: "Tintin", fr: "Tintin" },
        href: "/tintin",
        color: "#8a6d3b",
        previewImage: "/projects/tintin/cover.jpg",
        imagePosition: "top",
        imagePositionX: "right",
    },
    {
        id: "recommendations",
        title: { en: "Recommendations", fr: "Recommandations" },
        href: "/Recommendations",
        color: "#6b7480",
        previewImage: "/projects/recommendations/cover.png",
        imagePosition: "bottom",
        imagePositionX: "left",
    },
    {
        id: "projet-5",
        title: { en: "Political Statement", fr: "Prise de position politique" },
        href: "#",
        color: "#4a4a3d",
    },
    {
        id: "red-flags",
        title: { en: "Red Flags Game", fr: "Jeu des Red Flags" },
        href: "/RedFlags",
        color: "#2a0b11",
        previewImage: "/projects/red-flags/cover.svg",
    },
];
