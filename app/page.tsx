import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h1>Hello world</h1>
      <img
        src="/Illustration_sans_titre 1.png"  // Chemin relatif depuis public/
        alt="Description de mon image"
        width={500}  // Largeur en pixels
        height={300} // Hauteur en pixels
      />
    </main>
  );
}