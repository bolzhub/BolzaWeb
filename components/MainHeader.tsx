"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";

const LOGO_HEIGHT = 40;
const NAV_FONT_SIZE = "0.875rem";
const NAV_VERTICAL_OFFSET = "10px";
const SIDE_GAP = 24;
const BURGER_WIDTH = 44;

type LogoSize = "full" | "medium" | "small";

const LOGO_SRC: Record<LogoSize, string> = {
    full: "/logo/logo-full.svg",
    medium: "/logo/logo-medium.svg",
    small: "/logo/logo-icon.svg",
};

const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Updates", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
];

const HELP_ITEM = { label: "Help", href: "#" };

export default function MainHeader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const navProbeRef = useRef<HTMLDivElement>(null);
    const helpProbeRef = useRef<HTMLAnchorElement>(null);

    const [logoWidths, setLogoWidths] = useState<Record<LogoSize, number> | null>(null);
    const [navWidth, setNavWidth] = useState<number | null>(null);
    const [helpWidth, setHelpWidth] = useState<number | null>(null);
    const [logoSize, setLogoSize] = useState<LogoSize>("full");
    const [burgerMode, setBurgerMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const widths: Partial<Record<LogoSize, number>> = {};
        const sizes: LogoSize[] = ["full", "medium", "small"];

        Promise.all(
            sizes.map(
                (size) =>
                    new Promise<void>((resolve) => {
                        const img = new window.Image();
                        img.onload = () => {
                            widths[size] = (img.naturalWidth / img.naturalHeight) * LOGO_HEIGHT;
                            resolve();
                        };
                        img.onerror = () => resolve();
                        img.src = LOGO_SRC[size];
                    })
            )
        ).then(() => {
            if (!cancelled) setLogoWidths(widths as Record<LogoSize, number>);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (navProbeRef.current) setNavWidth(navProbeRef.current.scrollWidth);
        if (helpProbeRef.current) setHelpWidth(helpProbeRef.current.scrollWidth);
    }, []);

    const recompute = useCallback(() => {
        if (!containerRef.current || !logoWidths || navWidth === null || helpWidth === null) return;

        const computed = window.getComputedStyle(containerRef.current);
        const paddingLeft = parseFloat(computed.paddingLeft) || 0;
        const paddingRight = parseFloat(computed.paddingRight) || 0;
        const contentWidth = containerRef.current.clientWidth - paddingLeft - paddingRight;

        const fitsInline = (logoW: number) => {
            const sideNeeded = Math.max(logoW, helpWidth) + SIDE_GAP;
            return sideNeeded * 2 + navWidth <= contentWidth;
        };

        if (fitsInline(logoWidths.full)) {
            setLogoSize("full");
            setBurgerMode(false);
            return;
        }
        if (fitsInline(logoWidths.medium)) {
            setLogoSize("medium");
            setBurgerMode(false);
            return;
        }
        if (fitsInline(logoWidths.small)) {
            setLogoSize("small");
            setBurgerMode(false);
            return;
        }

        setBurgerMode(true);
        const fitsBurger = (logoW: number) => logoW + BURGER_WIDTH + SIDE_GAP * 2 <= contentWidth;
        if (fitsBurger(logoWidths.full)) setLogoSize("full");
        else if (fitsBurger(logoWidths.medium)) setLogoSize("medium");
        else setLogoSize("small");
    }, [logoWidths, navWidth, helpWidth]);

    useEffect(() => {
        recompute();
        const observer = new ResizeObserver(() => recompute());
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [recompute]);

    return (
        <header ref={containerRef} className="relative flex items-baseline justify-between px-6 md:px-10 py-5">
            <Logo size={logoSize} height={LOGO_HEIGHT} />

            {!burgerMode && (
                <>
                    <nav
                        className="absolute left-1/2 flex items-baseline gap-6 text-[#3a352c]/80"
                        style={{
                            fontSize: NAV_FONT_SIZE,
                            transform: `translateX(-50%) translateY(${NAV_VERTICAL_OFFSET})`,
                        }}
                    >
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.label} href={item.href} className="hover:text-[#3a352c] transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        href={HELP_ITEM.href}
                        className="rounded-full px-4 py-1.5 text-white bg-[#7a2e2e] hover:bg-[#8f3636] transition-colors"
                        style={{ fontSize: NAV_FONT_SIZE, transform: `translateY(${NAV_VERTICAL_OFFSET})` }}
                    >
                        {HELP_ITEM.label}
                    </Link>
                </>
            )}

            {burgerMode && (
                <div className="relative">
                    <button onClick={() => setMenuOpen((o) => !o)} aria-label="Menu" className="flex flex-col justify-center gap-1.5 w-11 h-11">
                        <span className="block h-0.5 w-6 bg-[#3a352c]" />
                        <span className="block h-0.5 w-6 bg-[#3a352c]" />
                        <span className="block h-0.5 w-6 bg-[#3a352c]" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 flex flex-col gap-1 bg-[#ECE5D8] border border-[#3a352c]/10 rounded-xl shadow-lg py-2 min-w-[160px] z-50">
                            {[...NAV_ITEMS, HELP_ITEM].map((item) => (
                                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="px-4 py-2 text-[#3a352c]/80 hover:text-[#3a352c] hover:bg-[#3a352c]/5 transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div ref={navProbeRef} aria-hidden="true" className="absolute -z-10 opacity-0 pointer-events-none flex items-baseline gap-6 whitespace-nowrap" style={{ fontSize: NAV_FONT_SIZE, top: -9999, left: -9999 }}>
                {NAV_ITEMS.map((item) => (
                    <span key={item.label}>{item.label}</span>
                ))}
            </div>
            <a ref={helpProbeRef} aria-hidden="true" className="absolute -z-10 opacity-0 pointer-events-none rounded-full px-4 py-1.5 whitespace-nowrap" style={{ fontSize: NAV_FONT_SIZE, top: -9999, left: -9999 }}>
                {HELP_ITEM.label}
            </a>
        </header>
    );
}