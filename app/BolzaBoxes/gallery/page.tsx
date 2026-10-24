import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";
import { HERO_IMAGES } from "@/lib/BolzaBoxes/heroImages";

export default function GalleryPage() {
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES.gallery}>
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <h1
                    className="text-5xl md:text-7xl text-ink"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    Gallery
                </h1>
            </div>
        </BolzaBoxesShell>
    );
}