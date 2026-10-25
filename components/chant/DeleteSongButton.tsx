"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSongButton({
  diskName,
  name,
  redirectTo,
  className = "",
}: {
  diskName: string;
  name: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm(`Supprimer le dossier vide « ${name} » ?`)) return;
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