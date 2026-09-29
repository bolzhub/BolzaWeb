"use client";

import { ReactNode } from "react";
import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import ScrollHint from "@/components/BolzaBoxes/ScrollHint";

export type HeroImages = {
    international: string;
    french: string;
};

export default function BolzaBoxesShell({
    heroImages,
    children,
}: {
    heroImages: HeroImages;
    children: ReactNode;
}) {
    const { version } = useVersion();
    const heroImage = version === "french" ? heroImages.french : heroImages.international;

    return (
        <main className="relative overflow-hidden">
            <div className="relative min-h-[100svh]">
                <img
                    src={heroImage}
                    alt=""
                    className="fixed inset-0 w-full h-full object-cover -z-10"
                />
                <BolzaBoxesNav backgroundImageSrc={heroImage} />
                <ScrollHint />
                <VersionSwitch />
            </div>

            {children}
        </main>
    );
}