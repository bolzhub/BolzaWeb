"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SLUG_ALIASES, getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { readableTextOn } from "@/lib/colors";
import BolzaBoxesNav from "./BolzaBoxesNav";
import FactionSidebar from "./FactionSidebar";
import MobileTopBar from "./MobileTopBar";
import VersionSwitch from "./VersionSwitch";
import FactionKeyboardNav from "./FactionKeyboardNav";
import { ViewerChoiceProvider } from "@/lib/BolzaBoxes/ViewerChoiceContext";

// Cadre commun des pages /BolzaBoxes/boxes/<faction>, rendu par le layout :
// il reste monté quand on passe d'une faction à l'autre, si bien que la barre
// d'icônes garde exactement son état (défilement compris). Seul le contenu change.
export default function BoxesFrame({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const slug = pathname.split("/")[3] ?? "";
    const faction = getFactionBySlug(SLUG_ALIASES[slug] ?? slug);

    // /BolzaBoxes/boxes (redirection) ou faction inconnue : la page s'en charge
    if (!faction) return <>{children}</>;

    const textColor = readableTextOn(faction.color);

    return (
        <main className="min-h-screen min-h-dvh overflow-x-hidden" style={{ backgroundColor: faction.color }}>
            <BolzaBoxesNav background={{ type: "fade", color: faction.color }} />

            <div
                style={{ paddingTop: "var(--bolzaboxes-nav-height)", paddingBottom: "var(--bolzaboxes-switch-zone)" }}
                className="min-w-0"
            >
                <MobileTopBar title={faction.name} icon={faction.icon} textColor={textColor} />

                <div className="flex min-w-0">
                    <FactionSidebar active={faction} />
                    <ViewerChoiceProvider>{children}</ViewerChoiceProvider>
                </div>
            </div>

            <VersionSwitch />
            <FactionKeyboardNav slug={faction.slug} />
        </main>
    );
}
