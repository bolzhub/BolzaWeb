"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
    { label: "Home", href: "/BolzaBoxes" },
    { label: "Configurations", href: "/BolzaBoxes/configurations" },
    { label: "Boxes", href: "/BolzaBoxes/boxes" },
    { label: "How to use", href: "/BolzaBoxes/how-to-use" },
    { label: "Making of", href: "/BolzaBoxes/making-of" },
    { label: "Gallery", href: "/BolzaBoxes/gallery" },
];

const SIDE_LINKS = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

function NavLink({
    href,
    label,
    active,
    onClick,
}: {
    href: string;
    label: string;
    active: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`text-sm md:text-base tracking-wide text-[#3a352c] hover:opacity-60 transition-opacity ${active ? "underline underline-offset-4" : ""
                }`}
            style={{ fontFamily: "var(--font-playfair)" }}
        >
            {label}
        </Link>
    );
}

export default function BolzaBoxesNav({
    backgroundImageSrc,
}: {
    backgroundImageSrc: string;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) => pathname === href;

    const bgStyle: React.CSSProperties = {
        backgroundImage: `url(${backgroundImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50" style={bgStyle}>
            <div className="relative flex items-center justify-between h-20 px-6 md:px-10 gap-4">
                <Link href="/" className="shrink-0">
                    <img src="/logo/bolzano-word.svg" alt="Bolzano" className="h-8 md:h-10" />
                </Link>

                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                            active={isActive(link.href)}
                        />
                    ))}
                </nav>

                <span
                    className="lg:hidden absolute left-1/2 -translate-x-1/2 text-lg md:text-xl text-[#3a352c] tracking-wide whitespace-nowrap"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    Root BolzaBoxes
                </span>

                <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
                    {SIDE_LINKS.map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                            active={isActive(link.href)}
                        />
                    ))}
                </div>

                <button
                    className="lg:hidden shrink-0 text-[#3a352c]"
                    aria-label="Menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        {open ? (
                            <>
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {open && (
                <nav className="lg:hidden flex flex-col items-center gap-5 pb-6">
                    {[...NAV_LINKS, ...SIDE_LINKS].map((link) => (
                        <NavLink
                            key={link.href}
                            href={link.href}
                            label={link.label}
                            active={isActive(link.href)}
                            onClick={() => setOpen(false)}
                        />
                    ))}
                </nav>
            )}

            {/* Bande de fondu : reprend le même fond, s'estompe vers le bas */}
            <div
                className="absolute left-0 right-0 top-full h-24 pointer-events-none"
                style={{
                    ...bgStyle,
                    WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                    maskImage: "linear-gradient(to bottom, black, transparent)",
                }}
            />
        </header>
    );
}