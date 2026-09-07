"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

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

  const openImage = (src: string) => {
    setSelectedImage(src);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeImage = () => {
    setSelectedImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const newDistance = getTouchDistance(e.touches);
      const delta = (newDistance - lastTouchDistance.current) * 0.01;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 5));
      lastTouchDistance.current = newDistance;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      lastTouchDistance.current = null;
    } else if (e.touches.length === 1) {
      lastTouchDistance.current = null;
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  return (
    <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
      <h1
        className="text-center text-white m-0 pt-8 pb-2 text-5xl md:text-5xl tracking-wide"
        style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
      >
        Atelier Double Raisin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 md:p-12">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative w-full cursor-pointer"
            style={{ paddingTop: "100%" }}
            onClick={() => openImage(src)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={src}
                alt={`Illustration ${i + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden"
          onClick={closeImage}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
        >
          <img
            src={selectedImage}
            alt="Image agrandie"
            className="max-w-full max-h-full object-contain select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </main>
  );
}