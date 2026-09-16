import MainHeader from "@/components/MainHeader";
import SocialLinks from "@/components/SocialLinks";
import ProjectShowcase from "@/components/ProjectShowcase";
import { getProjects } from "@/lib/projects";

const CONNECTOR_FONT_SIZE = "clamp(1.1rem, 8vw, 3.5rem)"; // taille de "I am" / "and here are my"
const CONNECTOR_VERTICAL_OFFSET = "-2px"; // ajustement fin de leur position verticale
const BOLZANO_HEIGHT = "clamp(1.5rem, 11vw, 5rem)"; // hauteur du logo "Bolzano"
const CRAFTS_HEIGHT = "clamp(1.0rem, 7.3vw, 3.33rem)"; // hauteur du logo "Crafts"

export default function Home() {
  const projects = getProjects();

  return (
    <main className="min-h-screen min-h-dvh bg-[#ECE5D8]">
      <MainHeader />

      <h1 className="flex flex-wrap items-baseline justify-center gap-3 text-[#3a352c] py-10">
        <span
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: CONNECTOR_FONT_SIZE,
            transform: `translateY(${CONNECTOR_VERTICAL_OFFSET})`,
            display: "inline-block",
          }}
        >
          I am
        </span>
        <img
          src="/logo/bolzano-word.svg"
          alt="Bolzano"
          className="inline-block"
          style={{ height: BOLZANO_HEIGHT }}
        />
        <span
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: CONNECTOR_FONT_SIZE,
            transform: `translateY(${CONNECTOR_VERTICAL_OFFSET})`,
            display: "inline-block",
          }}
        >
          and here are my
        </span>
        <img
          src="/logo/crafts-word.svg"
          alt="Crafts"
          className="inline-block"
          style={{ height: CRAFTS_HEIGHT }}
        />
      </h1>

      <ProjectShowcase projects={projects} />
      <SocialLinks />
    </main>
  );
}