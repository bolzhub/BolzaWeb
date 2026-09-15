import { getLatestADRCover } from "./galleries";

export type Project = {
    id: string;
    title: string;
    href: string;
    color: string;
    previewImage?: string;
};

export function getProjects(): Project[] {
    return [
        {
            id: "adr",
            title: "Life Drawing",
            href: "/ADR",
            color: "#8a7862",
            previewImage: getLatestADRCover(),
        },
        {
            id: "projet-2",
            title: "Projet 2",
            href: "#",
            color: "#6b7a6b",
        },
        {
            id: "projet-3",
            title: "Projet 3",
            href: "#",
            color: "#7a6b70",
        },
        {
            id: "projet-4",
            title: "Projet 4",
            href: "#",
            color: "#6b7480",
        },
    ];
}