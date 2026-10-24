import type { Metadata } from "next";
import { ReactNode } from "react";
import { VersionProvider } from "@/lib/BolzaBoxes/VersionContext";

export const metadata: Metadata = {
    title: "Root BolzaBoxes",
    description: "3D-printed storage boxes for the board game Root.",
};

export default function BolzaBoxesLayout({ children }: { children: ReactNode }) {
    return <VersionProvider>{children}</VersionProvider>;
}