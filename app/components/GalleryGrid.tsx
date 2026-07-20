"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages as staticGalleryImages, GalleryImage } from "../lib/data";
import { getYouTubeEmbedUrl } from "../lib/utils";

interface GalleryGridProps {
  limit?: number;
  images?: GalleryImage[];
}

const categories = ["All", "Estates", "Construction", "Events"];

export default function GalleryGrid({ limit, images }: GalleryGridProps) {
  const activeImages = images || staticGalleryImages;
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter images based on category selection
  const filteredImages = activeImages.filter(
    (img) => activeCategory === "All" || img.category === activeCategory
  );

  // Limit display size if requested (e.g. for homepage preview)
  const displayedImages = limit ? filteredImages.slice(0, limit) : filteredImages;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === displayedImages.length - 1 ? 0 : (prev as number) + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === 0 ? displayedImages.length - 1 : (prev as number) - 1
    );
  };

  return (
    <div className="w-full">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10" id="gallery-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-gray-100 hover:bg-gray-200 text-text-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="gallery-image-grid">
        {displayedImages.map((image, index) => (
          <div
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-border/40 hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Play Button Overlay if Video */}
            {image.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
                {image.category}
              </span>
              <p className="text-white text-base font-bold font-[family-name:var(--font-heading)]">
                {image.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 select-none animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close gallery lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Nav buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 z-55 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Active Image / Video */}
          <div
            className={`relative max-w-full max-h-[80vh] w-[1000px] overflow-hidden rounded-2xl bg-black ${
              displayedImages[lightboxIndex].isVideo ? "aspect-[16/9] h-[562px]" : "aspect-[4/3] h-[750px]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {displayedImages[lightboxIndex].isVideo && displayedImages[lightboxIndex].videoUrl ? (
              <iframe
                src={`${getYouTubeEmbedUrl(displayedImages[lightboxIndex].videoUrl)}?autoplay=1`}
                title={displayedImages[lightboxIndex].alt}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <Image
                src={displayedImages[lightboxIndex].src}
                alt={displayedImages[lightboxIndex].alt}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="text-base font-bold font-[family-name:var(--font-heading)]">
              {displayedImages[lightboxIndex].alt}
            </p>
            <span className="text-white/60 text-xs mt-1 block">
              {displayedImages[lightboxIndex].category} &bull; Image {lightboxIndex + 1} of{" "}
              {displayedImages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
