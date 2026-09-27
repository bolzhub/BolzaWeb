"use client";

import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import AlternatingSections from "@/components/BolzaBoxes/AlternatingSections";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import { VersionProvider, useVersion } from "@/lib/BolzaBoxes/VersionContext";

const HERO_IMAGES = {
    international: "/data/Projets/Root_Organiser/Extra/Presentation/Newsletter/signal-2026-05-10-161743_005.jpeg",
    french: "/data/Projets/Root_Organiser/Extra/Presentation/Website/Home/main.png",
};

function BolzaBoxesContent() {
    const { version } = useVersion();
    const heroImage = version === "french" ? HERO_IMAGES.french : HERO_IMAGES.international;

    return (
        <main className="relative overflow-hidden">
            <div className="relative min-h-screen min-h-dvh">
                <img
                    src={heroImage}
                    alt=""
                    className="fixed inset-0 w-full h-full object-cover -z-10"
                />
                <BolzaBoxesNav backgroundImageSrc={heroImage} />
                <VersionSwitch />
            </div>

            <AlternatingSections />
        </main>
    );
}

export default function BolzaBoxesPage() {
    return (
        <VersionProvider>
            <BolzaBoxesContent />
        </VersionProvider>
    );
}