import type { Metadata } from "next";
import HumanAway from "@/components/HumanAway/HumanAway";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
    const fr = (await getLang()) === "fr";
    return {
        title: "Human Away",
        description: fr
            ? "Jeu vidéo en développement : une nouvelle planète à chaque visite."
            : "Video game in development: a new planet on every visit.",
    };
}

export default function Page() {
    return <HumanAway />;
}
