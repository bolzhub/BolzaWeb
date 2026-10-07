import Link from "next/link";
import RecommendationsYoutube from "@/components/Recommendations/RecommendationsYoutube";
export const dynamic = "force-dynamic";

const BG = "#1E2420";
const FG = "#ECE5D8";

export default function RecommendationsPage() {
    return (
        <main className="min-h-screen" style={{ backgroundColor: BG }}>
            <header className="flex items-center justify-between px-6 md:px-10 py-6">
                <Link href="/" className="shrink-0">
                    <picture>
                        <source media="(max-width: 480px)" srcSet="/logo/logo-icon.svg" />
                        <source media="(max-width: 768px)" srcSet="/logo/logo-medium.svg" />
                        <img src="/logo/logo-full.svg" alt="Bolzano" className="h-8 md:h-10 invert" />
                    </picture>
                </Link>
                <h1
                    className="text-xl md:text-2xl"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: FG }}
                >
                    Recommendations
                </h1>
            </header>

            <nav
                className="flex justify-center gap-8 pb-10 text-sm tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
            >
                <span className="underline underline-offset-4" style={{ color: FG }}>
                    YouTube
                </span>
                <span style={{ color: `${FG}4D`, cursor: "not-allowed" }}>Films (bientôt)</span>
            </nav>

            <RecommendationsYoutube />
        </main>
    );
}