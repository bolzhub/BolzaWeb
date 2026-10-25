"use client";

import { useState } from "react";
import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";
import BoxesImageMap from "@/components/BolzaBoxes/BoxesImageMap";
import BoxesScrollingBackground from "@/components/BolzaBoxes/BoxesScrollingBackground";
import BoxesTapHint from "@/components/BolzaBoxes/BoxesTapHint";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { mediaUrl } from "@/lib/media/url";
import { BOXES_LAYOUTS } from "@/lib/BolzaBoxes/boxesZones";

const BOXES_IMAGES = {
    international: mediaUrl("Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-English.png"),
    french: mediaUrl("Projets/Root_Organiser/Extra/Presentation/Website/Boxes/side_designs-French.png"),
};

export default function BoxesPage() {
    const { version } = useVersion();
    const [navMenuOpen, setNavMenuOpen] = useState(false);
    const src = version === "french" ? BOXES_IMAGES.french : BOXES_IMAGES.international;

    return (
        <main className="relative h-[100svh] overflow-hidden">
            <BoxesScrollingBackground src={src} />

            <BolzaBoxesNav onBurgerOpenChange={setNavMenuOpen} />
            <VersionSwitch />

            <div
                className={`absolute left-0 right-0 flex flex-col items-center justify-center gap-3 px-4 transition-opacity duration-200 ${navMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                style={{
                    top: "var(--bolzaboxes-nav-height)",
                    bottom: "var(--bolzaboxes-switch-zone)"
                }}
            >
                <BoxesTapHint />
                <BoxesImageMap src={src} layout={BOXES_LAYOUTS[version]} />
            </div>
        </main>
    );
}