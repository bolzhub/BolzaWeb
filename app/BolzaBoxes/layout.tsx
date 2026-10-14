import type { Metadata } from "next";
import { ReactNode } from "react";
import { VersionProvider } from "@/lib/BolzaBoxes/VersionContext";

export const metadata: Metadata = {
    title: "Root BolzaBoxes",
    description: "Boîtes de rangement imprimées en 3D pour le jeu Root.",
};

export default function BolzaBoxesLayout({ children }: { children: ReactNode }) {
    return <VersionProvider>{children}</VersionProvider>;
}