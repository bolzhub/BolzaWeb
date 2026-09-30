"use client";

import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import BoxesImageMap from "@/components/BolzaBoxes/BoxesImageMap";
import BoxesScrollingBackground from "@/components/BolzaBoxes/BoxesScrollingBackground";
import BoxesTapHint from "@/components/BolzaBoxes/BoxesTapHint";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { mediaUrl } from "@/lib/media/url";

const BOXES_IMAGES = {
    international: mediaUrl("Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-English.png"),
    french: mediaUrl("Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-French-Marauder_box.png"),
};

const NAV_HEIGHT = "5rem"; // doit correspondre à h-20 dans BolzaBoxesNav
const SWITCH_ZONE = "6rem"; // espace réservé pour le switch en bas

export default function BoxesPage() {
    const { version } = useVersion();
    const src = version === "french" ? BOXES_IMAGES.french : BOXES_IMAGES.international;

    return (
        <main className="relative h-[100svh] overflow-hidden">
            <BoxesScrollingBackground src={src} />

            <BolzaBoxesNav backgroundImageSrc={src} transparent />
            <VersionSwitch />

            <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center gap-3 px-4"
                style={{ top: NAV_HEIGHT, bottom: SWITCH_ZONE }}
            >
                <BoxesTapHint />
                <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                    <BoxesImageMap src={src} />
                </div>
            </div>
        </main>
    );
}