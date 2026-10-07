import { YOUTUBE_SECTIONS } from "@/lib/Recommendations/youtube";
import { getItemPreview } from "@/lib/Recommendations/youtubeThumbnail";

const FG = "#ECE5D8";

export default async function RecommendationsYoutube() {
    const sections = await Promise.all(
        YOUTUBE_SECTIONS.map(async (section) => ({
            ...section,
            items: await Promise.all(
                section.items.map(async (item) => ({
                    ...item,
                    preview: await getItemPreview(item.url, item.thumbnail),
                }))
            ),
        }))
    );

    return (
        <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">
            {sections.map((section) => (
                <section key={section.title}>
                    <h2
                        className="text-2xl md:text-3xl mb-5"
                        style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: FG }}
                    >
                        {section.title}
                    </h2>

                    <ul className="divide-y" style={{ borderColor: `${FG}1A` }}>
                        {section.items.map((item) => (
                            <li key={item.url}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 py-4 group"
                                >
                                    <span
                                        className={`shrink-0 bg-white/5 flex items-center justify-center overflow-hidden ${item.preview?.type === "channel"
                                                ? "w-16 h-16 rounded-full"
                                                : "w-28 md:w-32 aspect-video rounded-md"
                                            }`}
                                    >
                                        {item.preview ? (
                                            <img
                                                src={item.preview.src}
                                                alt=""
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                style={{ color: `${FG}4D` }}
                                            >
                                                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
                                            </svg>
                                        )}
                                    </span>

                                    <span className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 min-w-0">
                                        <span
                                            className="shrink-0 md:w-48 group-hover:opacity-60 transition-opacity"
                                            style={{ color: FG }}
                                        >
                                            {item.title}
                                        </span>
                                        <span className="text-sm leading-relaxed" style={{ color: `${FG}99` }}>
                                            {item.description}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}