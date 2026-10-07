export function getYoutubeVideoId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
        if (u.hostname.includes("youtube.com")) {
            if (u.pathname === "/watch") return u.searchParams.get("v");
            const match = u.pathname.match(/^\/(embed|shorts)\/([^/?]+)/);
            if (match) return match[2];
        }
        return null;
    } catch {
        return null;
    }
}

// Synchrone : aucune requête réseau nécessaire pour une vidéo.
export function getVideoThumbnail(url: string): string | null {
    const id = getYoutubeVideoId(url);
    return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
}