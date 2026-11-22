"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageContext";

// Double bouton au milieu de la photo d'accueil, vers les deux façons de parcourir les boîtes
export default function HeroLinks() {
    const fr = useLang() === "fr";
    const links = [
        { href: "/BolzaBoxes/configurations", label: "Configurations" },
        { href: "/BolzaBoxes/boxes", label: fr ? "Boîtes" : "Boxes" },
    ];

    return (
        <div
            className="flex items-stretch overflow-hidden rounded-full border-2 border-gold bg-cream/95 shadow-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
        >
            {links.map((link, i) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-6 py-3 text-base tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream md:px-9 md:py-4 md:text-xl ${
                        i > 0 ? "border-l border-ink/20" : ""
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
}
