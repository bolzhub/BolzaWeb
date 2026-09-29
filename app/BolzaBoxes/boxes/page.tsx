"use client";

import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import BoxesImageMap from "@/components/BolzaBoxes/BoxesImageMap";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";

const BOXES_IMAGES = {
    international: "/api/media/Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-English.png",
    french: "/api/media/Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-French-Marauder_box.png",
};

const PAGE_BG = "#c8c7b7"; // couleur de fond extraite de l'image elle-même

export default function BoxesPage() {
    const { version } = useVersion();
    const src = version === "french" ? BOXES_IMAGES.french : BOXES_IMAGES.international;

    return (
        <main className="relative min-h-[100svh]" style={{ backgroundColor: PAGE_BG }}>
            <BolzaBoxesNav backgroundImageSrc={src} />
            <VersionSwitch />

            <div className="pt-24 pb-10 px-4 flex items-center justify-center min-h-[100svh]">
                <BoxesImageMap src={src} />
            </div>
        </main>
    );
}