import Link from "next/link";
import { FACTIONS } from "@/lib/BolzaBoxes/factions";
import type { Faction } from "@/lib/BolzaBoxes/types";

export default function FactionSidebar({ active }: { active: Faction }) {
    return (
        <div
            className="flex flex-col items-center gap-3 lg:gap-4 py-4 lg:py-6 px-2 lg:px-3 w-14 lg:w-20 shrink-0 relative rounded-tr-3xl rounded-br-3xl"
            style={{ backgroundColor: "#DCD9D2" }}
        >
            {FACTIONS.map((f) => {
                const isActive = f.slug === active.slug;
                return (
                    <Link
                        key={f.slug}
                        href={`/BolzaBoxes/boxes/${f.slug}`}
                        className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12"
                    >
                        {isActive && (
                            <div
                                aria-hidden="true"
                                className="absolute inset-y-0"
                                style={{
                                    left: -4,
                                    right: -28,
                                    backgroundColor: f.color,
                                    borderRadius: "9999px 0 0 9999px",
                                }}
                            />
                        )}
                        <img
                            src={f.icon}
                            alt={f.name}
                            className={`relative z-10 w-6 h-6 lg:w-8 lg:h-8 transition-opacity ${isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                                }`}
                        />
                    </Link>
                );
            })}
        </div>
    );
}