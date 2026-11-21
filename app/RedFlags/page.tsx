import type { Metadata } from "next";
import RedFlagsGame from "@/components/RedFlags/RedFlagsGame";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
    return (await getLang()) === "fr"
        ? { title: "Jeu des Red Flags", description: "Jusqu'où iras-tu avant de mettre fin au date ?" }
        : { title: "Red Flags Game", description: "How far will you go before ending the date?" };
}

export default function RedFlagsPage() {
    return <RedFlagsGame />;
}
