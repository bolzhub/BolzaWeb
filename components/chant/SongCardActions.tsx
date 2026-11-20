"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import TagPicker, { TagPickerDialog } from "./TagPicker";
import RenameSongButton, { PencilIcon, RenameDialog, SONG_NAME_PLACEHOLDER, useRenameSong } from "./RenameSongButton";
import DeleteSongButton, { XIcon, useDeleteSong } from "./DeleteSongButton";

// Sur un appareil avec souris (« hover:hover ») ou sans (tactile)
const MOUSE_ONLY = "hidden [@media(hover:hover)]:flex";
const TOUCH_ONLY = "[@media(hover:hover)]:hidden";

type Props = {
    diskName: string;
    name: string;
    fileCount: number;
    allTags: string[]; // ordre de création (couleurs)
    tagOrder: string[]; // ordre d'affichage
    selected: string[];
};

// Actions d'une carte de dossier (Tags, renommer, supprimer).
// Souris : icônes révélées au survol de la carte (la carte doit avoir la classe « group »).
// Tactile : bouton ⋯ en haut à droite de la carte (qui doit être « relative »), qui ouvre un menu.
export default function SongCardActions(props: Props) {
    const { diskName, name, fileCount, allTags, tagOrder, selected } = props;

    return (
        <>
            <span
                className={`${MOUSE_ONLY} ml-auto items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100`}
            >
                <TagPicker song={diskName} songName={name} allTags={allTags} order={tagOrder} selected={selected} />
                <RenameSongButton diskName={diskName} name={name} />
                <DeleteSongButton diskName={diskName} name={name} fileCount={fileCount} />
            </span>
            <TouchMenu {...props} />
        </>
    );
}

function TouchMenu({ diskName, name, fileCount, allTags, tagOrder, selected }: Props) {
    const [dialog, setDialog] = useState<"menu" | "tags" | "rename" | null>(null);
    const rename = useRenameSong(diskName);
    const { remove, busy, error } = useDeleteSong({ diskName, name, fileCount });
    const close = () => setDialog(null);

    const item = "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left active:bg-black/5";

    return (
        <>
            <button
                onClick={() => setDialog("menu")}
                aria-label={`Actions pour ${name}`}
                className={`${TOUCH_ONLY} absolute right-1.5 top-1.5 rounded-full p-2 opacity-60 active:bg-black/5`}
            >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <circle cx="5" cy="12" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="19" cy="12" r="1.8" />
                </svg>
            </button>
            {error && <span className={`${TOUCH_ONLY} w-full text-xs text-red-700`}>{error}</span>}

            {dialog === "menu" &&
                createPortal(
                    <div className="fixed inset-0 z-40 flex items-end bg-black/30" onClick={close}>
                        <div
                            className="w-full space-y-1 rounded-t-2xl bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="truncate px-4 pb-2 pt-1 text-sm font-semibold">{name}</p>
                            <button className={item} onClick={() => setDialog("tags")}>
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 opacity-60"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 11.6V4a1 1 0 0 1 1-1h7.6a1 1 0 0 1 .7.3l8.4 8.4a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0l-8.4-8.4a1 1 0 0 1-.3-.7ZM7.5 7.5h.01"
                                    />
                                </svg>
                                Tags
                            </button>
                            <button className={item} onClick={() => setDialog("rename")}>
                                <PencilIcon className="h-5 w-5 opacity-60" />
                                Renommer
                            </button>
                            <button
                                className={`${item} text-red-700`}
                                disabled={busy}
                                onClick={() => {
                                    close();
                                    void remove();
                                }}
                            >
                                <XIcon className="h-5 w-5" />
                                Supprimer
                            </button>
                            <button
                                className="mt-1 w-full rounded-xl px-4 py-3 text-center text-sm opacity-60 active:bg-black/5"
                                onClick={close}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}

            {dialog === "tags" && (
                <TagPickerDialog
                    song={diskName}
                    songName={name}
                    allTags={allTags}
                    order={tagOrder}
                    selected={selected}
                    onClose={close}
                />
            )}
            {dialog === "rename" && (
                <RenameDialog value={name} placeholder={SONG_NAME_PLACEHOLDER} onRename={rename} onClose={close} />
            )}
        </>
    );
}
