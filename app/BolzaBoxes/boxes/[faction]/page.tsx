import { notFound } from "next/navigation";
import { getFactionBySlug } from "@/lib/BolzaBoxes/factions";
import { getContrastTextColor } from "@/lib/BolzaBoxes/colors";
import BolzaBoxesNav from "@/components/BolzaBoxes/BolzaBoxesNav";
import FactionSidebar from "@/components/BolzaBoxes/FactionSidebar";
import FactionInfo from "@/components/BolzaBoxes/FactionInfo";
import MobileTopBar from "@/components/BolzaBoxes/MobileTopBar";
import ObjectViewer from "@/components/BolzaBoxes/ObjectViewer";
import VersionSwitch from "@/components/BolzaBoxes/VersionSwitch";

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
    <main
      className="min-h-screen min-h-dvh overflow-x-hidden"
      style={{ backgroundColor: faction.color }}
    >
      <BolzaBoxesNav fadeOverlayColor={faction.color} />

      <div style={{ paddingTop: "var(--bolzaboxes-nav-height, 80px)" }} className="pb-24 min-w-0">
        <MobileTopBar title={faction.name} icon={faction.icon} textColor={textColor} />

        <div className="flex min-w-0">
          <FactionSidebar active={faction} />

          <div className="flex-1 min-w-0 flex flex-col lg:flex-row gap-6 p-4 md:p-8">
            <div className="lg:flex-[2] min-w-0 h-[55vh] lg:h-[65vh]">
              <ObjectViewer faction={faction} textColor={textColor} />
            </div>

            <div className="lg:flex-1 min-w-0 lg:pt-4">
              <FactionInfo faction={faction} textColor={textColor} />
            </div>
          </div>
        </div>
      </div>

      <VersionSwitch />
    </main>
  );
}