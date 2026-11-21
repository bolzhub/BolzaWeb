import Link from "next/link";
import RecommendationsYoutube from "@/components/Recommendations/RecommendationsYoutube";
import { BG, FG } from "@/lib/Recommendations/theme";
import { ResponsiveLogo } from "@/components/site/Logo";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { getLang } from "@/lib/i18n/server";

export default async function RecommendationsPage() {
    const fr = (await getLang()) === "fr";
    return (
        <main className="min-h-screen" style={{ backgroundColor: BG }}>
            <header className="flex items-center justify-between gap-4 px-6 md:px-10 py-6">
                <Link href="/" className="shrink-0">
                    <ResponsiveLogo className="h-8 md:h-10 invert" />
                </Link>
                <h1
                    className="text-xl md:text-2xl"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: FG }}
                >
                    {fr ? "Recommandations" : "Recommendations"}
                </h1>
                <LanguageSwitch />
            </header>

            <nav
                className="flex justify-center gap-8 pb-10 text-sm tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
            >
                <span className="underline underline-offset-4" style={{ color: FG }}>
                    YouTube
                </span>
                <span style={{ color: `${FG}4D`, cursor: "not-allowed" }}>
                    {fr ? "Films (bientôt)" : "Movies (coming soon)"}
                </span>
            </nav>

            <RecommendationsYoutube />
        </main>
    );
}
