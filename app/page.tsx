export default function Home() {
  const images = [
    "/data/Projets/ADR/Ane%C3%A9.png",
    "/data/Projets/ADR/AutreImage.png",
    "/data/Projets/ADR/EncoreUne.png",
  ];

  return (
    <main style={{ margin: 0, backgroundColor: "#1a1a1a" }}>
      <h1
        style={{
          // position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          textAlign: "center",
          color: "white",
          margin: 0,
          padding: "1rem 0",
          // zIndex: 10,
        }}
      >
        Atelier Double Raisin
      </h1>

      {images.map((src, i) => (
        <section
          key={i}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <img
            src={src}
            alt={`Illustration ${i + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </section>
      ))}
    </main>
  );
}