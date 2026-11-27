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

    // Le visualiseur porte toute la rangée (cadre + description) : la taille du cadre dépend de la place
    // laissée à la description (ordinateur) et de celle qui reste au-dessus du sélecteur de version
    return (
        <ObjectViewer
            key={faction.slug}
            faction={faction}
            textColor={textColor}
            info={<FactionInfo faction={faction} textColor={textColor} />}
        />
    );
}
