"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from "../lib/utils";

interface EstateCardCarouselProps {
  images: string[];
  videoUrls?: string[];
  alt: string;
}

interface SlideItem {
  type: "image" | "video";
  url: string;
}

export default function EstateCardCarousel({ images, videoUrls, alt }: EstateCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  useEffect(() => {
    if (slides.length <= 1 || isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length, isPlaying]);

  if (slides.length === 0) return null;

  const goTo = (index: number) => {
    setIsPlaying(false);
    setActiveIndex(index);
  };
  const prev = () => {
    setIsPlaying(false);
    setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  };
  const next = () => {
    setIsPlaying(false);
    setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group">
      {/* Slide Content */}
      <div className="w-full h-full relative">
        {slides[activeIndex].type === "video" ? (
          <div className="relative w-full h-full animate-fade-in">
            {isPlaying ? (
              <iframe
                src={`${getYouTubeEmbedUrl(slides[activeIndex].url)}?autoplay=1`}
                title={`${alt} - video walkthrough`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <>
                <Image
                  src={getYouTubeThumbnail(slides[activeIndex].url)}
                  alt={`${alt} - video thumbnail`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                {/* Play Button Overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPlaying(true);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/40 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
                {/* Video Badge Overlay */}
                <span className="absolute bottom-4 left-4 z-10 px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-bold uppercase tracking-wider">
                  Video Walkthrough
                </span>
              </>
            )}
          </div>
        ) : (
          <Image
            src={slides[activeIndex].url}
            alt={`${alt} - image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-dark shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
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
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
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

