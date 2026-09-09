"use client";

import { useState } from "react";
import Link from "next/link";
import Lightbox from "./Lightbox";

export default function PhotoGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
      <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 pt-8 pb-2 px-4 md:px-8">
        <Link
          href="/"
          className="text-white/70 hover:text-white transition-colors shrink-0"
          aria-label="Retour à Atelier Double Raisin"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1
          className="text-center text-white m-0 text-5xl tracking-wide"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
        >
          {title}
        </h1>
        <div aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 md:p-16">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative w-full cursor-pointer"
            style={{ paddingTop: "100%" }}
            onClick={() => setSelectedImage(src)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={src}
                alt={`Illustration ${i + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white"
              />
            </div>
          </div>
        ))}
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  );
}