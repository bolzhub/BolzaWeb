export type FileKind = "pdf" | "image" | "audio" | "video" | "other";

export type SongFile = {
  name: string;
  size: number;
  modified: number;
  kind: FileKind;
};

export type SongSummary = {
  slug: string; // identifiant d'URL
  diskName: string; // nom réel sur le disque
  name: string; // nom affiché
  fileCount: number;
  isEmpty: boolean; // aucun fichier visible ni sous-dossier
  tags: string[];
};