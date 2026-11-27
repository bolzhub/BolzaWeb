"use client";

import { ReactNode, useEffect } from "react";
import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import ScrollHint from "@/components/BolzaBoxes/ScrollHint";
import BolzaBoxesCredits from "@/components/BolzaBoxes/BolzaBoxesCredits";

export type HeroImages = {
    international: string;
    french: string;
};

// `hero` : contenu facultatif centré sur la photo du premier écran
export default function BolzaBoxesShell({
    heroImages,
    hero,
    children,
}: {
    heroImages: HeroImages;
    hero?: ReactNode;
    children: ReactNode;
}) {
    const { version } = useVersion();
    const heroImage = version === "french" ? heroImages.french : heroImages.international;

    // Précharge la photo de l'autre version : le passage Int/Fr est alors instantané
    useEffect(() => {
        new Image().src = version === "french" ? heroImages.international : heroImages.french;
    }, [version, heroImages]);

    return (
        <main className="relative overflow-hidden">
            <div className="relative min-h-[100svh]">
                <img src={heroImage} alt="" className="fixed inset-0 w-full h-full object-cover -z-10" />
                <BolzaBoxesNav background={{ type: "image", src: heroImage }} />
                {hero && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 [&>*]:pointer-events-auto">
                        {hero}
                    </div>
                )}
                <ScrollHint />
                <VersionSwitch />
            </div>

            {children}
            <BolzaBoxesCredits />
        </main>
    );
}
