import type { Metadata } from "next";
import RedFlagsGame from "@/components/RedFlags/RedFlagsGame";

export const metadata: Metadata = {
    title: "Jeu des Red Flags",
    description: "Jusqu'où iras-tu avant de mettre fin au date ?",
};

export default function RedFlagsPage() {
    return <RedFlagsGame />;
}
