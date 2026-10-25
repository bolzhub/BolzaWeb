"use client";

import type { UploadItem } from "./useUploader";

export default function UploadStatus({
  items,
  onClear,
}: {
  items: UploadItem[];
  onClear: () => void;
}) {
  if (items.length === 0) return null;
  const finished = items.every((i) => i.status === "done" || i.status === "error");

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,360px)] max-h-[50vh] overflow-y-auto rounded-2xl bg-white border border-black/10 shadow-xl p-3 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="space-y-1">
          <div className="flex justify-between gap-2 text-sm">
            <span className="truncate">{item.name}</span>
            <span className="shrink-0 opacity-60">
              {item.status === "done" && "Envoyé"}
              {item.status === "queued" && "En attente"}
              {item.status === "uploading" && `${Math.round(item.progress * 100)} %`}
              {item.status === "error" && "Échec"}
            </span>
          </div>
          {item.status === "error" ? (
            <p className="text-xs text-red-700">{item.error}</p>
          ) : (
            <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-[#2b2926] transition-[width]"
                style={{ width: `${Math.round(item.progress * 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
      {finished && (
        <button onClick={onClear} className="text-xs underline underline-offset-2 opacity-70">
          Masquer
        </button>
      )}
    </div>
  );
}