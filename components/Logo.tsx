import Link from "next/link";

type LogoSize = "full" | "medium" | "small";

const SOURCES: Record<LogoSize, string> = {
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
        <Link href="/" className={`flex items-center shrink-0 ${className}`}>
            <img src={SOURCES[size]} alt={ALTS[size]} style={{ height }} />
        </Link>
    );
}