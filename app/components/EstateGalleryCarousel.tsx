"use client";

import { useState } from "react";
import Image from "next/image";

interface EstateGalleryCarouselProps {
  images: string[];
  name: string;
}

export default function EstateGalleryCarousel({ images, name }: EstateGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark pb-3 border-b border-border-light">
        Project Gallery
      </h2>

      {/* Main Slide Carousel Container */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/40 bg-surface shadow-inner group">
        <Image
          src={images[activeIndex]}
          alt={`${name} gallery view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover transition-all duration-500 ease-in-out scale-100"
        />

        {/* Arrow Navigation (only if > 1 images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-dark shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous gallery image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-dark shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Next gallery image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Index indicator overlay */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-dark/75 text-white rounded-md text-[10px] font-bold tracking-widest uppercase">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Nav Bar (only if > 1 images) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((imgUrl, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  isActive ? "border-primary scale-95 shadow-md" : "border-border-light hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
