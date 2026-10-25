"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTagColor } from "@/lib/chant/tagColors";

export function NewTagForm({ onCreated }: { onCreated?: (tag: string) => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;
    const res = await fetch("/api/chant/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Erreur.");
      return;
    }
    setName("");
    onCreated?.(data.tag);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-1">
      <div className="flex items-center gap-1.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nouveau tag"
          maxLength={40}
          className="min-w-0 flex-1 rounded-full border border-black/15 px-3 py-1 text-sm outline-none focus:border-black/50"
        />
        <button type="submit" className="rounded-full bg-[#2b2926] text-white px-3 py-1 text-sm">
          Créer
        </button>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}

export default function TagPicker({
  song,
  songName,
  allTags,
  selected,
}: {
  song: string;
  songName: string;
  allTags: string[];
  selected: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(tag: string) {
    setBusy(tag);
    setError(null);
    await fetch("/api/chant/song-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song, tag, on: !selected.includes(tag) }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(tag: string) {
    if (!window.confirm(`Supprimer le tag « ${tag} » ?`)) return;
    setError(null);
    const res = await fetch("/api/chant/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tag }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Erreur.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-black/20 px-2.5 py-1 text-xs hover:bg-black/5"
      >
        Tags
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold leading-snug">Tags : {songName}</h2>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="opacity-60 hover:opacity-100">
                ✕
              </button>
            </div>

            <div className="max-h-[40vh] space-y-2 overflow-y-auto">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(tag)}
                      disabled={busy === tag}
                      onChange={() => toggle(tag)}
                    />
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: getTagColor(tag, allTags).solid }}
                    />
                    {tag}
                  </label>
                  <button
                    onClick={() => remove(tag)}
                    aria-label={`Supprimer le tag ${tag}`}
                    className="text-xs opacity-40 hover:text-red-700 hover:opacity-100"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>

            {error && <p className="text-xs text-red-700">{error}</p>}

            <div className="border-t border-black/10 pt-3">
              <NewTagForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}