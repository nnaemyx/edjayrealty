"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeThumbnail } from "../lib/utils";
import VideoModal from "./VideoModal";

interface EstateGalleryCarouselProps {
  images: string[];
  videoUrls?: string[];
  name: string;
}

interface SlideItem {
  type: "image" | "video";
  url: string;
}

export default function EstateGalleryCarousel({ images, videoUrls, name }: EstateGalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const slides: SlideItem[] = [];

  // Show videos first, followed by images
  if (videoUrls && videoUrls.length > 0) {
    videoUrls.forEach((url) => {
      slides.push({ type: "video", url });
    });
  }

  images.forEach((url) => {
    slides.push({ type: "image", url });
  });

  if (slides.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark pb-3 border-b border-border-light">
        Project Gallery
      </h2>

      {/* Main Slide Carousel Container */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/40 bg-surface shadow-inner group">
        {slides[activeIndex].type === "video" ? (
          <div className="relative w-full h-full">
            <Image
              src={getYouTubeThumbnail(slides[activeIndex].url)}
              alt={`${name} video thumbnail`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
            />
            {/* Play Button Overlay */}
            <button
              type="button"
              onClick={() => {
                setModalVideoUrl(slides[activeIndex].url);
                setIsModalOpen(true);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors cursor-pointer"
            >
              <div className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 active:scale-95">
                <svg className="w-8 h-8 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
            {/* Overlay Badge */}
            <span className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider shadow-md">
              Video Walkthrough
            </span>
          </div>
        ) : (
          <Image
            src={slides[activeIndex].url}
            alt={`${name} gallery view ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover transition-all duration-500 ease-in-out scale-100"
          />
        )}

        {/* Arrow Navigation (only if > 1 slides) */}
        {slides.length > 1 && (
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
          {activeIndex + 1} / {slides.length}
        </div>
      </div>

      {/* Thumbnail Nav Bar (only if > 1 slides) */}
      {slides.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            const thumbSrc = slide.type === "video" ? getYouTubeThumbnail(slide.url) : slide.url;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  isActive ? "border-primary scale-95 shadow-md" : "border-border-light hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumbSrc}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {slide.type === "video" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={modalVideoUrl}
      />
    </div>
  );
}

