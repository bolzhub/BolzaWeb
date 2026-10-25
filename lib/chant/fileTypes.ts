import type { FileKind } from "./types";

type Info = { kind: FileKind; mime: string; inline: boolean };

const TYPES = new Map<string, Info>([
  ["pdf", { kind: "pdf", mime: "application/pdf", inline: true }],
  ["jpg", { kind: "image", mime: "image/jpeg", inline: true }],
  ["jpeg", { kind: "image", mime: "image/jpeg", inline: true }],
  ["png", { kind: "image", mime: "image/png", inline: true }],
  ["gif", { kind: "image", mime: "image/gif", inline: true }],
  ["webp", { kind: "image", mime: "image/webp", inline: true }],
  ["avif", { kind: "image", mime: "image/avif", inline: true }],
  ["mp3", { kind: "audio", mime: "audio/mpeg", inline: true }],
  ["m4a", { kind: "audio", mime: "audio/mp4", inline: true }],
  ["aac", { kind: "audio", mime: "audio/aac", inline: true }],
  ["wav", { kind: "audio", mime: "audio/wav", inline: true }],
  ["ogg", { kind: "audio", mime: "audio/ogg", inline: true }],
  ["oga", { kind: "audio", mime: "audio/ogg", inline: true }],
  ["opus", { kind: "audio", mime: "audio/ogg", inline: true }],
  ["flac", { kind: "audio", mime: "audio/flac", inline: true }],
  ["mp4", { kind: "video", mime: "video/mp4", inline: true }],
  ["m4v", { kind: "video", mime: "video/mp4", inline: true }],
  ["mov", { kind: "video", mime: "video/quicktime", inline: true }],
  ["webm", { kind: "video", mime: "video/webm", inline: true }],
]);

const OTHER: Info = { kind: "other", mime: "application/octet-stream", inline: false };

export function getFileInfo(name: string): Info {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  return TYPES.get(ext) ?? OTHER;
}