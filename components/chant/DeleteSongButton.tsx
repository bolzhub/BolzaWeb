"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSongButton({
  diskName,
  name,
  fileCount = 0,
  redirectTo,
  className = "",
}: {
  diskName: string;
  name: string;
  fileCount?: number;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const content =
      fileCount > 0 ? ` et ses ${fileCount} fichier${fileCount > 1 ? "s" : ""}` : "";
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

  return (
    <>
      <button
        onClick={remove}
        disabled={busy}
        className={`text-xs opacity-50 hover:text-red-700 hover:opacity-100 disabled:opacity-30 ${className}`}
      >
        {busy ? "Suppression…" : "Supprimer"}
      </button>
      {error && <span className="w-full text-xs text-red-700">{error}</span>}
    </>
  );
}
