"use client";

import { useState } from "react";
import Link from "next/link";
import ADRHeader from "./ADRHeader";
import ImageTile from "./ImageTile";
import Lightbox from "./Lightbox";
import Logo from "@/components/site/Logo";
import type { HomeItem } from "@/lib/ADR/galleries";

export default function HomeGallery({ items }: { items: HomeItem[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
            <ADRHeader left={<Logo size="small" height={32} />} title="Life Drawing" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14 md:gap-y-16 p-8 md:p-16">
                {items.map((item, i) => {
                    const imageUrl = item.type === "image" ? item.url : undefined;
                    const tile = (
                        <>
                            <ImageTile
                                src={item.type === "gallery" ? item.cover : item.url}
                                alt={item.name}
                                onClick={imageUrl ? () => setSelectedImage(imageUrl) : undefined}
                            />
                            <p className="text-center text-white/70 mt-5 text-sm md:text-base italic">{item.name}</p>
                        </>
                    );

                    return item.type === "gallery" ? (
                        <Link key={i} href={`/ADR/gallery/${item.slug}`} className="block">
                            {tile}
                        </Link>
                    ) : (
                        <div key={i} className="block">
                            {tile}
                        </div>
                    );
                })}
            </div>

            <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
        </main>
    );
}
