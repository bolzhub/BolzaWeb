"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Croix de suppression, partagée avec la liste des fichiers et le menu ⋯
export function XIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Suppression d'un dossier (avec confirmation), partagée entre la croix et le menu ⋯
export function useDeleteSong({
  diskName,
  name,
  fileCount = 0,
  redirectTo,
}: {
  diskName: string;
  name: string;
  fileCount?: number;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const content =
      fileCount === 1 ? " et son fichier" : fileCount > 1 ? ` et ses ${fileCount} fichiers` : "";
    const message =
      `Supprimer le dossier « ${name} »${content} ?\n\n` +
      "Il sera placé dans la corbeille (.corbeille) et effacé définitivement après 30 jours.";
    if (!window.confirm(message)) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/chant/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song: diskName }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Erreur.");
      return;
    }
    if (redirectTo) router.push(redirectTo);
    else router.refresh();
  }

  return { remove, busy, error };
}

export default function DeleteSongButton({
  size = "sm",
  className = "",
  ...song
}: {
  diskName: string;
  name: string;
  fileCount?: number;
  redirectTo?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { remove, busy, error } = useDeleteSong(song);

  return (
    <>
      <button
        onClick={remove}
        disabled={busy}
        aria-label={`Supprimer ${song.name}`}
        title="Supprimer"
        className={`shrink-0 rounded-full p-1.5 opacity-50 hover:bg-black/5 hover:text-red-700 hover:opacity-100 disabled:opacity-20 ${className}`}
      >
        <XIcon className={size === "md" ? "h-5 w-5" : "h-4 w-4"} />
      </button>
      {error && <span className="w-full text-xs text-red-700">{error}</span>}
    </>
  );
}
