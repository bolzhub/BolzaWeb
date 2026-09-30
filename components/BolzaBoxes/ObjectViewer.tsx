"use client";

import { useState } from "react";
import {
    OBJECT_TYPES,
    VIEW_MODES,
    getAssetPath,
    type Faction,
    type ObjectType,
    type Glass,
} from "@/lib/BolzaBoxes/types";
import { FRAME_BG, TAB_RADIUS, TAB_TILT_DEG } from "@/lib/BolzaBoxes/style";
import MeshViewer from "./MeshViewer";

export default function ObjectViewer({
    faction,
    textColor,
}: {
    faction: Faction;
    textColor: string;
}) {
    const [objectType, setObjectType] = useState<ObjectType>("box");
    const [viewModeId, setViewModeId] = useState("full");
    const [glass, setGlass] = useState<Glass>("glass");

    const viewMode = VIEW_MODES.find((v) => v.id === viewModeId)!;

    return (
        <div className="flex flex-col w-full h-full max-w-full overflow-x-hidden" style={{ color: textColor }}>
            {/* Rangée du haut : spacer aligné sur la largeur de la colonne latérale, puis les mots */}
            <div className="flex items-end flex-wrap" style={{ minHeight: 40 }}>
                <div aria-hidden="true" className="w-0 lg:w-10 shrink-0" />

                {VIEW_MODES.map((v) => {
                    const isActive = v.id === viewModeId;

                    if (isActive) {
                        return (
                            <button
                                key={v.id}
                                onClick={() => setViewModeId(v.id)}
                                className="relative shrink-0 overflow-visible px-2 pt-1 pb-1"
                                style={{ backgroundColor: FRAME_BG, borderRadius: `${TAB_RADIUS}px ${TAB_RADIUS}px 0 0` }}
                            >
                                <span
                                    className="block whitespace-nowrap text-xs tracking-wide"
                                    style={{
                                        fontFamily: "var(--font-playfair)",
                                        transform: `rotate(${TAB_TILT_DEG}deg)`,
                                        transformOrigin: "0% 100%",
                                    }}
                                >
                                    {v.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={v.id}
                            onClick={() => setViewModeId(v.id)}
                            className="whitespace-nowrap text-xs tracking-wide px-1.5 pb-1 shrink-0 opacity-60 hover:opacity-90 transition-opacity"
                            style={{
                                fontFamily: "var(--font-playfair)",
                                transform: `rotate(${TAB_TILT_DEG}deg)`,
                                transformOrigin: "0% 100%",
                            }}
                        >
                            {v.label}
                        </button>
                    );
                })}
            </div>

            {/* Rangée principale : colonne d'objet + cadre, ordre inversé sur mobile */}
            <div className="flex flex-row-reverse lg:flex-row flex-1 min-h-0">
                <div className="flex flex-col justify-center items-center gap-3 w-10 shrink-0">
                    {OBJECT_TYPES.map((o) => {
                        const isActive = o.id === objectType;
                        return (
                            <button
                                key={o.id}
                                onClick={() => setObjectType(o.id)}
                                className={`whitespace-nowrap text-sm tracking-widest py-3 w-full flex justify-center transition-opacity ${isActive
                                        ? "rounded-r-[18px] lg:rounded-r-none lg:rounded-l-[18px]"
                                        : ""
                                    }`}
                                style={{
                                    writingMode: "sideways-lr",
                                    fontFamily: "var(--font-playfair)",
                                    backgroundColor: isActive ? FRAME_BG : "transparent",
                                    opacity: isActive ? 1 : 0.55,
                                }}
                            >
                                {o.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    className="relative flex-1 overflow-hidden min-h-[280px] min-w-0"
                    style={{ backgroundColor: FRAME_BG, borderRadius: TAB_RADIUS }}
                >
                    {viewMode.type === "image" && (
                        <img
                            src={getAssetPath(faction.slug, objectType, viewMode, glass)}
                            alt={`${faction.name} ${objectType} ${viewMode.label}`}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    )}
                    {viewMode.type === "video" && (
                        <video
                            key={getAssetPath(faction.slug, objectType, viewMode, glass)}
                            src={getAssetPath(faction.slug, objectType, viewMode, glass)}
                            controls
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    )}
                    {viewMode.type === "mesh" && (
                        <MeshViewer src={getAssetPath(faction.slug, objectType, viewMode, glass)} />
                    )}
                    {viewMode.type === "link" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <a
                                href={faction.buyUrl ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-full tracking-wide"
                                style={{ backgroundColor: textColor, color: faction.color }}
                            >
                                Buy {faction.name}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Glass / No Glass : flush, pas de chevauchement */}
            <div className="flex justify-center gap-3">
                {(["glass", "no-glass"] as Glass[]).map((g) => {
                    const isActive = g === glass;
                    return (
                        <button
                            key={g}
                            onClick={() => setGlass(g)}
                            className="text-sm tracking-wide px-4 pt-2 pb-2 transition-opacity"
                            style={{
                                fontFamily: "var(--font-playfair)",
                                backgroundColor: isActive ? FRAME_BG : "transparent",
                                borderRadius: isActive ? `0 0 ${TAB_RADIUS}px ${TAB_RADIUS}px` : undefined,
                                opacity: isActive ? 1 : 0.55,
                            }}
                        >
                            {g === "glass" ? "Glass" : "No Glass"}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}