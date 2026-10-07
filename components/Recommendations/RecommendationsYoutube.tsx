"use client";

import { useEffect, useState } from "react";
import { YOUTUBE_SECTIONS, type YoutubeItem } from "@/lib/Recommendations/youtube";
import { getVideoThumbnail } from "@/lib/Recommendations/youtubeThumbnail";

const FG = "#ECE5D8";

function YoutubeIcon({ size = 22 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: `${FG}4D` }}>
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
        </svg>
    );
}

function usePreview(item: YoutubeItem) {
    const videoThumb = getVideoThumbnail(item.url);
    const [channelAvatar, setChannelAvatar] = useState<string | null>(item.thumbnail ?? null);

    useEffect(() => {
        if (videoThumb || item.thumbnail) return; // vidéo, ou avatar déjà fourni manuellement
        let cancelled = false;
        fetch(`/api/youtube-channel-avatar?url=${encodeURIComponent(item.url)}`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) setChannelAvatar(data.avatar ?? null);
            })
            .catch(() => { });
        return () => {
            cancelled = true;
        };
    }, [item.url, item.thumbnail, videoThumb]);

    if (videoThumb) return { type: "video" as const, src: videoThumb };
    if (channelAvatar) return { type: "channel" as const, src: channelAvatar };
    return null;
}

function Entry({ item }: { item: YoutubeItem }) {
    const preview = usePreview(item);

    return (
        <li>
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 py-4 group"
            >
                <span
                    className={`shrink-0 bg-white/5 flex items-center justify-center overflow-hidden ${preview?.type === "channel" ? "w-16 h-16 rounded-full" : "w-28 md:w-32 aspect-video rounded-md"
                        }`}
                >
                    {preview ? (
                        <img src={preview.src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                        <YoutubeIcon />
                    )}
                </span>

                <span className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 min-w-0">
                    <span className="shrink-0 md:w-48 group-hover:opacity-60 transition-opacity" style={{ color: FG }}>
                        {item.title}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: `${FG}99` }}>
                        {item.description}
                    </span>
                </span>
            </a>
        </li>
    );
}

function FeaturedEntry({ item, sectionTitle }: { item: YoutubeItem; sectionTitle: string }) {
    const preview = usePreview(item);

    return (
        <section>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: `${FG}66` }}>
                Suggestion du moment
            </p>

            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col sm:flex-row gap-5 group">
                <span className="shrink-0 w-full sm:w-64 aspect-video rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                    {preview ? (
                        <img src={preview.src} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <YoutubeIcon size={28} />
                    )}
                </span>

                <span className="flex flex-col justify-center min-w-0">
                    <span className="text-xs mb-1" style={{ color: `${FG}66`, fontFamily: "var(--font-playfair)" }}>
                        {sectionTitle}
                    </span>
                    <span
                        className="text-xl mb-2 group-hover:opacity-60 transition-opacity"
                        style={{ color: FG, fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                    >
                        {item.title}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: `${FG}99` }}>
                        {item.description}
                    </span>
                </span>
            </a>

            <div className="border-b mt-10" style={{ borderColor: `${FG}1A` }} />
        </section>
    );
}

export default function RecommendationsYoutube() {
    // Choisie après montage (pas dans l'état initial) pour éviter tout
    // écart entre le rendu serveur et le rendu client lors de l'hydratation.
    const [featured, setFeatured] = useState<{ item: YoutubeItem; sectionTitle: string } | null>(null);

    useEffect(() => {
        const all = YOUTUBE_SECTIONS.flatMap((s) => s.items.map((item) => ({ item, sectionTitle: s.title })));
        if (all.length > 0) setFeatured(all[Math.floor(Math.random() * all.length)]);
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">
            {featured && <FeaturedEntry item={featured.item} sectionTitle={featured.sectionTitle} />}

            {YOUTUBE_SECTIONS.map((section) => (
                <section key={section.title}>
                    <h2
                        className="text-2xl md:text-3xl mb-5"
                        style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: FG }}
                    >
                        {section.title}
                    </h2>
                    <ul className="divide-y" style={{ borderColor: `${FG}1A` }}>
                        {section.items.map((item) => (
                            <Entry key={item.url} item={item} />
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}