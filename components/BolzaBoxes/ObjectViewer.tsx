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
import { FRAME_BG, TAB_RADIUS } from "@/lib/BolzaBoxes/style";
import MeshViewer from "./MeshViewer";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function ObjectViewer({ faction, textColor }: { faction: Faction; textColor: string }) {
    const lang = useLang();
    const name = faction.name[lang];
    const [objectType, setObjectType] = useState<ObjectType>(
        faction.objects.includes("box") ? "box" : faction.objects[0],
    );
    const [viewModeId, setViewModeId] = useState("full");
    const [glass, setGlass] = useState<Glass>("glass");

    const viewMode = VIEW_MODES.find((v) => v.id === viewModeId)!;

    return (
        <div className="flex flex-col w-full h-full max-w-full min-w-0" style={{ color: textColor }}>
            {/* Rangée du haut */}
            <div className="flex gap-2 overflow-x-auto pb-2 min-w-0">
                {VIEW_MODES.map((v) => {
                    const isActive = v.id === viewModeId;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setViewModeId(v.id)}
                            className="whitespace-nowrap text-sm tracking-wide px-3 py-1.5 rounded-lg shrink-0 transition-opacity"
                            style={{
                                fontFamily: "var(--font-playfair)",
                                backgroundColor: isActive ? FRAME_BG : "transparent",
                                opacity: isActive ? 1 : 0.6,
                            }}
                        >
                            {v.label[lang]}
                        </button>
                    );
                })}
            </div>

            {/* Grille : le cadre et la colonne des types d'objet partagent la même ligne, donc la même hauteur ;
                Avec vitre / Sans vitre occupe la ligne du dessous, dans la colonne du cadre.
                Portable : types à droite du cadre. Ordinateur : à gauche. */}
            <div className="grid flex-1 min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(0,1fr)_auto] gap-x-2 lg:grid-cols-[auto_minmax(0,1fr)]">
                {/* Colonne des types d'objet : contenue dans la hauteur du cadre ; justify-evenly laisse autant
                    d'espace au-dessus du premier bouton que sous le dernier, donc le groupe est centré sur le cadre */}
                <div className="col-start-2 row-start-1 flex flex-col justify-evenly lg:col-start-1">
                    {OBJECT_TYPES.filter((o) => faction.objects.includes(o.id)).map((o) => {
                        const isActive = o.id === objectType;
                        return (
                            <div key={o.id} className="flex justify-center px-1">
                                <button
                                    onClick={() => setObjectType(o.id)}
                                    className="whitespace-nowrap text-sm tracking-widest px-2 py-2 rounded-lg transition-opacity"
                                    style={{
                                        writingMode: "sideways-lr",
                                        fontFamily: "var(--font-playfair)",
                                        backgroundColor: isActive ? FRAME_BG : "transparent",
                                        opacity: isActive ? 1 : 0.55,
                                    }}
                                >
                                    {o.label[lang]}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div
                    className="relative col-start-1 row-start-1 h-[50vh] min-h-[280px] min-w-0 overflow-hidden lg:col-start-2 lg:h-auto"
                    style={{ backgroundColor: FRAME_BG, borderRadius: TAB_RADIUS }}
                >
                    {viewMode.type === "image" && (
                        <img
                            src={getAssetPath(faction.slug, objectType, viewMode, glass)}
                            alt={`${name} — ${OBJECT_TYPES.find((o) => o.id === objectType)!.label[lang]} — ${viewMode.label[lang]}`}
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
                                {lang === "fr" ? "Acheter" : "Buy"} {name}
                            </a>
                        </div>
                    )}
                </div>

                <div className="col-start-1 row-start-2 flex justify-center gap-4 pt-3 lg:col-start-2">
                    {(["glass", "no-glass"] as Glass[]).map((g) => {
                        const isActive = g === glass;
                        return (
                            <button
                                key={g}
                                onClick={() => setGlass(g)}
                                className="text-sm tracking-wide px-4 py-2 rounded-lg transition-opacity"
                                style={{
                                    fontFamily: "var(--font-playfair)",
                                    backgroundColor: isActive ? FRAME_BG : "transparent",
                                    opacity: isActive ? 1 : 0.55,
                                }}
                            >
                                {g === "glass"
                                    ? lang === "fr"
                                        ? "Avec vitre"
                                        : "Glass"
                                    : lang === "fr"
                                      ? "Sans vitre"
                                      : "No Glass"}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
