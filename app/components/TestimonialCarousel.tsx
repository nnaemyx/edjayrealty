"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { testimonials as staticTestimonials, Testimonial } from "../lib/data";

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const activeTestimonials = testimonials || staticTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === activeTestimonials.length - 1 ? 0 : prev + 1));
  }, [activeTestimonials.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? activeTestimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4" id="testimonial-slider">
      {/* Cards Slider */}
      <div className="overflow-hidden relative min-h-[380px] sm:min-h-[300px] flex items-center">
        {activeTestimonials.map((testimonial, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={testimonial.id}
              className={`absolute w-full transition-all duration-700 ease-in-out transform ${
                isActive
                  ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-x-12 scale-95 pointer-events-none"
              }`}
            >
              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-border/50 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {/* Image & Rating */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-gold fill-gold"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  {/* Quote Icon */}
                  <div className="hidden sm:block text-primary/10 self-start mb-1">
                    <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.748-9.791 9-11.585l.758 1.43c-3.79 1.6-6.52 4.96-6.52 8.448h5.753V21h-9.017zm-14 0v-7.391c0-5.704 3.748-9.791 9-11.585l.758 1.43c-3.79 1.6-6.52 4.96-6.52 8.448h5.753V21h-9.017z" />
                    </svg>
                  </div>
                  {/* Quote Text */}
                  <p className="text-text-muted text-base sm:text-lg italic leading-relaxed mb-6 font-medium">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  {/* Client Info */}
                  <div>
                    <h4 className="text-lg font-bold font-[family-name:var(--font-heading)] text-dark leading-tight">
                      {testimonial.name}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 justify-center md:justify-start">
                      <span className="text-sm text-text-light font-medium">{testimonial.role}</span>
                      {testimonial.investmentType && (
                        <>
                          <span className="hidden sm:inline text-text-light/55">&bull;</span>
                          <span className="text-xs text-primary font-semibold uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md inline-block self-center">
                            Invested in {testimonial.investmentType}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden md:flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white hover:bg-primary hover:text-white text-dark shadow-md flex items-center justify-center transition-all duration-200 pointer-events-auto -translate-x-6 border border-border/40"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white hover:bg-primary hover:text-white text-dark shadow-md flex items-center justify-center transition-all duration-200 pointer-events-auto translate-x-6 border border-border/40"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {activeTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
