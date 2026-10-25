"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Size = { w: number; h: number };
type View = { zoom: number; x: number; y: number };
type Geo = { fw: number; fh: number; maxZoom: number; box: Size };
type Gesture =
    | { kind: "pan"; startX: number; startY: number; originX: number; originY: number }
    | { kind: "pinch"; dist: number; zoom: number; ix: number; iy: number };

const PAD = 12; // marge autour de l'image en vue d'ensemble
const DOUBLE_TAP_MS = 320;
const TAP_SLOP = 10;
const BUTTON_FACTOR = 1.5;

function clampView(v: View, g: Geo): View {
    const zoom = Math.min(g.maxZoom, Math.max(1, v.zoom));
    const dw = g.fw * zoom;
    const dh = g.fh * zoom;
    const x = dw <= g.box.w ? (g.box.w - dw) / 2 : Math.min(0, Math.max(g.box.w - dw, v.x));
    const y = dh <= g.box.h ? (g.box.h - dh) / 2 : Math.min(0, Math.max(g.box.h - dh, v.y));
    return { zoom, x, y };
}

// Zoome en gardant fixe le point de l'image situé sous (px, py)
function zoomAt(v: View, g: Geo, px: number, py: number, nextZoom: number): View {
    const z = Math.min(g.maxZoom, Math.max(1, nextZoom));
    const ix = (px - v.x) / v.zoom;
    const iy = (py - v.y) / v.zoom;
    return clampView({ zoom: z, x: px - ix * z, y: py - iy * z }, g);
}

