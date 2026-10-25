"use client";

import { useState } from "react";
import Link from "next/link";
import ADRHeader from "./ADRHeader";
import ImageTile from "./ImageTile";
import Lightbox from "./Lightbox";

export default function PhotoGallery({ title, images }: { title: string; images: string[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
            <ADRHeader
                title={title}
                left={
                    <Link
                        href="/ADR"
                        aria-label="Back to Atelier Double Raisin"
                        className="block text-white/70 hover:text-white transition-colors"
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
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 md:p-16">
                {images.map((src, i) => (
                    <ImageTile key={i} src={src} alt={`Illustration ${i + 1}`} onClick={() => setSelectedImage(src)} />
                ))}
            </div>

            <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
        </main>
    );
}
