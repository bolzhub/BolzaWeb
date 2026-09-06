export default function Home() {
  const images = [
    "/data/Projets/ADR/Ane%C3%A9.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%201.png",
    "/data/Projets/ADR/Jsp/Illustration_sans_titre%202.png",
  ];

  return (
    <main className="m-0 bg-[#1a1a1a]">
      <h1 className="text-center text-white m-0 py-4">
        Atelier Double Raisin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="flex justify-center items-center h-screen w-full"
          >
            <img
              src={src}
              alt={`Illustration ${i + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>
    </main>
  );
}