export default function ZoomImage({
    src,
    alt,
    active,
    onInteract,
}: {
    src: string;
    alt: string;
    active: boolean;
    onInteract?: () => void;
}) {
    const boxRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const viewRef = useRef<View | null>(null);
    const geoRef = useRef<Geo | null>(null);
    const pointers = useRef(new Map<number, { x: number; y: number }>());
    const gesture = useRef<Gesture | null>(null);
    const tap = useRef({ downAt: 0, startX: 0, startY: 0, moved: false, lastAt: 0, lastX: 0, lastY: 0 });
    const interactRef = useRef(onInteract);

    const [box, setBox] = useState<Size | null>(null);
    const [natural, setNatural] = useState<Size | null>(null);
    const [view, setView] = useState<View | null>(null);
    const [dragging, setDragging] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        interactRef.current = onInteract;
    });

    const commit = useCallback((next: View) => {
        viewRef.current = next;
        setView(next);
    }, []);

    // Taille de la zone visible
    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Image déjà en cache avant l'hydratation : onLoad ne se déclenche alors pas
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        }
    }, [src]);

    // Géométrie : taille de l'image en vue d'ensemble (entière, avec marge) et zoom maximal
    const geo = useMemo<Geo | null>(() => {
        if (!box || !natural || box.w === 0 || box.h === 0) return null;
        const fit = Math.min(Math.max(box.w - PAD * 2, 50) / natural.w, Math.max(box.h - PAD * 2, 50) / natural.h);
        return {
            fw: natural.w * fit,
            fh: natural.h * fit,
            maxZoom: Math.min(16, Math.max(4, 2 / fit)), // jusqu'à 2× la résolution réelle
            box,
        };
    }, [box, natural]);

    useEffect(() => {
        geoRef.current = geo;
        if (!geo) return;
        commit(clampView(viewRef.current ?? { zoom: 1, x: 0, y: 0 }, geo));
    }, [geo, commit]);

    // Molette (et pincement au pavé tactile) : écouteur natif pour pouvoir bloquer le défilement de la page
    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            const g = geoRef.current;
            const v = viewRef.current;
            if (!g || !v) return;
            e.preventDefault();
            interactRef.current?.();
            const rect = el.getBoundingClientRect();
            const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
            const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.0018));
            commit(zoomAt(v, g, e.clientX - rect.left, e.clientY - rect.top, v.zoom * factor));
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [commit]);

    const local = (e: { clientX: number; clientY: number }) => {
        const r = boxRef.current!.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const startPan = () => {
        const [p] = [...pointers.current.values()];
        const v = viewRef.current;
        if (!p || !v) return;
        gesture.current = { kind: "pan", startX: p.x, startY: p.y, originX: v.x, originY: v.y };
    };

    const startPinch = () => {
        const pts = [...pointers.current.values()];
        const v = viewRef.current;
        if (pts.length < 2 || !v) return;
        const [a, b] = pts;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        gesture.current = {
            kind: "pinch",
            dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
            zoom: v.zoom,
            ix: (mid.x - v.x) / v.zoom,
            iy: (mid.y - v.y) / v.zoom,
        };
    };

    const toggleZoom = (px: number, py: number) => {
        const g = geoRef.current;
        const v = viewRef.current;
        if (!g || !v) return;
        if (v.zoom > 1.05) commit(clampView({ zoom: 1, x: 0, y: 0 }, g));
        else commit(zoomAt(v, g, px, py, Math.min(g.maxZoom, 3)));
    };

    const zoomBy = (factor: number) => {
        const g = geoRef.current;
        const v = viewRef.current;
        if (!g || !v) return;
        commit(zoomAt(v, g, g.box.w / 2, g.box.h / 2, v.zoom * factor));
    };

    const reset = () => {
        const g = geoRef.current;
        if (g) commit(clampView({ zoom: 1, x: 0, y: 0 }, g));
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!geoRef.current || !viewRef.current) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        pointers.current.set(e.pointerId, local(e));
        interactRef.current?.();

        if (pointers.current.size === 1) {
            const p = local(e);
            tap.current.downAt = performance.now();
            tap.current.startX = p.x;
            tap.current.startY = p.y;
            tap.current.moved = false;
            startPan();
            setDragging(true);
        } else {
            tap.current.moved = true; // plusieurs doigts : ce n'est pas un toucher simple
            startPinch();
        }
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointers.current.has(e.pointerId)) return;
        const p = local(e);
        pointers.current.set(e.pointerId, p);
        const g = geoRef.current;
        const v = viewRef.current;
        const current = gesture.current;
        if (!g || !v || !current) return;

        if (current.kind === "pan" && pointers.current.size === 1) {
            if (Math.hypot(p.x - tap.current.startX, p.y - tap.current.startY) > TAP_SLOP) {
                tap.current.moved = true;
            }
            commit(
                clampView(
                    { ...v, x: current.originX + p.x - current.startX, y: current.originY + p.y - current.startY },
                    g,
                ),
            );
        } else if (current.kind === "pinch" && pointers.current.size >= 2) {
            const [a, b] = [...pointers.current.values()];
            const dist = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const z = Math.min(g.maxZoom, Math.max(1, current.zoom * (dist / current.dist)));
            commit(clampView({ zoom: z, x: mid.x - current.ix * z, y: mid.y - current.iy * z }, g));
        }
    };

    const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pointers.current.delete(e.pointerId)) return;

        if (pointers.current.size === 0) {
            setDragging(false);
            const ended = gesture.current;
            gesture.current = null;

            const now = performance.now();
            const isTap =
                e.type === "pointerup" && ended?.kind === "pan" && !tap.current.moved && now - tap.current.downAt < 400;
            if (isTap) {
                const p = local(e);
                const t = tap.current;
                if (now - t.lastAt < DOUBLE_TAP_MS && Math.hypot(p.x - t.lastX, p.y - t.lastY) < 30) {
                    toggleZoom(p.x, p.y);
                    t.lastAt = 0;
                } else {
                    t.lastAt = now;
                    t.lastX = p.x;
                    t.lastY = p.y;
                }
            }
        } else if (pointers.current.size === 1) {
            tap.current.moved = true;
            startPan(); // fin d'un pincement : on continue avec le doigt restant
        } else {
            startPinch();
        }
    };

    const zoomPercent = view ? Math.round(view.zoom * 100) : 100;
    const atMax = view && geo ? view.zoom >= geo.maxZoom - 0.001 : false;
    const button =
        "flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-ink transition-colors hover:bg-ink/10 disabled:opacity-30";

    return (
        <div className={`absolute inset-0 ${active ? "" : "invisible pointer-events-none"}`} aria-hidden={!active}>
            <div
                ref={boxRef}
                className={`absolute inset-0 overflow-hidden select-none ${
                    dragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ touchAction: "none" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerEnd}
                onPointerCancel={onPointerEnd}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    draggable={false}
                    onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
                    onError={() => setFailed(true)}
                    className="absolute left-0 top-0 max-w-none"
                    style={{
                        width: geo?.fw,
                        height: geo?.fh,
                        transformOrigin: "0 0",
                        transform: view ? `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` : undefined,
                        opacity: view && geo ? 1 : 0,
                    }}
                />
            </div>

            {!natural && !failed && (
                <p
                    className="absolute inset-0 flex items-center justify-center text-parchment/70 animate-pulse pointer-events-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Loading…
                </p>
            )}
            {failed && (
                <p
                    className="absolute inset-0 flex items-center justify-center text-parchment/70 pointer-events-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Image unavailable
                </p>
            )}

            {/* Hors de la zone de gestes, pour que les clics sur les boutons ne soient pas captés par le glisser */}
            {geo && (
                <div className="absolute right-3 bottom-3 z-20 flex items-center gap-0.5 rounded-full bg-cream/95 p-1 shadow-md">
                    <button
                        type="button"
                        aria-label="Zoom out"
                        className={button}
                        disabled={!view || view.zoom <= 1.001}
                        onClick={() => zoomBy(1 / BUTTON_FACTOR)}
                    >
                        −
                    </button>
                    <span className="w-12 text-center text-xs tabular-nums text-ink">{zoomPercent}%</span>
                    <button
                        type="button"
                        aria-label="Zoom in"
                        className={button}
                        disabled={atMax}
                        onClick={() => zoomBy(BUTTON_FACTOR)}
                    >
                        +
                    </button>
                    <button
                        type="button"
                        aria-label="Show the whole image"
                        className={`${button} text-xs`}
                        disabled={!view || view.zoom <= 1.001}
                        onClick={reset}
                    >
                        Fit
                    </button>
                </div>
            )}
        </div>
    );
}
