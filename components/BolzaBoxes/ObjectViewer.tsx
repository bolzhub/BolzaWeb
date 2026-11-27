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
import FactionInfo from "./FactionInfo";
import { FACTIONS } from "@/lib/BolzaBoxes/factions";
import { LANGS } from "@/lib/i18n/lang";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { useViewerChoice } from "@/lib/BolzaBoxes/ViewerChoiceContext";
import { useLang } from "@/lib/i18n/LanguageContext";

export const GLASS_LABEL: Record<Glass, { en: string; fr: string }> = {
    glass: { en: "Window", fr: "Avec vitre" },
    "no-glass": { en: "No Window", fr: "Sans vitre" },
};

const MIN_FRAME = 240; // côté minimal du cadre, même si l'écran est très bas
const BOTTOM_MARGIN = 8; // marge entre les boutons de vitre et le sélecteur de version
const ROW_GAP = 24; // gap-6 entre la visionneuse et la description (ordinateur)
const MIN_INFO = 220; // largeur minimale laissée à la description (ordinateur)

type Size = { w: number; h: number; side?: number; info?: number };

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
    // Vue, objet et vitre choisis : partagés entre les factions (on retrouve la même vue en changeant de faction)
    const choice = useViewerChoice();
    const { viewModeId, glass } = choice;
    const setViewModeId = (id: string) => choice.update({ viewModeId: id });
    const setGlass = (g: Glass) => choice.update({ glass: g });
    const setObjectType = (o: ObjectType) => choice.update({ objectType: o });
    const [videoAspect, setVideoAspect] = useState(16 / 9);
    const [size, setSize] = useState<Size | null>(null);
    const [desktop, setDesktop] = useState(false);

    const { version } = useVersion();
    const viewMode = VIEW_MODES.find((v) => v.id === viewModeId) ?? VIEW_MODES[0];

    // Objets proposés : pas de boîte en vue 3D (conteneur et tiroir ne s'affichent pas ensemble).
    // L'objet choisi est gardé s'il existe pour cette faction, sinon on prend le plus proche.
    const objects = OBJECT_TYPES.filter(
        (o) => faction.objects.includes(o.id) && !(viewMode.type === "mesh" && o.id === "box"),
    );
    const objectIds = objects.map((o) => o.id);
    const objectType: ObjectType =
        choice.objectType && objectIds.includes(choice.objectType)
            ? choice.objectType
            : objectIds.includes("box")
              ? "box"
              : objectIds.includes("container")
                ? "container"
                : objectIds[0];
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

        // Ordinateur : on élargit le cadre tant que le titre tient sur trois lignes au plus
        // et que la description ne descend pas plus bas que les boutons de vitre
        const cs = getComputedStyle(row);
        const content = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const side = types.offsetWidth + parseFloat(getComputedStyle(grid).columnGap || "0");
        const glassH = glassRow.offsetHeight;
        const above = modes.offsetHeight;
        const infoMax = content - ROW_GAP - side - MIN_FRAME;

        // Mesures de toutes les factions, dans les deux langues : la largeur maximale du cadre
        // est la même partout, fixée par la faction la plus exigeante (titre le plus long, etc.)
        const items = [...measure.children].map((el) => {
            const box = el as HTMLElement;
            return { box, title: box.querySelector("h1"), oneLine: 0 };
        });
        for (const it of items) it.box.style.width = "100000px";
        for (const it of items) it.oneLine = it.title?.offsetHeight ?? 0;
        const fits = (it: (typeof items)[number], h: number) =>
            (!it.title || it.title.offsetHeight <= it.oneLine * 3.2) &&
            // un mot plus large que la colonne ne passe pas à la ligne : il déborderait
            it.box.scrollWidth <= it.box.clientWidth + 1 &&
            it.box.offsetHeight <= above + h + glassH;

        // Recherche dichotomique, menée en parallèle pour toutes les mesures (une mise en page par tour) :
        // plus la description est large, plus elle est courte, donc la condition est monotone
        const lo = items.map(() => MIN_INFO);
        const hi = items.map(() => Math.max(MIN_INFO, infoMax));
        while (lo.some((l, i) => hi[i] - l > 2)) {
            const mid = lo.map((l, i) => Math.floor((l + hi[i]) / 2));
            items.forEach((it, i) => (it.box.style.width = `${mid[i]}px`));
            items.forEach((it, i) => {
                if (hi[i] - lo[i] <= 2) return;
                if (fits(it, hMax)) hi[i] = mid[i];
                else lo[i] = mid[i];
            });
        }
        const infoMin = Math.max(MIN_INFO, ...hi);
        const wUniform = Math.max(MIN_FRAME, content - ROW_GAP - side - infoMin);

        // La description garde la largeur qu'elle a à côté du plus grand cadre ; si le cadre est plus étroit
        // (photo, vidéo), l'ensemble est centré et l'espace en trop se partage de part et d'autre
        const infoUniform = content - ROW_GAP - side - wUniform;
        let best: Size = { w: wUniform, h: hMax, info: infoUniform };
        if (aspect !== null) {
            // Photo ou vidéo : cadre aux proportions du média, borné par la largeur commune et la hauteur
            const w = Math.min(wUniform, hMax * aspect);
            const h = w / aspect;
            best = { w, h, info: infoUniform };
            // Les boutons de vitre remontent avec un cadre moins haut : si la description de cette faction
            // descend alors plus bas qu'eux, on l'élargit juste assez (dans la place libérée par le cadre)
            const current = items.find((it) => it.box.dataset.current === "1");
            if (current) {
                const ok = (infoW: number) => {
                    current.box.style.width = `${infoW}px`;
                    return (
                        (!current.title || current.title.offsetHeight <= current.oneLine * 3.2) &&
                        current.box.scrollWidth <= current.box.clientWidth + 1 &&
                        current.box.offsetHeight <= above + h + glassH
                    );
                };
                let lo = infoUniform;
                let hi = content - ROW_GAP - side - w;
                if (!ok(lo)) {
                    if (!ok(hi)) lo = hi;
                    while (hi - lo > 2) {
                        const mid = Math.floor((lo + hi) / 2);
                        if (ok(mid)) hi = mid;
                        else lo = mid;
                    }
                    best.info = hi;
                }
            }
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
        <div
            ref={rowRef}
            className="relative flex-1 min-w-0 flex flex-col lg:flex-row lg:justify-center gap-6 p-4 md:p-8"
        >
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
                {/* Ordinateur : la rangée commence au bord gauche du cadre, pas au-dessus des types d'objet */}
                <div
                    ref={modesRef}
                    className="flex items-start gap-2 min-w-0"
                    style={{ paddingLeft: desktop && size ? size.side : undefined }}
                >
                    <div className="flex flex-1 gap-1 overflow-x-auto pb-1.5 min-w-0 lg:gap-2 lg:pb-2">
                        {VIEW_MODES.map((v) => {
                            const isActive = v.id === viewModeId;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setViewModeId(v.id)}
                                    className="whitespace-nowrap text-xs tracking-wide px-2 py-1 rounded-md shrink-0 transition-opacity lg:text-sm lg:px-3 lg:py-1.5 lg:rounded-lg"
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
                        className="col-start-1 row-start-2 flex justify-center gap-1 pt-1.5 lg:row-start-1 lg:flex-col lg:justify-evenly lg:gap-0 lg:pt-0"
                    >
                        {objects.map((o) => {
                            const isActive = o.id === objectType;
                            return (
                                <div key={o.id} className="flex justify-center lg:px-1">
                                    <button
                                        onClick={() => setObjectType(o.id)}
                                        className="whitespace-nowrap text-xs tracking-wider px-2 py-1 rounded-md transition-opacity lg:text-sm lg:tracking-widest lg:rounded-lg lg:px-2 lg:py-2 lg:[writing-mode:sideways-lr]"
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
                        className="col-start-1 row-start-3 flex justify-center gap-2 pt-1 lg:gap-4 lg:pt-3 lg:col-start-2 lg:row-start-2"
                    >
                        {(["glass", "no-glass"] as Glass[]).map((g) => {
                            const isActive = g === glass;
                            return (
                                <button
                                    key={g}
                                    onClick={() => setGlass(g)}
                                    className="text-xs tracking-wide px-3 py-1 rounded-md transition-opacity lg:text-sm lg:px-4 lg:py-2 lg:rounded-lg"
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

            <div
                className={`min-w-0 lg:pt-4 ${size?.info ? "lg:shrink-0" : "lg:flex-1"}`}
                style={{ width: desktop && size?.info ? size.info : undefined }}
            >
                {info}
            </div>

            {/* Copies invisibles des descriptions de toutes les factions, dans les deux langues,
                pour mesurer leur hauteur à différentes largeurs */}
            <div
                ref={measureRef}
                aria-hidden
                inert
                className="pointer-events-none invisible absolute left-0 top-0 hidden h-0 w-0 overflow-hidden lg:block"
            >
                {FACTIONS.flatMap((f) =>
                    LANGS.map((l) => (
                        <div
                            key={`${f.slug}-${l}`}
                            data-current={f.slug === faction.slug && l === lang ? "1" : undefined}
                            className="pt-4"
                        >
                            <FactionInfo faction={f} textColor={textColor} lang={l} />
                        </div>
                    )),
                )}
            </div>
        </div>
    );
}
