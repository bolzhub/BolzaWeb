import type { Faction } from "@/lib/BolzaBoxes/types";

export default function FactionInfo({
    faction,
    textColor,
}: {
    faction: Faction;
    textColor: string;
}) {
    return (
        <div className="flex flex-col gap-3" style={{ color: textColor }}>
            <div className="hidden lg:flex items-center gap-3">
                <img src={faction.icon} alt="" className="h-8 w-8 shrink-0" />
                <h1
                    className="text-3xl md:text-4xl tracking-wide"
                    style={{ fontFamily: "var(--font-cinzel-decorative)", fontWeight: 700 }}
                >
                    {faction.name}
                </h1>
                <p className="opacity-80 leading-relaxed" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {faction.description}
                </p>
            </div>
            <p className="opacity-80 leading-relaxed">{faction.description}</p>
        </div>
    );
}