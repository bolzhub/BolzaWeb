export function mediaUrl(relativePath: string, width?: number): string {
    const encoded = relativePath.split("/").map(encodeURIComponent).join("/");
    const base = `/api/media/${encoded}`;
    return width ? `${base}?w=${width}` : base;
}

function safeDecode(s: string): string {
    try {
        return decodeURIComponent(s);
    } catch {
        return s;
    }
}

// Accepte :
//  - "/api/media/Projets/..."   (tel que dans tes autres fichiers)
//  - "Projets/..."              (chemin relatif à la racine du disque)
//  - "/og-image.png"            (fichier du dossier public/)
//  - "https://..."              (lien externe)
export function resolveImageSrc(path: string): string {
    if (/^https?:\/\//.test(path)) return path;

    if (path.startsWith("/api/media/")) {
        const relative = path
            .slice("/api/media/".length)
            .split("/")
            .map(safeDecode)
            .join("/");
        return mediaUrl(relative);
    }

    if (path.startsWith("/")) return path; // public/

    return mediaUrl(path);
}