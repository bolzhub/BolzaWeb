import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";
import AlternatingSections from "@/components/BolzaBoxes/AlternatingSections";
import HeroLinks from "@/components/BolzaBoxes/HeroLinks";
import { HERO_IMAGES } from "@/lib/BolzaBoxes/heroImages";

export default function BolzaBoxesPage() {
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES.home} hero={<HeroLinks />}>
            <AlternatingSections />
        </BolzaBoxesShell>
    );
}
