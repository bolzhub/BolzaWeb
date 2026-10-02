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
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-row-reverse lg:flex-row flex-1 min-h-0 min-w-0 gap-2">
        {/* Colonne de gauche : type d'objet */}
        <div className="flex flex-col shrink-0">
          {OBJECT_TYPES.map((o) => {
            const isActive = o.id === objectType;
            return (
              <div key={o.id} className="flex-1 flex items-center justify-center px-1">
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
                  {o.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Colonne cadre + Glass/No Glass */}
        <div className="flex-1 min-w-0 flex flex-col">
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

          <div className="flex justify-center gap-4 pt-3">
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
                  {g === "glass" ? "Glass" : "No Glass"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}