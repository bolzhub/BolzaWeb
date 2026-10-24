// import { getLatestADRCover } from "@/lib/ADR/galleries";

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

export function getProjects(): Project[] {
    return [
        {
            id: "bolzaboxes",
            title: "Root BolzaBoxes",
            href: "/BolzaBoxes",
            color: "#6b7a6b",
            previewImage: "/projects/BolzaBoxes/cover.jpg",
            imagePosition: "top",
            imagePositionX: "left",
            badge: { title: "Root Brain Teasers", href: "/RootBrainTeasers", corner: "top-right" },
        },
        {
            id: "herodotus",
            title: "Herodotus The Owl",
            href: "/herodotus",
            color: "#4a4a3d",
            previewImage: "/projects/herodotus/cover.png",
            imagePosition: "top",
        },
        {
            id: "adr",
            title: "Life Drawing",
            href: "/ADR",
            color: "#8a7862",
            previewImage: "/projects/ADR/cover.png",//getLatestADRCover(),
        },
        {
            id: "recommendations",
            title: "Recommendations",
            href: "/Recommendations",
            color: "#6b7480",
            previewImage: "/projects/recommendations/cover.png",
            imagePosition: "bottom",
            imagePositionX: "left",
        },
        {
            id: "projet-5",
            title: "Political Statement",
            href: "#",
            color: "#4a4a3d",
        },
    ];
}