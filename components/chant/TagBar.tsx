"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TagChip from "./TagChip";

type Press = {
    tag: string;
    x: number;
    y: number;
    touch: boolean;
    started: boolean;
    timer: number;
    lastOver: string | null;
    order: string[];
    cleanup: () => void;
};

const LONG_PRESS_MS = 350; // au doigt : appui long avant de pouvoir glisser
const MOUSE_THRESHOLD = 5; // à la souris : distance avant que le clic devienne un glisser
const TOUCH_TOLERANCE = 8; // au doigt : au-delà, c'est un défilement de page

const sameOrder = (a: string[], b: string[]) => a.length === b.length && a.every((t, i) => t === b[i]);

// Tags du filtre, réordonnables par glisser-déposer (souris, ou appui long au doigt)
export default function TagBar({
    allTags,
    tagOrder,
    activeTag,
    onSelect,
}: {
    allTags: string[];
    tagOrder: string[];
    activeTag: string | null;
    onSelect: (tag: string | null) => void;
}) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const press = useRef<Press | null>(null);
    const suppressClick = useRef(false);

    const [dragOrder, setDragOrder] = useState<string[] | null>(null); // pendant le glisser
    const [saved, setSaved] = useState<string[] | null>(null); // enregistré, en attente du rafraîchissement
    const [dragging, setDragging] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Nouvel ordre reçu du serveur : il fait foi
    const [prevTagOrder, setPrevTagOrder] = useState(tagOrder);
    if (prevTagOrder !== tagOrder) {
        setPrevTagOrder(tagOrder);
        setSaved(null);
    }

    const order = dragOrder ?? saved ?? tagOrder;

    useEffect(() => () => press.current?.cleanup(), []);

    function finish() {
        press.current?.cleanup();
        press.current = null;
        setDragging(null);
    }

    function start() {
        const p = press.current;
        if (!p || p.started) return;
        p.started = true;
        setDragging(p.tag);
        setDragOrder(p.order);
        if (p.touch) navigator.vibrate?.(15);
    }

    function onMove(e: PointerEvent) {
        const p = press.current;
        if (!p) return;

        if (!p.started) {
            const dist = Math.hypot(e.clientX - p.x, e.clientY - p.y);
            if (p.touch) {
                if (dist > TOUCH_TOLERANCE) finish(); // l'utilisateur fait défiler la page
                return;
            }
            if (dist < MOUSE_THRESHOLD) return;
            start();
        }

        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-tag]");
        const over = el && containerRef.current?.contains(el) ? (el.dataset.tag ?? null) : null;
        // On ne réagit qu'en entrant sur un nouveau tag : évite les allers-retours
        // quand des tags de largeurs différentes échangent leur place sous le pointeur
        if (over === p.lastOver) return;
        p.lastOver = over;
        if (!over || over === p.tag) return;

        const next = p.order.filter((t) => t !== p.tag);
        next.splice(p.order.indexOf(over), 0, p.tag);
        p.order = next;
        setDragOrder(next);
    }

    function onUp() {
        const p = press.current;
        if (!p) return;
        finish();
        if (!p.started) return;

        // Le relâchement d'un glisser ne doit pas aussi sélectionner le tag
        suppressClick.current = true;
        window.setTimeout(() => (suppressClick.current = false), 0);
        void save(p.order);
    }

    function onCancel() {
        finish();
        setDragOrder(null);
    }

    function onPointerDown(e: React.PointerEvent, tag: string) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        press.current?.cleanup();

        const touch = e.pointerType !== "mouse";
        // Empêche le défilement de la page une fois le glisser commencé au doigt
        const blockScroll = (ev: TouchEvent) => {
            if (press.current?.started) ev.preventDefault();
        };
        const p: Press = {
            tag,
            x: e.clientX,
            y: e.clientY,
            touch,
            started: false,
            timer: touch ? window.setTimeout(start, LONG_PRESS_MS) : 0,
            lastOver: tag,
            order,
            cleanup: () => {
                window.clearTimeout(p.timer);
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onCancel);
                window.removeEventListener("touchmove", blockScroll);
            },
        };
        press.current = p;
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onCancel);
        window.addEventListener("touchmove", blockScroll, { passive: false });
    }

    async function save(next: string[]) {
        setDragOrder(null);
        if (sameOrder(next, tagOrder)) return;
        setSaved(next);
        setError(null);
        const res = await fetch("/api/chant/tags", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: next }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setSaved(null);
            setError(data.error ?? "Impossible d'enregistrer l'ordre des tags.");
            return;
        }
        router.refresh();
    }

    return (
        <div ref={containerRef} className="contents">
            {order.map((tag) => (
                <span
                    key={tag}
                    data-tag={tag}
                    onPointerDown={(e) => onPointerDown(e, tag)}
                    onClickCapture={(e) => {
                        if (suppressClick.current) {
                            e.preventDefault();
                            e.stopPropagation();
                            suppressClick.current = false;
                        }
                    }}
                    onContextMenu={(e) => {
                        if (press.current) e.preventDefault();
                    }}
                    className={`select-none [-webkit-touch-callout:none] *:cursor-[inherit] ${dragging ? "cursor-grabbing" : "cursor-pointer"} ${dragging === tag ? "opacity-50" : ""}`}
                >
                    <TagChip
                        tag={tag}
                        allTags={allTags}
                        size="md"
                        active={activeTag === tag}
                        onClick={() => onSelect(activeTag === tag ? null : tag)}
                    />
                </span>
            ))}
            {error && <p className="w-full text-xs text-red-700">{error}</p>}
        </div>
    );
}
