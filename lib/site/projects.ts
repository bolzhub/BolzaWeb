import { getLatestADRCover } from "@/lib/ADR/galleries";

export type Project = {
    id: string;
    title: string;
    href: string;
    color: string;
    previewImage?: string;
    imagePosition?: string;
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
            href: "#",
            color: "#6b7480",
        },
        {
            id: "projet-5",
            title: "Political Statement",
            href: "#",
            color: "#4a4a3d",
        },
    ];
}