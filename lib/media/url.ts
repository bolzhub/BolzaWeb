export function mediaUrl(relativePath: string, width?: number): string {
    const encoded = relativePath.split("/").map(encodeURIComponent).join("/");
    const base = `/api/media/${encoded}`;
    return width ? `${base}?w=${width}` : base;
}