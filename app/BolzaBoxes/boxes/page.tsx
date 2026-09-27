import BolzaBoxesShell from "@/components/BolzaBoxes/BolzaBoxesShell";

const HERO_IMAGES = {
    international: "/data/Projets/Root_Organiser/.../boxes-international.jpg", // TODO: chemin réel
    french: "/data/Projets/Root_Organiser/.../boxes-french.jpg", // TODO: chemin réel
};

export default function BoxesPage() {
    return (
        <BolzaBoxesShell heroImages={HERO_IMAGES}>
            <div className="min-h-screen flex items-center justify-center bg-[#ECE5D8]">
                <h1
                    className="text-5xl md:text-7xl text-[#3a352c]"
                    style={{ fontFamily: "var(--font-playfair)", fontWeight: 700 }}
                >
                    Boxes
                </h1>
            </div>
        </BolzaBoxesShell>
    );
}