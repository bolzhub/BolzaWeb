"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
import MeshDownload from "./MeshDownload";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { useLang } from "@/lib/i18n/LanguageContext";

export const GLASS_LABEL: Record<Glass, { en: string; fr: string }> = {
    glass: { en: "Window", fr: "Avec vitre" },
    "no-glass": { en: "No Window", fr: "Sans vitre" },
};

const MIN_FRAME = 240; // côté minimal du cadre, même si l'écran est très bas
const BOTTOM_MARGIN = 8; // marge entre les boutons de vitre et le sélecteur de version
const ROW_GAP = 24; // gap-6 entre la visionneuse et la description (ordinateur)
const MIN_INFO = 220; // largeur minimale laissée à la description (ordinateur)
const STEP = 8; // pas de recherche de la largeur du cadre (ordinateur)

type Size = { w: number; h: number; side?: number };

export default function ObjectViewer({
    faction,
    textColor,
    info,
}: {
    faction: Faction;
    textColor: string;
    info: ReactNode;
}) {
    const lang = useLang();
    const name = faction.name[lang];
    const [objectType, setObjectType] = useState<ObjectType>(
        faction.objects.includes("box") ? "box" : faction.objects[0],
    );
    const [viewModeId, setViewModeId] = useState("full");
    const [glass, setGlass] = useState<Glass>("glass");
    const [videoAspect, setVideoAspect] = useState(16 / 9);
    const [size, setSize] = useState<Size | null>(null);
    const [desktop, setDesktop] = useState(false);

    const { version } = useVersion();
    const viewMode = VIEW_MODES.find((v) => v.id === viewModeId)!;
    const src = getAssetPath(faction.slug, version, objectType, viewMode, glass);

    // Forme du cadre : carré pour les photos (et le lien d'achat), proportions de la vidéo,
    // ou libre (le plus grand possible) pour le maillage 3D
    const aspect: number | null = viewMode.type === "mesh" ? null : viewMode.type === "video" ? videoAspect : 1;

    const rowRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const typesRef = useRef<HTMLDivElement>(null);
    const glassRef = useRef<HTMLDivElement>(null);
    const modesRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const limitRef = useRef<HTMLDivElement>(null);

    const compute = useCallback(() => {
        const row = rowRef.current,
            grid = gridRef.current,
            types = typesRef.current,
            glassRow = glassRef.current,
            modes = modesRef.current,
            measure = measureRef.current,
            limit = limitRef.current;
        if (!row || !grid || !types || !glassRow || !modes || !measure || !limit) return;

        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
        setDesktop(isDesktop);

        // Bas autorisé (page en haut) : hauteur de l'écran moins la zone du sélecteur de version
        const limitY = limit.offsetHeight;
        const gridTop = grid.getBoundingClientRect().top + window.scrollY;
        const below = glassRow.offsetHeight + (isDesktop ? 0 : types.offsetHeight);
        const hMax = Math.max(MIN_FRAME, limitY - gridTop - below - BOTTOM_MARGIN);

        if (!isDesktop) {
            // Portable : toute la largeur, hauteur bornée par le sélecteur de version
            const wMax = grid.clientWidth;
            if (aspect === null) setSize({ w: wMax, h: hMax });
            else {
                const w = Math.min(wMax, hMax * aspect);
                setSize({ w, h: w / aspect });
            }
            return;
        }

        // Ordinateur : on élargit le cadre tant que le titre tient sur une ligne
        // et que la description ne descend pas plus bas que les boutons de vitre
        const cs = getComputedStyle(row);
        const content = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const side = types.offsetWidth + parseFloat(getComputedStyle(grid).columnGap || "0");
        const above = modes.offsetHeight;
        const infoWidthFor = (w: number) => content - ROW_GAP - side - w;

        const title = measure.querySelector("h1");
        measure.style.width = "100000px";
        const oneLine = title?.offsetHeight ?? 0;
        const cache = new Map<number, { height: number; titleFits: boolean }>();
        const measureAt = (infoW: number) => {
            const key = Math.round(infoW);
            let m = cache.get(key);
            if (!m) {
                measure.style.width = `${key}px`;
                m = { height: measure.offsetHeight, titleFits: !title || title.offsetHeight <= oneLine * 1.2 };
                cache.set(key, m);
            }
            return m;
        };

        let wUpper = content - ROW_GAP - side - MIN_INFO;
        if (aspect !== null) wUpper = Math.min(wUpper, hMax * aspect);
        const wLower = Math.min(wUpper, aspect === null ? MIN_FRAME : MIN_FRAME * Math.max(1, aspect));

        let best: Size | null = null;
        let bestOvershoot = Infinity;
        for (let w = Math.floor(wUpper); w >= wLower; w -= STEP) {
            const h = aspect === null ? hMax : w / aspect;
            const m = measureAt(infoWidthFor(w));
            if (!m.titleFits) continue;
            const overshoot = m.height - (above + h + glassRow.offsetHeight);
            if (overshoot <= 0) {
                best = { w, h };
                break;
            }
            // Aucune taille ne convient (description très longue) : on garde la moins débordante
            if (overshoot < bestOvershoot) {
                bestOvershoot = overshoot;
                best = { w, h };
            }
        }
        if (!best) {
            const w = Math.max(wLower, 0);
            best = { w, h: aspect === null ? hMax : w / aspect };
        }
        setSize({ ...best, side });
    }, [aspect]);

    useLayoutEffect(() => {
        compute();
    }, [compute, lang]);

    useEffect(() => {
        let frame = 0;
        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(compute);
        };
        const ro = new ResizeObserver(schedule);
        if (rowRef.current) ro.observe(rowRef.current);
        window.addEventListener("resize", schedule);
        document.fonts?.ready.then(schedule);
        return () => {
            cancelAnimationFrame(frame);
            ro.disconnect();
            window.removeEventListener("resize", schedule);
        };
    }, [compute]);

    // Précharge l'image de l'autre version : le passage Int/Fr est alors instantané
    useEffect(() => {
        if (viewMode.type !== "image") return;
        const other = version === "french" ? "international" : "french";
        new Image().src = getAssetPath(faction.slug, other, objectType, viewMode, glass);
    }, [faction.slug, version, objectType, viewMode, glass]);

    return (
        <div ref={rowRef} className="relative flex-1 min-w-0 flex flex-col lg:flex-row gap-6 p-4 md:p-8">
            {/* Repère invisible : bas autorisé pour Avec vitre / Sans vitre (au-dessus du sélecteur de version).
                En svh : la barre du navigateur en bas de l'écran, visible à l'arrivée, est prise en compte. */}
            <div
                ref={limitRef}
                aria-hidden
                className="pointer-events-none invisible absolute left-0 top-0 w-0"
                style={{
                    height: "calc(100svh - var(--bolzaboxes-switch-zone) - env(safe-area-inset-bottom, 0px))",
                }}
            />

            <div
                className="flex flex-col min-w-0 max-w-full lg:shrink-0"
                style={{ color: textColor, width: desktop && size ? (size.side ?? 0) + size.w : undefined }}
            >
                {/* Rangée du haut : modes de vue (défilables) et téléchargement d'un mesh */}
                <div ref={modesRef} className="flex items-start gap-2 min-w-0">
                    <div className="flex flex-1 gap-2 overflow-x-auto pb-2 min-w-0">
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
                    <MeshDownload faction={faction} version={version} />
                </div>

                {/* Portable : cadre, puis types d'objet en ligne, puis Avec vitre / Sans vitre.
                    Ordinateur : types d'objet en colonne à gauche du cadre, centrés sur sa hauteur. */}
                <div
                    ref={gridRef}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-2 lg:grid-cols-[auto_minmax(0,1fr)]"
                >
                    <div
                        ref={typesRef}
                        className="col-start-1 row-start-2 flex justify-center gap-2 pt-3 lg:row-start-1 lg:flex-col lg:justify-evenly lg:gap-0 lg:pt-0"
                    >
                        {OBJECT_TYPES.filter((o) => faction.objects.includes(o.id)).map((o) => {
                            const isActive = o.id === objectType;
                            return (
                                <div key={o.id} className="flex justify-center lg:px-1">
                                    <button
                                        onClick={() => setObjectType(o.id)}
                                        className="whitespace-nowrap text-sm tracking-widest px-3 py-1.5 rounded-lg transition-opacity lg:px-2 lg:py-2 lg:[writing-mode:sideways-lr]"
                                        style={{
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
                        className={`relative col-start-1 row-start-1 mx-auto max-w-full overflow-hidden lg:col-start-2 lg:mx-0 ${
                            size ? "" : "aspect-square w-full max-h-[60svh]"
                        }`}
                        style={{
                            backgroundColor: FRAME_BG,
                            borderRadius: TAB_RADIUS,
                            width: size?.w,
                            height: size?.h,
                        }}
                    >
                        {viewMode.type === "image" && (
                            <img
                                src={src}
                                alt={`${name} — ${OBJECT_TYPES.find((o) => o.id === objectType)!.label[lang]} — ${viewMode.label[lang]}`}
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        )}
                        {viewMode.type === "video" && (
                            <video
                                key={src}
                                src={src}
                                controls
                                onLoadedMetadata={(e) => {
                                    const v = e.currentTarget;
                                    if (v.videoWidth && v.videoHeight) setVideoAspect(v.videoWidth / v.videoHeight);
                                }}
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        )}
                        {viewMode.type === "mesh" && <MeshViewer src={src} />}
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

                    <div
                        ref={glassRef}
                        className="col-start-1 row-start-3 flex justify-center gap-4 pt-3 lg:col-start-2 lg:row-start-2"
                    >
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
                                    {GLASS_LABEL[g][lang]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="lg:flex-1 min-w-0 lg:pt-4">{info}</div>

            {/* Copie invisible de la description, pour mesurer sa hauteur à différentes largeurs */}
            <div
                ref={measureRef}
                aria-hidden
                inert
                className="pointer-events-none invisible absolute left-0 top-0 lg:pt-4"
            >
                {info}
            </div>
        </div>
    );
}
