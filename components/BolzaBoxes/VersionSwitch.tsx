"use client";

import { useVersion } from "@/lib/BolzaBoxes/VersionContext";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function VersionSwitch() {
    const { version, setVersion } = useVersion();
    const fr = useLang() === "fr";

    return (
        <div
            // Plus compact sur portable, où il ne doit pas prendre le pas sur le contenu
            className="fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-cream rounded-full px-3 py-1 shadow-lg bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] md:gap-3 md:px-5 md:py-2.5 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        >
            <span className="text-xs md:text-sm text-ink" style={{ fontFamily: "var(--font-playfair)" }}>
                {fr ? "Version\u00a0:" : "Version:"}
            </span>

            <button
                onClick={() => setVersion("international")}
                aria-label={fr ? "Version internationale" : "International version"}
                className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full transition-all ${
                    version === "international" ? "bg-ink scale-105" : "bg-transparent opacity-40 hover:opacity-70"
                }`}
            >
                <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ stroke: version === "international" ? "var(--color-cream)" : "var(--color-ink)" }}
                    strokeWidth="1.6"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9z" />
                </svg>
            </button>

            <span className="text-ink opacity-40">/</span>

            <button
                onClick={() => setVersion("french")}
                aria-label={fr ? "Version française" : "French version"}
                className={`flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full transition-all ${
                    version === "french" ? "bg-ink scale-105" : "bg-transparent opacity-40 hover:opacity-70"
                }`}
            >
                <span
                    className="text-sm md:text-base leading-none"
                    style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 700,
                        color: version === "french" ? "var(--color-cream)" : "var(--color-ink)",
                    }}
                >
                    Fr
                </span>
            </button>
        </div>
    );
}
