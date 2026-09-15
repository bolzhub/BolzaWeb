import MainHeader from "@/components/MainHeader";
import SocialLinks from "@/components/SocialLinks";
import ProjectShowcase from "@/components/ProjectShowcase";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const projects = getProjects();

  return (
    <main className="min-h-screen min-h-dvh bg-[#ECE5D8]">
      <MainHeader />

      <h1
        className="text-center text-[#3a352c] text-4xl md:text-6xl tracking-wide py-10"
        style={{ fontFamily: "var(--font-quicksand)", fontWeight: 700 }}
      >
        I am Bolzano and here are my crafts
      </h1>

      <ProjectShowcase projects={projects} />
      <SocialLinks />
    </main>
  );
}