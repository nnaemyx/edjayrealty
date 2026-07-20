"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from "../lib/utils";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  // Lightbox navigation handlers
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const lightboxNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    // Only navigate through image slides in lightbox
    const imageSlides = slides.map((s, i) => ({ ...s, originalIndex: i })).filter(s => s.type === "image");
    const currentPos = imageSlides.findIndex(s => s.originalIndex === lightboxIndex);
    const nextPos = currentPos === imageSlides.length - 1 ? 0 : currentPos + 1;
    setLightboxIndex(imageSlides[nextPos].originalIndex);
  }, [lightboxIndex, slides]);

  const lightboxPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    const imageSlides = slides.map((s, i) => ({ ...s, originalIndex: i })).filter(s => s.type === "image");
    const currentPos = imageSlides.findIndex(s => s.originalIndex === lightboxIndex);
    const prevPos = currentPos === 0 ? imageSlides.length - 1 : currentPos - 1;
    setLightboxIndex(imageSlides[prevPos].originalIndex);
  }, [lightboxIndex, slides]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, lightboxNext, lightboxPrev]);

  if (slides.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSlideClick = () => {
    const currentSlide = slides[activeIndex];
    if (currentSlide.type === "video") {
      setModalVideoUrl(currentSlide.url);
      setIsModalOpen(true);
    } else {
      setLightboxIndex(activeIndex);
    }
  };

  // Count image slides for lightbox counter
  const imageSlides = slides.map((s, i) => ({ ...s, originalIndex: i })).filter(s => s.type === "image");
  const currentImagePos = lightboxIndex !== null ? imageSlides.findIndex(s => s.originalIndex === lightboxIndex) : -1;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark pb-3 border-b border-border-light">
        Project Gallery
      </h2>

      {/* Main Slide Carousel Container */}
      <div
        className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/40 bg-surface shadow-inner group cursor-pointer"
        onClick={handleSlideClick}
      >
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors">
              <div className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 active:scale-95">
                <svg className="w-8 h-8 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Overlay Badge */}
            <span className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider shadow-md">
              Video Walkthrough
            </span>
          </div>
        ) : (
          <>
            <Image
              src={slides[activeIndex].url}
              alt={`${name} gallery view ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover transition-all duration-500 ease-in-out scale-100"
            />
            {/* Expand icon overlay */}
            <div className="absolute top-4 right-14 z-10 w-9 h-9 rounded-lg bg-dark/60 hover:bg-dark/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </div>
          </>
        )}

        {/* Arrow Navigation (only if > 1 slides) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-dark shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous gallery image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
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

      {/* Fullscreen Image Lightbox */}
      {lightboxIndex !== null && slides[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 select-none animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Nav buttons */}
          {imageSlides.length > 1 && (
            <>
              <button
                onClick={(e) => lightboxPrev(e)}
                className="absolute left-4 sm:left-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => lightboxNext(e)}
                className="absolute right-4 sm:right-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Active Image */}
          <div
            className="relative max-w-full max-h-[85vh] w-[1100px] aspect-[4/3] overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={slides[lightboxIndex].url}
              alt={`${name} - full view ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="text-base font-bold font-[family-name:var(--font-heading)]">
              {name}
            </p>
            <span className="text-white/60 text-xs mt-1 block">
              Image {currentImagePos + 1} of {imageSlides.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


