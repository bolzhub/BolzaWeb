import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        margin: 0,
      }}
    >
      <img
        src="/data/Projets/ADR/Ane%C3%A9.png"
        alt="Description : premier dessin"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </main>
  );
}