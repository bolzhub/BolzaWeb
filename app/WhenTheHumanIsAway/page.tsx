import type { Metadata } from "next";
import WhenTheHumanIsAway from "@/components/WhenTheHumanIsAway/WhenTheHumanIsAway";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
    const fr = (await getLang()) === "fr";
    return {
        title: "When the human is away",
        description: fr
            ? "Jeu vidéo en développement : une nouvelle planète à chaque visite."
            : "Video game in development: a new planet on every visit.",
    };
}

export default function Page() {
    return <WhenTheHumanIsAway />;
}
