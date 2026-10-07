import { YOUTUBE_SECTIONS } from "@/lib/Recommendations/youtube";

export default function RecommendationsYoutube() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">
            {YOUTUBE_SECTIONS.map((section) => (
                <section key={section.title}>
                    <h2
                        className="text-2xl md:text-3xl text-[#3a352c] mb-5"
                        style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                    >
                        {section.title}
                    </h2>

                    <ul className="divide-y divide-[#3a352c]/10">
                        {section.items.map((item) => (
                            <li key={item.url}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8 py-4 group"
                                >
                                    <span className="flex items-center gap-2 shrink-0 md:w-64">
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-[#3a352c]/40 shrink-0"
                                        >
                                            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
                                        </svg>
                                        <span className="text-[#3a352c] group-hover:opacity-60 transition-opacity">
                                            {item.title}
                                        </span>
                                    </span>
                                    <span className="text-sm text-[#3a352c]/60 leading-relaxed">
                                        {item.description}
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