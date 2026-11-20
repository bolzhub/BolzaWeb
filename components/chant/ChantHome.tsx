"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { SongSummary } from "@/lib/chant/types";
import { getTagColor } from "@/lib/chant/tagColors";
import TagChip from "./TagChip";
import { NewTagForm } from "./TagPicker";
import UploadStatus from "./UploadStatus";
import { extractDroppedFiles, useUploader } from "./useUploader";
import SongCardActions from "./SongCardActions";
import TagBar from "./TagBar";

// Icône de dossier : bandes diagonales aux couleurs des tags du dossier
function FolderIcon({ colors }: { colors: string[] }) {
    const gradientId = useId().replace(/:/g, "");
    const fill = colors.length === 0 ? "currentColor" : colors.length === 1 ? colors[0] : `url(#${gradientId})`;

    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-10 w-10 ${colors.length === 0 ? "text-[#2b2926]/70" : ""}`}
        >
            {colors.length > 1 && (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        {colors.flatMap((c, i) => [
                            <stop key={`${i}a`} offset={`${(i / colors.length) * 100}%`} stopColor={c} />,
                            <stop key={`${i}b`} offset={`${((i + 1) / colors.length) * 100}%`} stopColor={c} />,
                        ])}
                    </linearGradient>
                </defs>
            )}
            <path
                fill={fill}
                d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
            />
        </svg>
    );
}

export default function ChantHome({
    songs,
    tags,
    tagOrder,
}: {
    songs: SongSummary[];
    tags: string[]; // ordre de création (couleurs)
    tagOrder: string[]; // ordre d'affichage
}) {
    const router = useRouter();
    const { items, upload, clearFinished } = useUploader();
    const searchParams = useSearchParams();
    // Le tag actif vit dans l'URL (?tag=…) pour être conservé quand on revient d'un dossier
    const tagParam = searchParams.get("tag");
    const activeTag = tagParam && tags.includes(tagParam) ? tagParam : null;
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);

    // Mode tag (« coloriage ») : un clic sur un dossier ajoute ou retire le tag pinceau
    const [tagMode, setTagMode] = useState(false);
    const [brush, setBrush] = useState<string | null>(null);
    const [paintError, setPaintError] = useState<string | null>(null);
    // Tags modifiés localement, affichés tout de suite sans attendre le serveur
    const [overrides, setOverrides] = useState<Record<string, string[]>>({});
    const [pending, setPending] = useState(0);
    const queue = useRef<Promise<unknown>>(Promise.resolve());

    // Données fraîches du serveur et plus aucun envoi en attente : elles font foi
    const [prevSongs, setPrevSongs] = useState(songs);
    if (songs !== prevSongs) {
        setPrevSongs(songs);
        if (pending === 0) setOverrides({});
    }

    const tagsOf = (song: SongSummary) => overrides[song.diskName] ?? song.tags;
    const brushTag = brush && tags.includes(brush) ? brush : null;

    function setActiveTag(tag: string | null) {
        // replaceState : changer de tag ne crée pas d'entrée d'historique, et ne recharge pas la page
        window.history.replaceState(null, "", tag ? `/chant?${new URLSearchParams({ tag })}` : "/chant");
    }

    function enterTagMode() {
        setBrush(brushTag ?? activeTag ?? tagOrder[0] ?? null);
        setPaintError(null);
        setShowNew(false);
        setTagMode(true);
    }

    function exitTagMode() {
        setTagMode(false);
        router.refresh();
    }

    useEffect(() => {
        if (!tagMode) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setTagMode(false);
                router.refresh();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [tagMode, router]);

    function paint(song: SongSummary) {
        if (!brushTag) return;
        const tag = brushTag;
        const current = tagsOf(song);
        const on = !current.includes(tag);
        setOverrides((o) => ({ ...o, [song.diskName]: on ? [...current, tag] : current.filter((t) => t !== tag) }));
        setPending((n) => n + 1);
        // Envois à la file : deux clics rapides sur un dossier arrivent dans l'ordre
        queue.current = queue.current
            .then(async () => {
                const res = await fetch("/api/chant/song-tags", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ song: song.diskName, tag, on }),
                }).catch(() => null);
                if (!res?.ok) {
                    setPaintError(`Impossible de modifier « ${song.name} ». L'affichage a été rechargé.`);
                    setOverrides((o) => {
                        const rest = { ...o };
                        delete rest[song.diskName];
                        return rest;
                    });
                    router.refresh();
                }
            })
            .finally(() => setPending((n) => n - 1));
    }

    const visible = tagMode || !activeTag ? songs : songs.filter((s) => tagsOf(s).includes(activeTag));

    async function createFolder(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        const res = await fetch("/api/chant/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            setError(data.error ?? "Erreur.");
            return;
        }
        setNewName("");
        setShowNew(false);
        router.push(`/chant/${data.song.slug}`);
    }

    async function logout() {
        await fetch("/api/chant/logout", { method: "POST" });
        router.refresh();
    }

    return (
        <main
            className="mx-auto max-w-6xl p-4 md:p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
        >
            <header className="mb-6 flex flex-wrap items-center gap-3">
                <h1 className="flex-1 text-2xl font-semibold">Chant Fratellini</h1>
                <button
                    onClick={tagMode ? exitTagMode : enterTagMode}
                    aria-pressed={tagMode}
                    className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm ${tagMode ? "border-[#2b2926] bg-[#2b2926] text-white" : "border-black/20 hover:bg-black/5"}`}
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8 9.2 12l9.2-9.4ZM9.2 12c-2.3 0-4 1.7-4 4 0 1.5-.8 2.6-2.2 3.2 1 1 2.6 1.6 4.2 1.6 3 0 5-2 5-4.8"
                        />
                    </svg>
                    {tagMode ? "Terminer" : "Mode tag"}
                </button>
                <button
                    onClick={() => setShowNew((v) => !v)}
                    className="rounded-full bg-[#2b2926] px-4 py-2 text-sm text-white"
                >
                    Nouveau dossier
                </button>
                <button onClick={logout} className="text-sm underline underline-offset-2 opacity-60">
                    Se déconnecter
                </button>
            </header>

            {showNew && (
                <form
                    onSubmit={createFolder}
                    className="mb-6 space-y-2 rounded-2xl border border-black/10 bg-white p-4"
                >
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Titre de la chanson - Nom du groupe ou chanteur"
                        className="w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-black/50"
                    />
                    {error && <p className="text-sm text-red-700">{error}</p>}
                    <button
                        type="submit"
                        disabled={!newName.trim()}
                        className="rounded-lg bg-[#2b2926] px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        Créer
                    </button>
                </form>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-2">
                {!tagMode && (
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`rounded-full border px-3 py-1 text-sm ${activeTag === null ? "border-[#2b2926] bg-[#2b2926] text-white" : "border-black/20 hover:bg-black/5"}`}
                    >
                        Tous
                    </button>
                )}
                {/* En mode tag, la barre choisit le pinceau au lieu de filtrer */}
                <TagBar
                    allTags={tags}
                    tagOrder={tagOrder}
                    activeTag={tagMode ? brushTag : activeTag}
                    onSelect={tagMode ? (t) => t && setBrush(t) : setActiveTag}
                />
                <div className="w-48">
                    <NewTagForm onCreated={tagMode ? setBrush : undefined} />
                </div>
            </div>

            {tagMode && (
                <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
                    {brushTag ? (
                        <p className="flex-1">
                            Cliquez sur les dossiers pour ajouter ou retirer{" "}
                            <TagChip tag={brushTag} allTags={tags} active /> · choisissez un autre tag dans la barre
                            ci-dessus.
                        </p>
                    ) : (
                        <p className="flex-1">Créez d&apos;abord un tag pour pouvoir colorier les dossiers.</p>
                    )}
                    <span className="text-xs opacity-50">Échap pour quitter</span>
                    {paintError && <p className="w-full text-red-700">{paintError}</p>}
                </div>
            )}

            {visible.length === 0 ? (
                <p className="opacity-60">
                    {songs.length === 0 ? "Aucun dossier pour le moment." : "Aucune chanson avec ce tag."}
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {visible.map((song) => {
                        // Tags du dossier, dans l'ordre d'affichage choisi (couleurs : ordre de création)
                        const current = tagsOf(song);
                        const songTags = tagOrder.filter((t) => current.includes(t));
                        const colors = songTags.map((t) => getTagColor(t, tags).solid);

                        const content = (
                            <>
                                <FolderIcon colors={colors} />
                                <div>
                                    <p className="break-words font-medium leading-snug">{song.name}</p>
                                    <p className="text-sm opacity-60">
                                        {song.fileCount} fichier{song.fileCount > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </>
                        );

                        if (tagMode) {
                            const painted = brushTag !== null && current.includes(brushTag);
                            const color = brushTag ? getTagColor(brushTag, tags) : null;
                            return (
                                <button
                                    key={song.slug}
                                    type="button"
                                    onClick={() => paint(song)}
                                    disabled={!brushTag}
                                    aria-pressed={painted}
                                    style={
                                        {
                                            "--brush": color?.solid,
                                            "--brush-soft": color?.soft,
                                            ...(painted && color
                                                ? {
                                                      borderColor: color.solid,
                                                      backgroundColor: color.soft,
                                                      boxShadow: `0 0 0 1px ${color.solid}`,
                                                  }
                                                : {}),
                                        } as React.CSSProperties
                                    }
                                    className={`flex select-none flex-col gap-3 rounded-2xl border bg-white p-4 text-left transition enabled:cursor-pointer ${painted ? "" : "border-black/10 enabled:hover:border-(--brush)"}`}
                                >
                                    {content}
                                    <div className="flex min-h-6 flex-wrap items-center gap-1.5">
                                        {songTags.map((t) => (
                                            <TagChip key={t} tag={t} allTags={tags} />
                                        ))}
                                    </div>
                                </button>
                            );
                        }

                        return (
                            <div
                                key={song.slug}
                                onDragOver={(e) => {
                                    if (e.dataTransfer.types.includes("Files")) {
                                        e.preventDefault();
                                        setDragOver(song.slug);
                                    }
                                }}
                                onDragLeave={() => setDragOver((cur) => (cur === song.slug ? null : cur))}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(null);
                                    const { files, skippedFolders } = extractDroppedFiles(e.dataTransfer);
                                    if (files.length || skippedFolders) upload(song.diskName, files, skippedFolders);
                                }}
                                className={`group relative flex flex-col gap-3 rounded-2xl border bg-white p-4 transition ${dragOver === song.slug ? "border-[#2b2926] ring-2 ring-[#2b2926]/30" : "border-black/10"}`}
                            >
                                <Link
                                    href={`/chant/${song.slug}${activeTag ? `?${new URLSearchParams({ tag: activeTag })}` : ""}`}
                                    className="flex flex-col gap-3"
                                >
                                    {content}
                                </Link>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {songTags.map((t) => (
                                        <TagChip key={t} tag={t} allTags={tags} />
                                    ))}
                                    <SongCardActions
                                        diskName={song.diskName}
                                        name={song.name}
                                        fileCount={song.fileCount}
                                        allTags={tags}
                                        tagOrder={tagOrder}
                                        selected={current}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <UploadStatus items={items} onClear={clearFinished} />
        </main>
    );
}
