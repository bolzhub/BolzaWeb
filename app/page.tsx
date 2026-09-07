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
    <main className="min-h-screen m-0 bg-[#1a1a1a]">
      <h1 className="text-center text-white m-0 py-4">
        Atelier Double Raisin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {images.map((src, i) => (
          <div key={i} className="flex justify-center items-center">
            <img
              src={src}
              alt={`Illustration ${i + 1}`}
              className="max-w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </main>
  );
}