import Link from "next/link";
import { getGalleries } from "@/lib/galleries";

export default function Home() {
  const galleries = getGalleries();

  return (
    <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
      <h1
        className="text-center text-white m-0 pt-8 pb-2 text-5xl tracking-wide"
        style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
      >
        Atelier Double Raisin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14 md:gap-y-16 p-8 md:p-16">
        {galleries.map((gallery) => (
          <Link key={gallery.slug} href={`/gallery/${gallery.slug}`} className="block">
            <div className="relative w-full cursor-pointer" style={{ paddingTop: "100%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={gallery.cover}
                  alt={gallery.name}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white"
                />
              </div>
            </div>
            <p className="text-center text-white/70 mt-5 text-sm md:text-base italic">
              {gallery.name}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}