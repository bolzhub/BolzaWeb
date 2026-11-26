import BunnyBackground from "@/components/site/BunnyBackground";
import MainHeader from "@/components/site/MainHeader";
import ProjectShowcase from "@/components/site/ProjectShowcase";
import SocialLinks from "@/components/site/SocialLinks";
import { getProjects } from "@/lib/site/projects";
import { getLang } from "@/lib/i18n/server";

const TEXT = {
    en: { iAm: "I am", hereAre: "and here are my" },
    fr: { iAm: "Je suis", hereAre: "et voici mes" },
};

const CONNECTOR_VERTICAL_OFFSET = "-2px"; // ajustement fin de la position verticale du texte de liaison

// 🎛️ Tailles du titre : valeur portable d'abord, puis valeur ordinateur (md et plus)
// "I am" / "and here are my"
const CONNECTOR_SIZE = "[--connector:clamp(0.85rem,4.4vw,1.4rem)] md:[--connector:clamp(1.1rem,8vw,3.5rem)]";
// hauteur du mot-logo "Bolzano"
const BOLZANO_SIZE = "[--bolzano:clamp(1.4rem,7.4vw,2.2rem)] md:[--bolzano:clamp(1.5rem,11vw,5rem)]";
// hauteur du mot-logo "Crafts" (environ 2/3 de Bolzano)
const CRAFTS_SIZE = "[--crafts:clamp(0.95rem,4.9vw,1.5rem)] md:[--crafts:clamp(1rem,7.3vw,3.33rem)]";

export default async function Home() {
    const lang = await getLang();
    const projects = getProjects(lang);
    const t = TEXT[lang];

    return (
        <main className="relative isolate flex min-h-dvh flex-col bg-cream md:block">
            <BunnyBackground />
            <MainHeader />

            <h1
                className={`flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 py-3 text-ink md:gap-x-3 md:py-10 ${CONNECTOR_SIZE} ${BOLZANO_SIZE} ${CRAFTS_SIZE}`}
            >
                <span
                    style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 700,
                        fontSize: "var(--connector)",
                        transform: `translateY(${CONNECTOR_VERTICAL_OFFSET})`,
                        display: "inline-block",
                    }}
                >
                    {t.iAm}
                </span>
                <img
                    src="/logo/bolzano-word.svg"
                    alt="Bolzano"
                    className="inline-block"
                    style={{ height: "var(--bolzano)" }}
                />
                <span
                    style={{
                        fontFamily: "var(--font-playfair)",
                        fontWeight: 700,
                        fontSize: "var(--connector)",
                        transform: `translateY(${CONNECTOR_VERTICAL_OFFSET})`,
                        display: "inline-block",
                    }}
                >
                    {t.hereAre}
                </span>
                <img
                    src="/logo/crafts-word.svg"
                    alt="Crafts"
                    className="inline-block"
                    style={{ height: "var(--crafts)" }}
                />
            </h1>

            <div className="flex min-h-[220px] flex-1 flex-col md:block md:min-h-0 md:flex-none">
                <ProjectShowcase projects={projects} />
            </div>

            <SocialLinks />
        </main>
    );
}
