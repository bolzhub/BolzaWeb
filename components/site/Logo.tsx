import Link from "next/link";

export type LogoSize = "full" | "medium" | "small";

export const LOGO_SOURCES: Record<LogoSize, string> = {
    full: "/logo/logo-full.svg",
    medium: "/logo/logo-medium.svg",
    small: "/logo/logo-icon.svg",
};

const ALTS: Record<LogoSize, string> = {
    full: "Bolzano Crafts",
    medium: "Boz",
    small: "Bolzano",
};

export default function Logo({
    size,
    height = 40,
    className = "",
}: {
    size: LogoSize;
    height?: number;
    className?: string;
}) {
    return (
        <Link href="/" className={`inline-block shrink-0 ${className}`}>
            <img src={LOGO_SOURCES[size]} alt={ALTS[size]} style={{ height }} />
        </Link>
    );
}

// Logo qui change de version selon la largeur d'écran :
// complet au-delà de 768 px, moyen au-delà de 480 px, icône en dessous
export function ResponsiveLogo({ className = "h-8 md:h-10", alt = "Bolzano" }: { className?: string; alt?: string }) {
    return (
        <picture>
            <source media="(max-width: 480px)" srcSet={LOGO_SOURCES.small} />
            <source media="(max-width: 768px)" srcSet={LOGO_SOURCES.medium} />
            <img src={LOGO_SOURCES.full} alt={alt} className={className} />
        </picture>
    );
}
