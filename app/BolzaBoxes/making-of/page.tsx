import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";
import { HERO_IMAGES } from "@/lib/BolzaBoxes/heroImages";

export default function MakingOfPage() {
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES.makingOf}>
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <h1
                    className="text-5xl md:text-7xl text-ink"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    Making of
                </h1>
            </div>
        </BolzaBoxesShell>
    );
}
