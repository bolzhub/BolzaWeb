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
        <div className="flex flex-col w-full h-full" style={{ color: textColor }}>
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-2 pb-2 overflow-x-auto">
                {VIEW_MODES.map((v) => (
                    <button
                        key={v.id}
                        onClick={() => setViewModeId(v.id)}
                        className={`whitespace-nowrap text-sm tracking-wide transition-opacity ${v.id === viewModeId
                                ? "opacity-100 underline underline-offset-4"
                                : "opacity-60 hover:opacity-90"
                            }`}
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-1 min-h-0 gap-2">
                <div className="flex flex-col justify-center gap-6 px-2">
                    {OBJECT_TYPES.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => setObjectType(o.id)}
                            className={`text-sm tracking-widest transition-opacity ${o.id === objectType
                                    ? "opacity-100 underline underline-offset-4"
                                    : "opacity-60 hover:opacity-90"
                                }`}
                            style={{
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)",
                                fontFamily: "var(--font-playfair)",
                            }}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 rounded-2xl overflow-hidden bg-black/10 min-h-[280px]">
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

            <div className="flex justify-center gap-6 pt-2">
                {(["glass", "no-glass"] as Glass[]).map((g) => (
                    <button
                        key={g}
                        onClick={() => setGlass(g)}
                        className={`text-sm tracking-wide transition-opacity ${g === glass
                                ? "opacity-100 underline underline-offset-4"
                                : "opacity-60 hover:opacity-90"
                            }`}
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {g === "glass" ? "Glass" : "No Glass"}
                    </button>
                ))}
            </div>
        </div>
    );
}