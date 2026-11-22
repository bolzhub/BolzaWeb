import { notFound, redirect } from "next/navigation";
import { SLUG_ALIASES, factionPath, getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { readableTextOn } from "@/lib/colors";
import FactionInfo from "@/components/BolzaBoxes/FactionInfo";
import ObjectViewer from "@/components/BolzaBoxes/ObjectViewer";

// Contenu propre à une faction ; la barre de navigation, la barre d'icônes et le sélecteur
// de version sont dans le layout (BoxesFrame) pour ne pas être recréés à chaque changement de faction
export default async function FactionPage({ params }: { params: Promise<{ faction: string }> }) {
    const { faction: slug } = await params;
    if (SLUG_ALIASES[slug]) redirect(factionPath(SLUG_ALIASES[slug]));
    const faction = getFactionBySlug(slug);

    if (!faction) notFound();

    const textColor = readableTextOn(faction.color);

    return (
        <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-6 p-4 md:p-8">
            {/* Portable : pas de hauteur imposée, le cadre fixe la sienne et la description suit en dessous */}
            <div className="lg:flex-[2] min-w-0 lg:h-[65vh]">
                <ObjectViewer key={faction.slug} faction={faction} textColor={textColor} />
            </div>

            <div className="lg:flex-1 min-w-0 lg:pt-4">
                <FactionInfo faction={faction} textColor={textColor} />
            </div>
        </div>
    );
}
