import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";
import { HERO_IMAGES } from "@/lib/BolzaBoxes/heroImages";
import { getLang } from "@/lib/i18n/server";

export default async function MakingOfPage() {
    const lang = await getLang();
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES.makingOf}>
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <h1
                    className="text-5xl md:text-7xl text-ink"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    {lang === "fr" ? "Coulisses" : "Making of"}
                </h1>
            </div>
        </BolzaBoxesShell>
    );
}
