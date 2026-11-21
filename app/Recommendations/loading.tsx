import { BG, FG } from "@/lib/Recommendations/theme";
import { getLang } from "@/lib/i18n/server";

export default async function Loading() {
    const fr = (await getLang()) === "fr";
    return (
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
            <p
                className="text-sm tracking-widest uppercase animate-pulse"
                style={{ color: `${FG}99`, fontFamily: "var(--font-playfair)" }}
            >
                {fr ? "Chargement…" : "Loading..."}
            </p>
        </main>
    );
}
