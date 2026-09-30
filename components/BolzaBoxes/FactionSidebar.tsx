import Link from "next/link";
import { FACTIONS } from "@/lib/BolzaBoxes/factions";
import type { Faction } from "@/lib/BolzaBoxes/types";

export default function FactionSidebar({ active }: { active: Faction }) {
    return (
        <div className="hidden lg:flex flex-col items-center gap-4 py-6 px-3 w-20 shrink-0 bg-[#ECE5D8]">
            {FACTIONS.map((f) => (
                <Link
                    key={f.slug}
                    href={`/BolzaBoxes/boxes/${f.slug}`}
                    className="block p-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: f.slug === active.slug ? f.color : "transparent" }}
                >
                    <img
                        src={f.icon}
                        alt={f.name}
                        className={`w-8 h-8 transition-opacity ${f.slug === active.slug ? "opacity-100" : "opacity-50 hover:opacity-80"
                            }`}
                    />
                </Link>
            ))}
        </div>
    );
}