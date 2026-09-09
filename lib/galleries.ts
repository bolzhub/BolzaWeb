import fs from "fs";
import path from "path";

const ADR_PATH = "/mnt/Bolzananas/Projets/ADR";
const ADR_URL_BASE = "/data/Projets/ADR";

export type HomeItem =
  | { type: "gallery"; slug: string; name: string; cover: string }
  | { type: "image"; url: string; name: string };

export type Gallery = {
  slug: string;
  name: string;
  cover: string;
  images: string[];
};

function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+\s*[-_ ]*/, "");
}

function stripExtension(name: string): string {
  return name.replace(/\.(png|jpe?g)$/i, "");
}

function getOrderPrefix(name: string): number {
  const m = name.match(/^\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function sortImages(files: string[]): string[] {
  return files
    .filter((f) => /^Illustration_sans_titre( \d+)?\.png$/i.test(f))
    .sort((a, b) => {
      const numA = a.match(/(\d+)/);
      const numB = b.match(/(\d+)/);
      const nA = numA ? parseInt(numA[1], 10) : -1;
      const nB = numB ? parseInt(numB[1], 10) : -1;
      return nA - nB;
    });
}

export function getHomeItems(): HomeItem[] {
  const entries = fs.readdirSync(ADR_PATH, { withFileTypes: true });

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ raw: e.name, order: getOrderPrefix(e.name), kind: "folder" as const }));

  const standaloneImages = entries
    .filter(
      (e) =>
        e.isFile() &&
        /\.(png|jpe?g)$/i.test(e.name) &&
        /^\d+/.test(e.name) // doit commencer par un numéro, comme les dossiers
    )
    .map((e) => ({ raw: e.name, order: getOrderPrefix(e.name), kind: "image" as const }));

  const combined = [...folders, ...standaloneImages].sort((a, b) => b.order - a.order);

  return combined.map((item) => {
    if (item.kind === "folder") {
      const fullPath = path.join(ADR_PATH, item.raw);
      const files = fs.readdirSync(fullPath);
      const images = sortImages(files).map(
        (f) => `${ADR_URL_BASE}/${encodeURIComponent(item.raw)}/${encodeURIComponent(f)}`
      );
      return {
        type: "gallery",
        slug: encodeURIComponent(item.raw),
        name: stripOrderPrefix(item.raw),
        cover: images[0],
      };
    }
    return {
      type: "image",
      url: `${ADR_URL_BASE}/${encodeURIComponent(item.raw)}`,
      name: stripExtension(stripOrderPrefix(item.raw)),
    };
  });
}

export function getGalleryBySlug(slug: string): Gallery | undefined {
  const entries = fs.readdirSync(ADR_PATH, { withFileTypes: true });
  const folder = entries.find((e) => e.isDirectory() && encodeURIComponent(e.name) === slug);
  if (!folder) return undefined;

  const fullPath = path.join(ADR_PATH, folder.name);
  const files = fs.readdirSync(fullPath);
  const images = sortImages(files).map(
    (f) => `${ADR_URL_BASE}/${encodeURIComponent(folder.name)}/${encodeURIComponent(f)}`
  );

  return {
    slug,
    name: stripOrderPrefix(folder.name),
    cover: images[0],
    images,
  };
}