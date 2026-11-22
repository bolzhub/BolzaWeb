"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Logo, { LOGO_SOURCES, type LogoSize } from "./Logo";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { useLang } from "@/lib/i18n/LanguageContext";

const LOGO_HEIGHT = 40;
const NAV_FONT_SIZE = "0.875rem";
const SIDE_GAP = 24;
const BURGER_WIDTH = 44;
const SWITCH_WIDTH = 84; // largeur du sélecteur de langue + son espacement

const NAV_ITEMS = {
    en: [
        { label: "Home", href: "/" },
        { label: "Updates", href: "#" },
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
    ],
    fr: [
        { label: "Accueil", href: "/" },
        { label: "Actualités", href: "#" },
        { label: "À propos", href: "#" },
        { label: "Contact", href: "#" },
    ],
};

const HELP_ITEM = { en: { label: "Help", href: "#" }, fr: { label: "Aide", href: "#" } };

export default function MainHeader() {
    const lang = useLang();
    const NAV = NAV_ITEMS[lang];
    const HELP = HELP_ITEM[lang];
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
                        img.src = LOGO_SOURCES[size];
                    }),
            ),
        ).then(() => {
            if (!cancelled) setLogoWidths(widths as Record<LogoSize, number>);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (navProbeRef.current) setNavWidth(navProbeRef.current.scrollWidth);
        if (helpProbeRef.current) setHelpWidth(helpProbeRef.current.scrollWidth + SWITCH_WIDTH);
    }, [lang]);

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
        const fitsBurger = (logoW: number) => logoW + BURGER_WIDTH + SWITCH_WIDTH + SIDE_GAP * 2 <= contentWidth;
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
        <header
            ref={containerRef}
            data-nav-row="accueil"
            className="flex items-center gap-6 px-6 md:px-10 py-2 md:py-5"
        >
            <Logo size={logoSize} height={LOGO_HEIGHT} className="[&_img]:h-8! md:[&_img]:h-10!" />

            {!burgerMode && (
                <>
                    <div className="flex-1" aria-hidden="true" />
                    <div style={{ display: "contents" }}>
                        {NAV.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="trim-cap whitespace-nowrap text-ink/80 hover:text-ink transition-colors"
                                style={{ fontSize: NAV_FONT_SIZE }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex-1" aria-hidden="true" />
                    <Link
                        href={HELP.href}
                        className="shrink-0 rounded-full bg-aqua px-4 py-1.5 font-semibold text-gold hover:brightness-110 transition-[filter]"
                        style={{ fontSize: NAV_FONT_SIZE }}
                    >
                        {HELP.label}
                    </Link>
                    <LanguageSwitch />
                </>
            )}

            {burgerMode && (
                <>
                    <div className="flex-1" aria-hidden="true" />
                    <LanguageSwitch className="self-center" />
                    <div className="relative self-center">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label="Menu"
                            className="flex flex-col justify-center gap-1.5 w-11 h-11 appearance-none bg-transparent border-0 p-0"
                        >
                            <span className="block h-0.5 w-6 bg-ink" />
                            <span className="block h-0.5 w-6 bg-ink" />
                            <span className="block h-0.5 w-6 bg-ink" />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 flex flex-col gap-1 bg-cream border border-ink/10 rounded-xl shadow-lg py-2 min-w-[160px] z-50">
                                {[...NAV, HELP].map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="px-4 py-2 text-ink/80 hover:text-ink hover:bg-ink/5 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div
                ref={navProbeRef}
                aria-hidden="true"
                className="absolute -z-10 opacity-0 pointer-events-none flex items-baseline gap-6 whitespace-nowrap"
                style={{ fontSize: NAV_FONT_SIZE, top: -9999, left: -9999 }}
            >
                {NAV.map((item) => (
                    <span key={item.label}>{item.label}</span>
                ))}
            </div>

            <a
                ref={helpProbeRef}
                aria-hidden="true"
                className="absolute -z-10 opacity-0 pointer-events-none rounded-full px-4 py-1.5 font-semibold whitespace-nowrap"
                style={{ fontSize: NAV_FONT_SIZE, top: -9999, left: -9999 }}
            >
                {HELP.label}
            </a>
        </header>
    );
}
