"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

type PdfJs = typeof import("pdfjs-dist");

const PAGE_PAD = 16;
const BASE_MAX_WIDTH = 900; // largeur d'une page à 100 % sur grand écran
const ZOOM_STEPS = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3];
const MAX_CANVAS_PIXELS = 16_000_000; // limite des navigateurs mobiles

let pdfjsPromise: Promise<PdfJs> | null = null;

// pdf.js est chargé depuis public/ (copié par le script "postinstall").
// `new Function` rend l'import opaque pour le bundler, qui ne tente donc pas de l'analyser.
function loadPdfJs(): Promise<PdfJs> {
    if (!pdfjsPromise) {
        const nativeImport = new Function("url", "return import(url)") as (url: string) => Promise<PdfJs>;
        pdfjsPromise = nativeImport("/pdf.min.mjs").then((lib) => {
            lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
            return lib;
        });
        pdfjsPromise.catch(() => {
            pdfjsPromise = null;
        });
    }
    return pdfjsPromise;
}

function PdfPage({
    doc,
    pageNumber,
    width,
    registerRef,
}: {
    doc: PDFDocumentProxy;
    pageNumber: number;
    width: number;
    registerRef: (n: number, el: HTMLDivElement | null) => void;
}) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const taskRef = useRef<ReturnType<PDFPageProxy["render"]> | null>(null);
    const renderedWidth = useRef(0);

    const [page, setPage] = useState<PDFPageProxy | null>(null);
    const [ratio, setRatio] = useState(Math.SQRT2); // A4 en attendant la vraie mesure
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let cancelled = false;
        doc.getPage(pageNumber).then((p) => {
            if (cancelled) return;
            const v = p.getViewport({ scale: 1 });
            setRatio(v.height / v.width);
            setPage(p);
        });
        return () => {
            cancelled = true;
        };
    }, [doc, pageNumber]);

    // Les pages ne sont dessinées que lorsqu'elles sont proches de l'écran
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const root = el.closest<HTMLElement>("[data-pdf-scroll]");
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            root,
            rootMargin: "900px 0px",
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!page || !visible || width <= 0) return;
        const targetWidth = Math.round(width);
        if (renderedWidth.current === targetWidth) return;

        let cancelled = false;
        (async () => {
            const previous = taskRef.current;
            if (previous) {
                previous.cancel();
                try {
                    await previous.promise;
                } catch {
                    /* annulé */
                }
            }
            if (cancelled) return;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            const base = page.getViewport({ scale: 1 });
            const cssScale = width / base.width;
            const cssHeight = base.height * cssScale;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const out = Math.min(dpr, Math.sqrt(MAX_CANVAS_PIXELS / (width * cssHeight)));
            const viewport = page.getViewport({ scale: cssScale * out });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);

            const task = page.render({ canvasContext: ctx, canvas, viewport } as Parameters<PDFPageProxy["render"]>[0]);
            taskRef.current = task;
            try {
                await task.promise;
                renderedWidth.current = targetWidth;
            } catch {
                /* annulé par un nouveau rendu */
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [page, visible, width]);

    useEffect(() => () => taskRef.current?.cancel(), []);

    return (
        <div
            ref={(el) => {
                wrapRef.current = el;
                registerRef(pageNumber, el);
            }}
            className="shrink-0 bg-white shadow-lg"
            style={{ width, height: width * ratio }}
        >
            <canvas ref={canvasRef} className="block" style={{ width: "100%", height: "100%" }} />
        </div>
    );
}

