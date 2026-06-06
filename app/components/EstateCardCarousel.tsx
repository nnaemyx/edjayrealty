"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface EstateCardCarouselProps {
  images: string[];
  alt: string;
}

export default function EstateCardCarousel({ images, alt }: EstateCardCarouselProps) {
  const slides = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goTo = (index: number) => setActiveIndex(index);
  const prev = () => setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group">
      <Image
        src={slides[activeIndex]}
        alt={`${alt} - image ${activeIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
