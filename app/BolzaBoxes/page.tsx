import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";
import AlternatingSections from "@/components/BolzaBoxes/AlternatingSections";

const HERO_IMAGES = {
    international: "/api/media/Projets/Root_Organiser/Extra/Presentation/Newsletter/signal-2026-05-10-161743_005.jpeg",
    french: "/api/media/Projets/Root_Organiser/Extra/Presentation/Website/Home/main.png",
};

export default function BolzaBoxesPage() {
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES}>
            <AlternatingSections />
        </BolzaBoxesShell>
    );
}