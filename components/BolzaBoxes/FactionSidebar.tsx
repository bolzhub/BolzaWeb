import Link from "next/link";
import { FACTIONS } from "@/lib/BolzaBoxes/factions";
import type { Faction } from "@/lib/BolzaBoxes/types";

const SWITCH_RESERVED_SPACE = "6rem"; // 🎛️ doit correspondre au pb-24 réservé dans page.tsx

export default function FactionSidebar({ active }: { active: Faction }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 lg:gap-2.5 py-3 lg:py-5 px-1.5 lg:px-2 w-10 lg:w-14 shrink-0 relative rounded-tr-3xl rounded-br-3xl overscroll-contain"
      style={{
        backgroundColor: "#DCD9D2",
        maxHeight: `calc(100dvh - var(--bolzaboxes-nav-height, 80px) - ${SWITCH_RESERVED_SPACE} - env(safe-area-inset-bottom, 0px))`,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {FACTIONS.map((f) => {
        const isActive = f.slug === active.slug;
        return (
          <Link
            key={f.slug}
            href={`/BolzaBoxes/boxes/${f.slug}`}
            className="relative flex items-center justify-center w-7 h-7 lg:w-9 lg:h-9 shrink-0"
          >
            {isActive && (
              <div
                aria-hidden="true"
                className="absolute inset-y-0"
                style={{
                  left: -4,
                  right: -16,
                  backgroundColor: f.color,
                  borderRadius: "9999px 0 0 9999px",
                }}
              />
            )}
            <img
              src={f.icon}
              alt={f.name}
              className={`relative z-10 w-5 h-5 lg:w-6 lg:h-6 transition-opacity ${isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
            />
          </Link>
        );
      })}
    </div>
  );
}