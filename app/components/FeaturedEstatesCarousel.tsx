"use client";

import { useState, useEffect, useRef } from "react";
import { Estate } from "../lib/data";
import EstateCard from "./EstateCard";

interface FeaturedEstatesCarouselProps {
  estates: Estate[];
}

export default function FeaturedEstatesCarousel({ estates }: FeaturedEstatesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive visible card counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = estates.length;
  const maxIndex = Math.max(0, totalSlides - visibleCards);

  // Reset index if visible counts or max index changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Auto scroll logic (transitions every 5 seconds)
  useEffect(() => {
    if (isHovered || maxIndex === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (!estates || estates.length === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scroll View Wrapper */}
      <div className="relative overflow-hidden w-full pb-4 px-1">
        <div
          ref={containerRef}
          className="flex transition-transform duration-700 ease-out gap-6"
          style={{
            // Mathematically precise translation that accounts for the flex gaps (24px / 1.5rem)
            transform: `translateX(calc(-${currentIndex} * (100% + 1.5rem) / ${visibleCards}))`,
          }}
        >
          {estates.map((estate) => {
            // Setup precise width sizing based on visible card configuration
            let widthStyle = "w-full flex-shrink-0";
            if (visibleCards === 2) {
              widthStyle = "w-[calc((100%-1.5rem)/2)] flex-shrink-0";
            } else if (visibleCards === 3) {
              widthStyle = "w-[calc((100%-3rem)/3)] flex-shrink-0";
            }
            return (
              <div key={estate.id} className={widthStyle}>
                <EstateCard estate={estate} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-3 lg:-translate-x-6 w-11 h-11 rounded-full bg-white hover:bg-primary hover:text-white text-dark shadow-xl flex items-center justify-center transition-all duration-300 border border-border/40 z-20 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-3 lg:translate-x-6 w-11 h-11 rounded-full bg-white hover:bg-primary hover:text-white text-dark shadow-xl flex items-center justify-center transition-all duration-300 border border-border/40 z-20 cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Pagination Bullets */}
      {maxIndex > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? "bg-primary w-8" : "bg-primary/25 hover:bg-primary/50 w-2"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
