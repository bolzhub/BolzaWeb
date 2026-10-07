export function getYoutubeVideoId(url: string): string | null {
    try {
        const u = new URL(url);

        if (u.hostname === "youtu.be") {
            return u.pathname.slice(1) || null;
        }

        if (u.hostname.includes("youtube.com")) {
            if (u.pathname === "/watch") {
                return u.searchParams.get("v");
            }
            const match = u.pathname.match(/^\/(embed|shorts)\/([^/?]+)/);
            if (match) return match[2];
        }

        return null; // lien de chaîne (@handle, /channel/..., /c/..., /user/...)
    } catch {
        return null;
    }
}

export type Preview = { type: "video" | "channel"; src: string } | null;

async function fetchChannelAvatar(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 60 * 60 * 24 * 7 }, // recache une fois par semaine
        });
        if (!res.ok) return null;
        const html = await res.text();
        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

// manualThumbnail : filet de sécurité si l'extraction automatique échoue
// pour une chaîne donnée (passe ton propre lien d'image dans les données).
export async function getItemPreview(
    url: string,
    manualThumbnail?: string
): Promise<Preview> {
    const videoId = getYoutubeVideoId(url);
    if (videoId) {
        return { type: "video", src: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` };
    }

    if (manualThumbnail) {
        return { type: "channel", src: manualThumbnail };
    }

    const avatar = await fetchChannelAvatar(url);
    return avatar ? { type: "channel", src: avatar } : null;
}