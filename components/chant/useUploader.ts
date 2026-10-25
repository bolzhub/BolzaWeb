"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

const CHUNK_SIZE = 16 * 1024 * 1024; // reste très en dessous des 100 Mo de Cloudflare

const randomId = () => Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ChunkResult = { status: number; data: { error?: string; received?: number } | null };

function sendChunk(url: string, blob: Blob, onProgress: (loaded: number) => void): Promise<ChunkResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.upload.onprogress = (e) => onProgress(e.loaded);
    xhr.onload = () => {
      let data: ChunkResult["data"] = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* réponse non JSON */
      }
      resolve({ status: xhr.status, data });
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(blob);
  });
}

async function uploadFile(song: string, file: File, onProgress: (fraction: number) => void) {
  const uploadId = randomId();
  let offset = 0;
  let failures = 0;

  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const params = new URLSearchParams({
      song,
      name: file.name,
      uploadId,
      offset: String(offset),
      total: String(file.size),
    });

    let result: ChunkResult;
    try {
      result = await sendChunk(`/api/chant/upload?${params}`, file.slice(offset, end), (loaded) =>
        onProgress((offset + loaded) / file.size)
      );
    } catch {
      if (++failures > 5) throw new Error("Connexion perdue.");
      await sleep(1000 * failures);
      continue;
    }

    // Le serveur indique où reprendre (après une coupure réseau par exemple)
    if (result.status === 409 && typeof result.data?.received === "number") {
      if (++failures > 8 || result.data.received >= file.size) throw new Error("Reprise impossible.");
      offset = result.data.received;
      continue;
    }

    if (result.status < 200 || result.status >= 300) {
      throw new Error(result.data?.error ?? `Erreur ${result.status}`);
    }

    offset = end;
    failures = 0;
    onProgress(offset / file.size);
  }
}

export function extractDroppedFiles(dt: DataTransfer): { files: File[]; skippedFolders: number } {
  const files: File[] = [];
  let skippedFolders = 0;

  if (dt.items && dt.items.length) {
    for (const item of Array.from(dt.items)) {
      if (item.kind !== "file") continue;
      const entry = typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null;
      if (entry?.isDirectory) {
        skippedFolders++;
        continue;
      }
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  } else {
    files.push(...Array.from(dt.files));
  }
  return { files, skippedFolders };
}

export function useUploader() {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const patch = useCallback(
    (id: string, changes: Partial<UploadItem>) =>
      setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...changes } : i))),
    []
  );

  const upload = useCallback(
    (song: string, files: File[], skippedFolders = 0) => {
      const entries = files.map((file) => ({ file, id: randomId() }));

      setItems((cur) => [
        ...cur,
        ...(skippedFolders
          ? [
              {
                id: randomId(),
                name: `${skippedFolders} dossier(s) ignoré(s)`,
                progress: 0,
                status: "error" as const,
                error: "Créez d'abord le dossier chanson, puis déposez les fichiers dedans.",
              },
            ]
          : []),
        ...entries.map(({ file, id }) => ({
          id,
          name: file.name,
          progress: 0,
          status: "queued" as const,
        })),
      ]);

      queue.current = queue.current.then(async () => {
        for (const { file, id } of entries) {
          if (file.size === 0) {
            patch(id, { status: "error", error: "Fichier vide." });
            continue;
          }
          patch(id, { status: "uploading" });
          try {
            await uploadFile(song, file, (p) => patch(id, { progress: p }));
            patch(id, { status: "done", progress: 1 });
          } catch (err) {
            patch(id, { status: "error", error: err instanceof Error ? err.message : "Erreur." });
          }
        }
        router.refresh();
      });
    },
    [patch, router]
  );

  const clearFinished = useCallback(
    () => setItems((cur) => cur.filter((i) => i.status === "queued" || i.status === "uploading")),
    []
  );

  return { items, upload, clearFinished };
}