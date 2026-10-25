"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { SongFile } from "@/lib/chant/types";
import PdfViewer from "@/components/RootBrainTeasers/PdfViewer";
import TagPicker from "./TagPicker";
import UploadStatus from "./UploadStatus";
import { extractDroppedFiles, useUploader } from "./useUploader";
import TagChip from "./TagChip";
import DeleteSongButton from "./DeleteSongButton";

const KIND_LABEL = { pdf: "PDF", image: "Image", audio: "Audio", video: "Vidéo", other: "Fichier" } as const;

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    const units = ["Ko", "Mo", "Go"];
    let value = bytes / 1024;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
}

function Panel({
    title,
    openUrl,
    downloadUrl,
    onClose,
    children,
}: {
    title: string;
    openUrl: string;
    downloadUrl: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-2 rounded-2xl border border-black/10 bg-white p-3">
            <div className="flex items-center gap-3">
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
                <a
                    href={openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-2 opacity-70"
                >
                    Ouvrir
                </a>
                <a href={downloadUrl} className="text-xs underline underline-offset-2 opacity-70">
                    Télécharger
                </a>
                <button onClick={onClose} aria-label="Fermer" className="opacity-60 hover:opacity-100">
                    ✕
                </button>
            </div>
            {children}
        </section>
    );
}

export default function SongView({
    diskName,
    name,
    files,
    allTags,
    selectedTags,
}: {
    diskName: string;
    name: string;
    files: SongFile[];
    allTags: string[];
    selectedTags: string[];
}) {
    const { items, upload, clearFinished } = useUploader();
    const inputRef = useRef<HTMLInputElement>(null);
    const [mediaName, setMediaName] = useState<string | null>(null);
    const [docName, setDocName] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    const media = files.find((f) => f.name === mediaName) ?? null;
    const doc = files.find((f) => f.name === docName) ?? null;
    const hasViewer = Boolean(media || doc);

    const fileUrl = (fileName: string, download = false) =>
        `/api/chant/file?${new URLSearchParams({ song: diskName, name: fileName, ...(download ? { download: "1" } : {}) })}`;

    function open(file: SongFile) {
        if (file.kind === "audio" || file.kind === "video") setMediaName(file.name);
        else if (file.kind === "pdf" || file.kind === "image") setDocName(file.name);
        else window.location.assign(fileUrl(file.name, true));
    }

    return (
        <main
            className="mx-auto max-w-7xl p-4 md:p-8"
            onDragOver={(e) => {
                if (e.dataTransfer.types.includes("Files")) {
                    e.preventDefault();
                    setDragging(true);
                }
            }}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const { files: dropped, skippedFolders } = extractDroppedFiles(e.dataTransfer);
                if (dropped.length || skippedFolders) upload(diskName, dropped, skippedFolders);
            }}
        >
            <header className="mb-6 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/chant"
                        aria-label="Retour aux chansons"
                        className="rounded-full p-1.5 hover:bg-black/5"
                    >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="min-w-0 flex-1 break-words text-xl font-semibold md:text-2xl">{name}</h1>
                    <TagPicker song={diskName} songName={name} allTags={allTags} selected={selectedTags} />
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="rounded-full bg-[#2b2926] px-4 py-2 text-sm text-white"
                    >
                        Ajouter des fichiers
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const list = Array.from(e.target.files ?? []);
                            e.target.value = "";
                            if (list.length) upload(diskName, list);
                        }}
                    />
                    {files.length === 0 && <DeleteSongButton diskName={diskName} name={name} redirectTo="/chant" />}
                </div>
                {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1">
                        {selectedTags.map((t) => (
                            <TagChip key={t} tag={t} allTags={allTags} />
                        ))}
                    </div>
                )}
            </header>

            <div
                className={
                    hasViewer
                        ? "flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(260px,340px)_1fr]"
                        : "flex max-w-2xl flex-col gap-6"
                }
            >
                {hasViewer && (
                    <div className="order-first min-w-0 space-y-4 lg:order-last">
                        {media && (
                            <Panel
                                title={media.name}
                                openUrl={fileUrl(media.name)}
                                downloadUrl={fileUrl(media.name, true)}
                                onClose={() => setMediaName(null)}
                            >
                                {media.kind === "audio" ? (
                                    <audio
                                        key={media.name}
                                        src={fileUrl(media.name)}
                                        controls
                                        autoPlay
                                        className="w-full"
                                    />
                                ) : (
                                    <video
                                        key={media.name}
                                        src={fileUrl(media.name)}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="max-h-[45vh] w-full rounded-lg bg-black"
                                    />
                                )}
                            </Panel>
                        )}
                        {doc && (
                            <Panel
                                title={doc.name}
                                openUrl={fileUrl(doc.name)}
                                downloadUrl={fileUrl(doc.name, true)}
                                onClose={() => setDocName(null)}
                            >
                                {doc.kind === "pdf" ? (
                                    <div className="relative h-[70vh] overflow-hidden rounded-lg lg:h-[80vh]">
                                        <PdfViewer key={doc.name} src={fileUrl(doc.name)} active />
                                    </div>
                                ) : (
                                    <img
                                        key={doc.name}
                                        src={fileUrl(doc.name)}
                                        alt={doc.name}
                                        className="max-h-[80vh] w-full rounded-lg object-contain"
                                    />
                                )}
                            </Panel>
                        )}
                    </div>
                )}

                <div className="min-w-0">
                    {files.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-black/20 p-8 text-center opacity-60">
                            Aucun fichier. Glissez-en ici ou utilisez « Ajouter des fichiers ».
                        </p>
                    ) : (
                        <ul className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/10 bg-white">
                            {files.map((f) => {
                                const active = f.name === mediaName || f.name === docName;
                                return (
                                    <li
                                        key={f.name}
                                        className={`flex items-center gap-3 px-3 py-2.5 ${active ? "bg-[#2b2926]/5" : ""}`}
                                    >
                                        <button
                                            onClick={() => open(f)}
                                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                        >
                                            <span className="w-14 shrink-0 rounded-md bg-black/5 px-1.5 py-0.5 text-center text-[11px] uppercase tracking-wide">
                                                {KIND_LABEL[f.kind]}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm">{f.name}</span>
                                                <span className="block text-xs opacity-60">{formatSize(f.size)}</span>
                                            </span>
                                        </button>
                                        <a
                                            href={fileUrl(f.name, true)}
                                            download={f.name}
                                            aria-label={`Télécharger ${f.name}`}
                                            className="shrink-0 rounded-full p-1.5 hover:bg-black/5"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"
                                                />
                                            </svg>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>

            {dragging && (
                <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center border-4 border-dashed border-[#2b2926]/50 bg-white/70">
                    <p className="rounded-xl bg-white px-4 py-2 shadow">Déposez pour envoyer dans « {name} »</p>
                </div>
            )}

            <UploadStatus items={items} onClear={clearFinished} />
        </main>
    );
}
