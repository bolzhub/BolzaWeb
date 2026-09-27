"use client";

import { useVersion } from "@/lib/BolzaBoxes/VersionContext";

export default function VersionSwitch() {
    const { version, setVersion } = useVersion();

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-[#ECE5D8]/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
            <span
                className="text-sm text-[#3a352c]"
                style={{ fontFamily: "var(--font-playfair)" }}
            >
                Version:
            </span>

            <button
                onClick={() => setVersion("international")}
                aria-label="Version internationale"
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    version === "international"
                        ? "bg-[#3a352c] scale-105"
                        : "bg-transparent opacity-40 hover:opacity-70"
                }`}
            >
                {/* Icône globe */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={version === "international" ? "#ECE5D8" : "#3a352c"}
                    strokeWidth="1.6"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9z" />
                </svg>
            </button>

            <span className="text-[#3a352c] opacity-40">/</span>

            <button
                onClick={() => setVersion("french")}
                aria-label="Version française"
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    version === "french"
                        ? "bg-[#3a352c] scale-105"
                        : "bg-transparent opacity-40 hover:opacity-70"
                }`}
            >
                {/* Drapeau français */}
                <span className="text-lg leading-none">🇫🇷</span>
            </button>
        </div>
    );
}