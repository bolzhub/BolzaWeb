"use client";

import { useEffect } from "react";

import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import BoxesImageMap from "@/components/BolzaBoxes/BoxesImageMap";
import BoxesScrollingBackground from "@/components/BolzaBoxes/BoxesScrollingBackground";
import BoxesTapHint from "@/components/BolzaBoxes/BoxesTapHint";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { mediaUrl } from "@/lib/media/url";
import { BOXES_LAYOUTS } from "@/lib/BolzaBoxes/boxesZones";

// Versions WebP réduites (les PNG d'origine pèsent 3 Mo chacun)
const BOXES_IMAGES = {
    international: mediaUrl("Projets/Root_BolzaBoxes/Extra/Presentation/Website/Boxes/side_designs-English.png", 1600),
    french: mediaUrl("Projets/Root_BolzaBoxes/Extra/Presentation/Website/Boxes/side_designs-French.png", 1600),
};

export default function BoxesPage() {
    const { version } = useVersion();
    const src = version === "french" ? BOXES_IMAGES.french : BOXES_IMAGES.international;

    // Précharge l'image de l'autre version : le passage Int/Fr est alors instantané
    useEffect(() => {
        new Image().src = version === "french" ? BOXES_IMAGES.international : BOXES_IMAGES.french;
    }, [version]);

    return (
        <main className="relative h-[100svh] overflow-hidden">
            <BoxesScrollingBackground src={src} />

            <BolzaBoxesNav />
            <VersionSwitch />

            <div
                className="absolute left-0 right-0 flex flex-col items-center justify-center gap-3 px-4"
                style={{
                    top: "var(--bolzaboxes-nav-height)",
                    bottom: "var(--bolzaboxes-switch-zone)",
                }}
            >
                <BoxesTapHint />
                <BoxesImageMap src={src} layout={BOXES_LAYOUTS[version]} />
            </div>
        </main>
    );
}