export default function PdfViewer({ src, active }: { src: string; active: boolean }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pageEls = useRef(new Map<number, HTMLDivElement>());
    const keepCenter = useRef<{ x: number; y: number } | null>(null);

    const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
    const [failed, setFailed] = useState(false);
    const [boxWidth, setBoxWidth] = useState(0);
    const [zoomIndex, setZoomIndex] = useState(ZOOM_STEPS.indexOf(1));
    const [current, setCurrent] = useState(1);

    const zoom = ZOOM_STEPS[zoomIndex];

    useEffect(() => {
        let cancelled = false;
        let loadingTask: ReturnType<PdfJs["getDocument"]> | null = null;
        (async () => {
            try {
                const pdfjs = await loadPdfJs();
                if (cancelled) return;
                loadingTask = pdfjs.getDocument({ url: src });
                const pdf = await loadingTask.promise;
                if (cancelled) return;
                setDoc(pdf);
            } catch {
                if (!cancelled) setFailed(true);
            }
        })();
        return () => {
            cancelled = true;
            // détruit la tâche, et donc aussi le document chargé et son worker
            void loadingTask?.destroy();
        };
    }, [src]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const update = () => setBoxWidth(el.clientWidth);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const registerRef = useCallback((n: number, el: HTMLDivElement | null) => {
        if (el) pageEls.current.set(n, el);
        else pageEls.current.delete(n);
    }, []);

    const onScroll = useCallback(() => {
        const box = scrollRef.current;
        if (!box) return;
        const middle = box.scrollTop + box.clientHeight / 2;
        let best = 1;
        pageEls.current.forEach((el, n) => {
            if (el.offsetTop <= middle) best = Math.max(best, n);
        });
        setCurrent(best);
    }, []);

    const changeZoom = (delta: number) => {
        const next = Math.min(ZOOM_STEPS.length - 1, Math.max(0, zoomIndex + delta));
        if (next === zoomIndex) return;
        const box = scrollRef.current;
        if (box) {
            keepCenter.current = {
                x: (box.scrollLeft + box.clientWidth / 2) / box.scrollWidth,
                y: (box.scrollTop + box.clientHeight / 2) / box.scrollHeight,
            };
        }
        setZoomIndex(next);
    };

    // Après un changement de zoom, on garde le même point au centre de l'écran
    useLayoutEffect(() => {
        const box = scrollRef.current;
        const c = keepCenter.current;
        if (!box || !c) return;
        keepCenter.current = null;
        box.scrollLeft = c.x * box.scrollWidth - box.clientWidth / 2;
        box.scrollTop = c.y * box.scrollHeight - box.clientHeight / 2;
    }, [zoomIndex]);

    const baseWidth = Math.max(160, Math.min(BASE_MAX_WIDTH, boxWidth - PAGE_PAD * 2));
    const pageWidth = baseWidth * zoom;
    const innerWidth = Math.max(boxWidth, pageWidth + PAGE_PAD * 2);

    const button =
        "flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-ink transition-colors hover:bg-ink/10 disabled:opacity-30";

    return (
        <div className={`absolute inset-0 ${active ? "" : "invisible pointer-events-none"}`} aria-hidden={!active}>
            <div
                ref={scrollRef}
                data-pdf-scroll
                onScroll={onScroll}
                className="absolute inset-0 overflow-auto"
                style={{ background: "#3a2a1a" }}
            >
                {doc && boxWidth > 0 && (
                    <div className="relative flex flex-col items-center gap-4 py-4" style={{ width: innerWidth }}>
                        {Array.from({ length: doc.numPages }, (_, i) => (
                            <PdfPage
                                key={i + 1}
                                doc={doc}
                                pageNumber={i + 1}
                                width={pageWidth}
                                registerRef={registerRef}
                            />
                        ))}
                    </div>
                )}
            </div>

            {!doc && !failed && (
                <p
                    className="absolute inset-0 flex items-center justify-center text-parchment/70 animate-pulse pointer-events-none"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    Loading…
                </p>
            )}

            {failed && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-parchment/80"
                    style={{ fontFamily: "var(--font-playfair)" }}
                >
                    <p>The document could not be displayed.</p>
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-cream px-4 py-2 text-sm text-ink"
                    >
                        Open the PDF
                    </a>
                </div>
            )}

            {doc && (
                <>
                    <div className="absolute left-3 bottom-3 z-20 rounded-full bg-cream/95 px-3 py-1.5 text-xs tabular-nums text-ink shadow-md">
                        {current} / {doc.numPages}
                    </div>

                    <div className="absolute right-3 bottom-3 z-20 flex items-center gap-0.5 rounded-full bg-cream/95 p-1 shadow-md">
                        <button
                            type="button"
                            aria-label="Zoom out"
                            className={button}
                            disabled={zoomIndex === 0}
                            onClick={() => changeZoom(-1)}
                        >
                            −
                        </button>
                        <span className="w-12 text-center text-xs tabular-nums text-ink">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            type="button"
                            aria-label="Zoom in"
                            className={button}
                            disabled={zoomIndex === ZOOM_STEPS.length - 1}
                            onClick={() => changeZoom(1)}
                        >
                            +
                        </button>
                        <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open the PDF in a new tab"
                            className={button}
                        >
                            ↗
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
