import type { Metadata } from "next";
import { ReactNode } from "react";
import { VersionProvider } from "@/lib/BolzaBoxes/VersionContext";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
    const lang = await getLang();
    return {
        title: "Root BolzaBoxes",
        description:
            lang === "fr"
                ? "Des boîtes de rangement imprimées en 3D pour le jeu de société Root."
                : "3D-printed storage boxes for the board game Root.",
    };
}

export default function BolzaBoxesLayout({ children }: { children: ReactNode }) {
    return <VersionProvider>{children}</VersionProvider>;
}
