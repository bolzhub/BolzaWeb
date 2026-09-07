export default function Home() {
  const images = [
    "/data/Projets/ADR/Ane%C3%A9.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%201.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%202.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%203.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%204.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%205.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%206.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%207.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%208.png",
  ];

  return (
    <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
      <h1
        className="text-center text-white m-0 py-8 text-5xl md:text-5xl tracking-wide"
        style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
      >
        Atelier Double Raisin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 md:p-12">
        {images.map((src, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center"
          >
            <img
              src={src}
              alt={`Illustration ${i + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        ))}
      </div>
    </main>
  );
}