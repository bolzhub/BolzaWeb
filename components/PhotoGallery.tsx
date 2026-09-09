"use client";

import { useState, useRef, useEffect } from "react";

export default function PhotoGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScaleState] = useState(1);
  const [position, setPositionState] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const scaleRef = useRef(1);
  const positionRef = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const setScale = (s: number) => {
    scaleRef.current = s;
    setScaleState(s);
  };

  const setPosition = (p: { x: number; y: number }) => {
    positionRef.current = p;
    setPositionState(p);
  };

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

  const zoomAtPoint = (px: number, py: number, newScale: number) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const oldScale = scaleRef.current;
    const prevPos = positionRef.current;

    const localX = (px - cx - prevPos.x) / oldScale;
    const localY = (py - cy - prevPos.y) / oldScale;

    setPosition({
      x: px - cx - newScale * localX,
      y: py - cy - newScale * localY,
    });
    setScale(newScale);
  };

  const toggleZoom = (px?: number, py?: number) => {
    if (scaleRef.current === 1) {
      const newScale = 2.5;
      if (px !== undefined && py !== undefined) {
        zoomAtPoint(px, py, newScale);
      } else {
        setScale(newScale);
      }
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.min(Math.max(scaleRef.current + delta, 0.5), 5);
    zoomAtPoint(e.clientX, e.clientY, newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasMoved.current = false;
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setDragStart({ x: e.clientX - positionRef.current.x, y: e.clientY - positionRef.current.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 5) {
      hasMoved.current = true;
    }
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
      setIsPinching(false);
      hasMoved.current = false;
      mouseDownPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setDragStart({
        x: e.touches[0].clientX - positionRef.current.x,
        y: e.touches[0].clientY - positionRef.current.y,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      setIsPinching(true);
      lastTouchDistance.current = getTouchDistance(e.touches);
      lastTouchCenter.current = getTouchCenter(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - mouseDownPos.current.x;
      const dy = e.touches[0].clientY - mouseDownPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        hasMoved.current = true;
      }
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (
      e.touches.length === 2 &&
      lastTouchDistance.current !== null &&
      lastTouchCenter.current !== null
    ) {
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);
      const distanceRatio = newDistance / lastTouchDistance.current;
      const newScale = Math.min(Math.max(scaleRef.current * distanceRatio, 0.5), 5);

      zoomAtPoint(newCenter.x, newCenter.y, newScale);

      lastTouchDistance.current = newDistance;
      lastTouchCenter.current = newCenter;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      if (!hasMoved.current && lastTouchDistance.current === null) {
        const tappedOnImage = (e.target as HTMLElement).tagName === "IMG";
        if (tappedOnImage) {
          const touch = e.changedTouches[0];
          toggleZoom(touch.clientX, touch.clientY);
        } else {
          closeImage();
        }
      }
      setIsDragging(false);
      setIsPinching(false);
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    } else if (e.touches.length === 1) {
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
      setIsPinching(false);
      setIsDragging(true);
      hasMoved.current = true;
      setDragStart({
        x: e.touches[0].clientX - positionRef.current.x,
        y: e.touches[0].clientY - positionRef.current.y,
      });
    }
  };

  const handleImageClickDesktop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasMoved.current) {
      toggleZoom(e.clientX, e.clientY);
    }
  };

  return (
    <main className="min-h-screen min-h-dvh m-0 bg-[#1a1a1a]">
      <h1
        className="text-center text-white m-0 pt-8 pb-2 text-5xl tracking-wide"
        style={{ fontFamily: "var(--font-playfair)", fontWeight: 400 }}
      >
        {title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 p-8 md:p-16">
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
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white"
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
              transition: isDragging || isPinching ? "none" : "transform 0.1s ease-out",
            }}
            onClick={handleImageClickDesktop}
            draggable={false}
          />
        </div>
      )}
    </main>
  );
}