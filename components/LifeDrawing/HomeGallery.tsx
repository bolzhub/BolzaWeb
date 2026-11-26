"use client";

import { useState } from "react";
import Link from "next/link";
import LifeDrawingHeader from "./LifeDrawingHeader";
import ImageTile from "./ImageTile";
import GalleryStack from "./GalleryStack";
import Lightbox from "./Lightbox";
import type { HomeItem } from "@/lib/LifeDrawing/galleries";
import { useLang } from "@/lib/i18n/LanguageContext";
import { localizeLifeDrawingName } from "@/lib/LifeDrawing/names";

export default function HomeGallery({ items }: { items: HomeItem[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const lang = useLang();

    return (
        <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a] overflow-x-clip">
            <LifeDrawingHeader title={lang === "fr" ? "Modèle vivant" : "Life Drawing"} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-14 md:gap-y-16 p-8 md:p-16">
                {items.map((item, i) => {
                    const name = localizeLifeDrawingName(item.name, lang);
                    const tile = (
                        <>
                            {item.type === "gallery" ? (
                                <GalleryStack
                                    cover={item.cover}
                                    behind={item.behind}
                                    alt={name}
                                    href={`/LifeDrawing/gallery/${item.slug}`}
                                />
                            ) : (
                                <ImageTile src={item.url} alt={name} onClick={() => setSelectedImage(item.url)} />
                            )}
                            <p className="text-center text-white/70 mt-5 text-sm md:text-base italic">{name}</p>
                            {item.type === "gallery" && (
                                <p className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-white/40 transition-colors group-hover/tile:text-white/70">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-3.5 h-3.5"
                                        aria-hidden
                                    >
                                        <path d="m12 2 10 5-10 5L2 7z" />
                                        <path d="m2 12 10 5 10-5" />
                                        <path d="m2 17 10 5 10-5" />
                                    </svg>
                                    {item.count} {lang === "fr" ? "dessins" : "drawings"}
                                </p>
                            )}
                        </>
                    );

                    return item.type === "gallery" ? (
                        <Link key={i} href={`/LifeDrawing/gallery/${item.slug}`} className="group/tile block">
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
