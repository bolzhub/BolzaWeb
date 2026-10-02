"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/BolzaBoxes" },
  { label: "Configurations", href: "/BolzaBoxes/configurations" },
  { label: "Boxes", href: "/BolzaBoxes/boxes" },
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
  small,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`whitespace-nowrap tracking-wide text-[#3a352c] hover:opacity-60 transition-opacity ${
        small ? "text-xs sm:text-sm" : "text-sm md:text-base"
      } ${active ? "underline underline-offset-4" : ""}`}
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {label}
    </Link>
  );
}

function BackgroundLayer({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none"
    />
  );
}

export default function BolzaBoxesNav({
  backgroundImageSrc,
  transparent = false,
  fadeOverlayColor,
  onBurgerOpenChange,
}: {
  backgroundImageSrc?: string;
  transparent?: boolean;
  fadeOverlayColor?: string;
  onBurgerOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  const isActive = (href: string) =>
    href === "/BolzaBoxes/boxes"
      ? pathname === href || pathname.startsWith(href + "/")
      : pathname === href;

  useEffect(() => {
    onBurgerOpenChange?.(open);
  }, [open, onBurgerOpenChange]);

  useEffect(() => {
    if (!fadeOverlayColor) return;
    const THRESHOLD = 60;
    const update = () => {
      const ratio = Math.min(window.scrollY / THRESHOLD, 1);
      setScrollOpacity(ratio);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [fadeOverlayColor]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty(
        "--bolzaboxes-nav-height",
        `${el.offsetHeight}px`
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <div className="relative" style={{ clipPath: "inset(0)" }}>
        {fadeOverlayColor ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: fadeOverlayColor,
              opacity: scrollOpacity,
              transition: "opacity 0.15s ease-out",
            }}
          />
        ) : (
          !transparent && backgroundImageSrc && <BackgroundLayer src={backgroundImageSrc} />
        )}

        <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 md:px-8 py-3">
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <img src="/logo/logo-icon.svg" alt="Bolzano Crafts" className="h-10 md:h-12" />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center flex-1 min-w-0">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href)}
                small
              />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {SIDE_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={isActive(link.href)} />
            ))}
          </div>

          <button
            className="lg:hidden shrink-0 text-[#3a352c]"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
          <nav className="relative lg:hidden flex flex-col items-center gap-4 pb-5">
            {SIDE_LINKS.map((link) => (
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
      </div>

      {!transparent && !fadeOverlayColor && backgroundImageSrc && (
        <div
          className="absolute left-0 right-0 top-full h-24 pointer-events-none"
          style={{
            clipPath: "inset(0)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        >
          <BackgroundLayer src={backgroundImageSrc} />
        </div>
      )}
    </header>
  );
}