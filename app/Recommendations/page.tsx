import RecommendationsYoutube from "@/components/Recommendations/RecommendationsYoutube";
import { BG, BLUE, FG, SWITCH_THEME } from "@/lib/Recommendations/theme";
import HomeBunny from "@/components/site/HomeBunny";
import LanguageSwitch from "@/components/i18n/LanguageSwitch";
import { getLang } from "@/lib/i18n/server";

export default async function RecommendationsPage() {
    const fr = (await getLang()) === "fr";
    return (
        <main className="min-h-screen" style={{ backgroundColor: BG }}>
            <header
                data-nav-row="recommendations"
                className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 md:px-10 py-5"
            >
                <HomeBunny body={BLUE} tail={BG} className="justify-self-start" />
                <h1
                    data-nav-center
                    className="trim-cap text-xl md:text-2xl"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: FG }}
                >
                    {fr ? "Recommandations" : "Recommendations"}
                </h1>
                <LanguageSwitch theme={SWITCH_THEME} className="justify-self-end" />
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
