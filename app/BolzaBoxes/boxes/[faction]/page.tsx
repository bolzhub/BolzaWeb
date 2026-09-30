import { notFound } from "next/navigation";
import { getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { getContrastTextColor } from "@/lib/BolzaBoxes/colors";
import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import FactionSidebar from "@/components/BolzaBoxes/FactionSidebar";
import FactionInfo from "@/components/BolzaBoxes/FactionInfo";
import MobileTopBar from "@/components/BolzaBoxes/MobileTopBar";
import ObjectViewer from "@/components/BolzaBoxes/ObjectViewer";

export default async function FactionPage({
    params,
}: {
    params: Promise<{ faction: string }>;
}) {
    const { faction: slug } = await params;
    const faction = getFactionBySlug(slug);

    if (!faction) notFound();

    const textColor = getContrastTextColor(faction.color);

    return (
        <main className="min-h-screen min-h-dvh" style={{ backgroundColor: faction.color }}>
            <BolzaBoxesNav backgroundImageSrc="/projects/BolzaBoxes/nav-bg.jpg" />

            <div style={{ paddingTop: "var(--bolzaboxes-nav-height, 80px)" }}>
                <MobileTopBar title={faction.name} textColor={textColor} />

                <div className="flex">
                    <FactionSidebar active={faction} />

                    <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-8">
                        <div className="lg:flex-[2] h-[60vh] lg:h-[70vh]">
                            <ObjectViewer faction={faction} textColor={textColor} />
                        </div>

                        <div className="lg:flex-1 lg:pt-4">
                            <FactionInfo name={faction.name} description={faction.description} textColor={textColor} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}