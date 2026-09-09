import fs from "fs";
import path from "path";

// ⚠️ À adapter : chemin RÉEL sur le disque de la Pi (pas l'URL nginx)
const ADR_PATH = "/mnt/Bolzananas/Projets/ADR";
const ADR_URL_BASE = "/data/Projets/ADR";

export type Gallery = {
  slug: string;
  name: string;
  cover: string;
  images: string[];
};

// "03 Victor - 2 juillet 2026" -> "Victor - 2 juillet 2026"
function stripOrderPrefix(folderName: string): string {
  return folderName.replace(/^\d+\s*[-_ ]*/, "");
}

function sortImages(files: string[]): string[] {
  return files
    .filter((f) => /^Illustration_sans_titre( \d+)?\.png$/i.test(f))
    .sort((a, b) => {
      const numA = a.match(/(\d+)/);
      const numB = b.match(/(\d+)/);
      // Le fichier sans numéro (l'image "couverture") passe toujours en premier
      const nA = numA ? parseInt(numA[1], 10) : -1;
      const nB = numB ? parseInt(numB[1], 10) : -1;
      return nA - nB;
    });
}

export function getGalleries(): Gallery[] {
  const entries = fs.readdirSync(ADR_PATH, { withFileTypes: true });

  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] ?? "0", 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] ?? "0", 10);
      return numB - numA; // décroissant : plus grand numéro en premier
    });

  return folders.map((folderName) => {
    const fullPath = path.join(ADR_PATH, folderName);
    const files = fs.readdirSync(fullPath);
    const sortedImages = sortImages(files); // inchangé : ordre des images dans chaque pile
    const images = sortedImages.map(
      (f) =>
        `${ADR_URL_BASE}/${encodeURIComponent(folderName)}/${encodeURIComponent(f)}`
    );

    return {
      slug: encodeURIComponent(folderName),
      name: stripOrderPrefix(folderName),
      cover: images[0],
      images,
    };
  });
}

export function getGalleryBySlug(slug: string): Gallery | undefined {
  return getGalleries().find((g) => g.slug === slug);
}