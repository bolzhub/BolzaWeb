"use client";

import { useEffect, useState } from "react";

export default function ScrollHint() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY < 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            aria-label="Voir la suite"
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
            className={`absolute left-1/2 -translate-x-1/2 z-10 text-[#ECE5D8] transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ bottom: "calc(6.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
            <svg
                className="animate-bounce drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    );
}