import Link from "next/link";

export default function MobileTopBar({
    title,
    icon,
    textColor,
}: {
    title: string;
    icon: string;
    textColor: string;
}) {
    return (
        <div className="lg:hidden flex items-center gap-4 px-4 py-3" style={{ color: textColor }}>
            <Link href="/BolzaBoxes/configurations" aria-label="Retour à toutes les factions">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                </svg>
            </Link>
            <img src={icon} alt="" className="h-6 w-6 shrink-0" />
            <h1
                className="text-xl tracking-wide"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
            >
                {title}
            </h1>
        </div>
    );
}