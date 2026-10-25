"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SongSummary } from "@/lib/chant/types";
import { getTagColor } from "@/lib/chant/tagColors";
import TagChip from "./TagChip";
import TagPicker, { NewTagForm } from "./TagPicker";
import UploadStatus from "./UploadStatus";
import { extractDroppedFiles, useUploader } from "./useUploader";
import DeleteSongButton from "./DeleteSongButton";

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

export default function ChantHome({ songs, tags }: { songs: SongSummary[]; tags: string[] }) {
    const router = useRouter();
    const { items, upload, clearFinished } = useUploader();
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);

    const visible = activeTag ? songs.filter((s) => s.tags.includes(activeTag)) : songs;

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
                <button
                    onClick={() => setActiveTag(null)}
                    className={`rounded-full border px-3 py-1 text-sm ${activeTag === null ? "border-[#2b2926] bg-[#2b2926] text-white" : "border-black/20 hover:bg-black/5"}`}
                >
                    Tous
                </button>
                {tags.map((tag) => (
                    <TagChip
                        key={tag}
                        tag={tag}
                        allTags={tags}
                        size="md"
                        active={activeTag === tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    />
                ))}
                <div className="w-48">
                    <NewTagForm />
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="opacity-60">
                    {songs.length === 0 ? "Aucun dossier pour le moment." : "Aucune chanson avec ce tag."}
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {visible.map((song) => {
                        // Tags du dossier, dans l'ordre global des tags (couleurs stables)
                        const songTags = tags.filter((t) => song.tags.includes(t));
                        const colors = songTags.map((t) => getTagColor(t, tags).solid);

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
                                className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 transition ${dragOver === song.slug ? "border-[#2b2926] ring-2 ring-[#2b2926]/30" : "border-black/10"}`}
                            >
                                <Link href={`/chant/${song.slug}`} className="flex flex-col gap-3">
                                    <FolderIcon colors={colors} />
                                    <div>
                                        <p className="break-words font-medium leading-snug">{song.name}</p>
                                        <p className="text-sm opacity-60">
                                            {song.fileCount} fichier{song.fileCount > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </Link>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {songTags.map((t) => (
                                        <TagChip key={t} tag={t} allTags={tags} />
                                    ))}
                                    <TagPicker
                                        song={song.diskName}
                                        songName={song.name}
                                        allTags={tags}
                                        selected={song.tags}
                                    />
                                    {song.isEmpty && (
                                        <DeleteSongButton
                                            diskName={song.diskName}
                                            name={song.name}
                                            className="ml-auto"
                                        />
                                    )}
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
