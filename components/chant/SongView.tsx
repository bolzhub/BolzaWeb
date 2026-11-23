"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SongFile } from "@/lib/chant/types";
import PdfViewer from "@/components/RootBrainTeasers/PdfViewer";
import TagPicker from "./TagPicker";
import UploadStatus from "./UploadStatus";
import { extractDroppedFiles, useUploader } from "./useUploader";
import TagChip from "./TagChip";
import DeleteSongButton, { XIcon } from "./DeleteSongButton";
import RenameSongButton, { RenameButton } from "./RenameSongButton";

// Souris : icônes révélées au survol de leur zone « group ». Tactile (pas de survol) : toujours visibles.
// HOVER_REVEAL (crayon du titre) : transparentes, leur place reste réservée.
const HOVER_REVEAL =
    "flex shrink-0 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100";
// ROW_ACTIONS (renommer, télécharger, supprimer d'une ligne de fichier) : posées par-dessus la fin du nom,
// sur le fond de la ligne (--row-bg) avec un fondu, sans décaler le texte. Tactile : dans le flux, à droite.
const ROW_ACTIONS =
    "flex shrink-0 items-center gap-3 [@media(hover:hover)]:absolute [@media(hover:hover)]:inset-y-0 [@media(hover:hover)]:right-0 [@media(hover:hover)]:hidden [@media(hover:hover)]:bg-[linear-gradient(to_right,transparent,var(--row-bg)_2rem)] [@media(hover:hover)]:pr-3 [@media(hover:hover)]:pl-8 [@media(hover:hover)]:group-focus-within:flex [@media(hover:hover)]:group-hover:flex";

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
    tagOrder,
    fromTag = null,
}: {
    diskName: string;
    name: string;
    files: SongFile[];
    allTags: string[]; // ordre de création (couleurs)
    selectedTags: string[];
    tagOrder: string[]; // ordre d'affichage
    fromTag?: string | null; // tag depuis lequel le dossier a été ouvert
}) {
    const router = useRouter();
    // On garde le tag d'origine dans l'URL : le retour ramène dans ce tag
    const tagQuery = fromTag ? `?${new URLSearchParams({ tag: fromTag })}` : "";
    const backHref = `/chant${tagQuery}`;
    const shownTags = tagOrder.filter((t) => selectedTags.includes(t));
    const { items, upload, clearFinished } = useUploader();
    const inputRef = useRef<HTMLInputElement>(null);
    const [mediaName, setMediaName] = useState<string | null>(null);
    const [docName, setDocName] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const media = files.find((f) => f.name === mediaName) ?? null;
    const doc = files.find((f) => f.name === docName) ?? null;
    const hasViewer = Boolean(media || doc);

    // Raccourcis clavier du lecteur, actifs dès qu'un audio ou une vidéo est ouvert
    // (pas seulement quand le lecteur a le focus) : Espace = lecture/pause, ← → = -5 s / +5 s
    // Type commun pour pouvoir le poser sur <audio> comme sur <video>
    const mediaRef = useRef<HTMLAudioElement & HTMLVideoElement>(null);
    const mediaOpen = media !== null;
    useEffect(() => {
        if (!mediaOpen) return;
        const onKey = (e: KeyboardEvent) => {
            const el = mediaRef.current;
            if (!el || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
            const target = e.target as HTMLElement;
            // Le lecteur gère lui-même ses touches quand il a le focus ; on laisse aussi
            // tranquilles les champs de saisie et les fenêtres (renommage, tags…)
            if (target === el || target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) {
                return;
            }
            if (e.key === " ") {
                e.preventDefault(); // pas de défilement, ni de « clic » sur le bouton qui a le focus
                if (el.paused) void el.play();
                else el.pause();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                const step = e.key === "ArrowLeft" ? -5 : 5;
                const end = Number.isFinite(el.duration) ? el.duration : Infinity;
                el.currentTime = Math.min(Math.max(el.currentTime + step, 0), end);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mediaOpen]);

    const fileUrl = (fileName: string, download = false) =>
        `/api/chant/file?${new URLSearchParams({ song: diskName, name: fileName, ...(download ? { download: "1" } : {}) })}`;

    async function removeFile(file: SongFile) {
        const message =
            `Êtes-vous sûr de vouloir supprimer le fichier « ${file.name} » ?\n\n` +
            "Il sera placé dans la corbeille (.corbeille) et effacé définitivement après 30 jours.";
        if (!window.confirm(message)) return;
        setDeleting(file.name);
        setFileError(null);
        const res = await fetch("/api/chant/file", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ song: diskName, name: file.name }),
        });
        const data = await res.json().catch(() => ({}));
        setDeleting(null);
        if (!res.ok) {
            setFileError(data.error ?? "Erreur.");
            return;
        }
        // Ferme le lecteur s'il affichait ce fichier
        if (mediaName === file.name) setMediaName(null);
        if (docName === file.name) setDocName(null);
        router.refresh();
    }

    // L'extension reste fixe : on ne renomme que la partie avant (comme le fait storage.uniqueFileName)
    function splitName(fileName: string) {
        const dot = fileName.lastIndexOf(".");
        return dot > 0 ? { stem: fileName.slice(0, dot), ext: fileName.slice(dot) } : { stem: fileName, ext: "" };
    }

    async function renameFile(file: SongFile, stem: string): Promise<string | null> {
        const res = await fetch("/api/chant/file", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ song: diskName, name: file.name, newName: stem + splitName(file.name).ext }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return data.error ?? "Erreur.";
        // Le lecteur suit le fichier renommé
        if (mediaName === file.name) setMediaName(data.name);
        if (docName === file.name) setDocName(data.name);
        router.refresh();
        return null;
    }

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
                {/* Portable : titre sur toute la largeur, boutons en dessous. Ordi : une seule ligne */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex min-w-0 items-center gap-2 md:flex-1">
                        <Link
                            href={backHref}
                            aria-label="Retour aux chansons"
                            className="shrink-0 rounded-full p-1.5 hover:bg-black/5"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="group flex min-w-0 flex-1 items-center gap-1 text-xl font-semibold md:text-2xl">
                            <span className="min-w-0 break-words">{name}</span>
                            <span className={HOVER_REVEAL}>
                                <RenameSongButton
                                    diskName={diskName}
                                    name={name}
                                    size="md"
                                    onRenamed={(slug) => router.replace(`/chant/${slug}${tagQuery}`)}
                                />
                            </span>
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pl-1 md:shrink-0 md:pl-0">
                        <TagPicker
                            song={diskName}
                            songName={name}
                            allTags={allTags}
                            order={tagOrder}
                            selected={selectedTags}
                        />
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
                        <DeleteSongButton
                            diskName={diskName}
                            name={name}
                            fileCount={files.length}
                            redirectTo={backHref}
                            size="md"
                            className="ml-auto md:ml-0"
                        />
                    </div>
                </div>
                {shownTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pl-1">
                        {shownTags.map((t) => (
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
                                        ref={mediaRef}
                                        key={media.name}
                                        src={fileUrl(media.name)}
                                        controls
                                        autoPlay
                                        className="w-full"
                                    />
                                ) : (
                                    <video
                                        ref={mediaRef}
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
                                        className={`group relative flex items-center gap-3 bg-(--row-bg) px-3 py-2.5 ${active ? "[--row-bg:#f4f4f4]" : "[--row-bg:#fff]"}`}
                                    >
                                        <button
                                            onClick={() => open(f)}
                                            className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                        >
                                            <span className="w-14 shrink-0 rounded-md bg-black/5 px-1.5 py-0.5 text-center text-[11px] uppercase tracking-wide">
                                                {KIND_LABEL[f.kind]}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm leading-snug wrap-anywhere">
                                                    {f.name}
                                                </span>
                                                <span className="block text-xs opacity-60">{formatSize(f.size)}</span>
                                            </span>
                                        </button>
                                        <span className={ROW_ACTIONS}>
                                            <RenameButton
                                                title={`Renommer ${f.name}`}
                                                value={splitName(f.name).stem}
                                                suffix={splitName(f.name).ext}
                                                size="md"
                                                onRename={(stem) => renameFile(f, stem)}
                                            />
                                            <a
                                                href={fileUrl(f.name, true)}
                                                download={f.name}
                                                aria-label={`Télécharger ${f.name}`}
                                                className="shrink-0 rounded-full p-1.5 opacity-50 hover:bg-black/5 hover:opacity-100"
                                                title="Télécharger"
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
                                            <button
                                                onClick={() => removeFile(f)}
                                                disabled={deleting === f.name}
                                                aria-label={`Supprimer ${f.name}`}
                                                title="Supprimer"
                                                className="shrink-0 rounded-full p-1.5 opacity-50 hover:bg-black/5 hover:text-red-700 hover:opacity-100 disabled:opacity-20"
                                            >
                                                <XIcon className="h-5 w-5" />
                                            </button>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {fileError && <p className="mt-2 text-sm text-red-700">{fileError}</p>}
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
