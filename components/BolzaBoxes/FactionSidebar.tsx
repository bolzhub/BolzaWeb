"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { SIDEBAR_ORDER, factionPath, getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { useLang } from "@/lib/i18n/LanguageContext";
import type { Faction } from "@/lib/BolzaBoxes/types";

// Position de défilement de la barre, gardée entre deux pages de faction :
// chaque page remonte la barre, qui reprend ainsi là où on l'avait laissée
let savedScrollTop = 0;

export default function FactionSidebar({ active }: { active: Faction }) {
    const listRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (listRef.current) listRef.current.scrollTop = savedScrollTop;
    }, []);

    const { version } = useVersion();
    const lang = useLang();
    const factions = SIDEBAR_ORDER[version].map((slug) => getFactionBySlug(slug)!);

    return (
        <div
            ref={listRef}
            onScroll={(e) => {
                savedScrollTop = e.currentTarget.scrollTop;
            }}
            className="flex flex-col items-center gap-1.5 lg:gap-2.5 py-3 lg:py-5 px-1.5 lg:px-2 w-10 lg:w-14 shrink-0 relative rounded-tr-3xl rounded-br-3xl overscroll-contain"
            style={{
                backgroundColor: "#DCD9D2",
                maxHeight:
                    "calc(100dvh - var(--bolzaboxes-nav-height) - var(--bolzaboxes-switch-zone) - env(safe-area-inset-bottom, 0px))",
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            {factions.map((f) => {
                const isActive = f.slug === active.slug;
                return (
                    <Link
                        key={f.slug}
                        href={factionPath(f.slug)}
                        // la page reste à sa position de défilement, sans saut vers l'élément actif
                        scroll={false}
                        className="relative flex items-center justify-center w-7 h-7 lg:w-9 lg:h-9 shrink-0"
                    >
                        {isActive && (
                            <div
                                aria-hidden="true"
                                className="absolute inset-y-0"
                                style={{
                                    left: -4,
                                    right: -16,
                                    backgroundColor: f.color,
                                    borderRadius: "9999px 0 0 9999px",
                                }}
                            />
                        )}
                        <img
                            src={f.icon}
                            alt={f.name[lang]}
                            className={`relative z-10 w-5 h-5 lg:w-6 lg:h-6 transition-opacity ${
                                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                            }`}
                        />
                    </Link>
                );
            })}
        </div>
    );
}
