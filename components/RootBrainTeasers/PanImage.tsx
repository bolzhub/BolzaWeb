"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// L'image est affichée jusqu'à 1,6× plus grande que le strict minimum pour remplir
// l'écran, sans dépasser sa taille réelle (sauf si c'est nécessaire pour le remplir).
// Augmente cette valeur pour avoir plus de surface à parcourir.
const ZOOM = 1.6;

type Size = { w: number; h: number };
type Offset = { x: number; y: number };

function clampOffset(o: Offset, view: Size, shown: Size): Offset {
    return {
        x: Math.min(0, Math.max(view.w - shown.w, o.x)),
        y: Math.min(0, Math.max(view.h - shown.h, o.y)),
    };
}

export default function PanImage({
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
    const drag = useRef<{ id: number; startX: number; startY: number; originX: number; originY: number } | null>(null);

    const [view, setView] = useState<Size | null>(null);
    const [natural, setNatural] = useState<Size | null>(null);
    const [offset, setOffset] = useState<Offset | null>(null);
    const [dragging, setDragging] = useState(false);
    const [failed, setFailed] = useState(false);

    // Taille de la zone visible
    useEffect(() => {
        const el = boxRef.current;
        if (!el) return;
        const update = () => setView({ w: el.clientWidth, h: el.clientHeight });
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Cas d'une image déjà chargée avant l'hydratation (onLoad ne se déclenche alors pas)
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        }
    }, [src]);

    // Taille d'affichage : toujours au moins de quoi remplir l'écran
    const shown = useMemo<Size | null>(() => {
        if (!view || !natural || view.w === 0 || view.h === 0) return null;
        const cover = Math.max(view.w / natural.w, view.h / natural.h);
        const scale = Math.max(cover, Math.min(cover * ZOOM, 1));
        return { w: natural.w * scale, h: natural.h * scale };
    }, [view, natural]);

    // Position initiale centrée, puis recadrage si l'écran change de taille
    useEffect(() => {
        if (!view || !shown) return;
        setOffset((prev) =>
            prev
                ? clampOffset(prev, view, shown)
                : { x: (view.w - shown.w) / 2, y: (view.h - shown.h) / 2 }
        );
    }, [view, shown]);

    return (
        <div
            ref={boxRef}
            aria-hidden={!active}
            className={`absolute inset-0 overflow-hidden select-none ${dragging ? "cursor-grabbing" : "cursor-grab"
                } ${active ? "" : "invisible pointer-events-none"}`}
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
                if (!offset || drag.current) return;
                if (e.pointerType === "mouse" && e.button !== 0) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                drag.current = {
                    id: e.pointerId,
                    startX: e.clientX,
                    startY: e.clientY,
                    originX: offset.x,
                    originY: offset.y,
                };
                setDragging(true);
                onInteract?.();
            }}
            onPointerMove={(e) => {
                const d = drag.current;
                if (!d || d.id !== e.pointerId || !view || !shown) return;
                setOffset(
                    clampOffset(
                        { x: d.originX + e.clientX - d.startX, y: d.originY + e.clientY - d.startY },
                        view,
                        shown
                    )
                );
            }}
            onPointerUp={(e) => {
                if (drag.current?.id === e.pointerId) {
                    drag.current = null;
                    setDragging(false);
                }
            }}
            onPointerCancel={(e) => {
                if (drag.current?.id === e.pointerId) {
                    drag.current = null;
                    setDragging(false);
                }
            }}
        >
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                draggable={false}
                onLoad={(e) =>
                    setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                }
                onError={() => setFailed(true)}
                className="absolute left-0 top-0 max-w-none"
                style={{
                    width: shown?.w,
                    height: shown?.h,
                    transform: offset ? `translate3d(${offset.x}px, ${offset.y}px, 0)` : undefined,
                    opacity: offset ? 1 : 0,
                    willChange: "transform",
                }}
            />

            {!offset && !failed && (
                <p
                    className="absolute inset-0 flex items-center justify-center text-[#F3ECDC]/70 animate-pulse"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Loading…
                </p>
            )}
            {failed && (
                <p
                    className="absolute inset-0 flex items-center justify-center text-[#F3ECDC]/70"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Image unavailable
                </p>
            )}
        </div>
    );
}