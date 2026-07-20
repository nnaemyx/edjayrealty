"use client";

import Link from "next/link";
import { Estate } from "../lib/data";
import EstateCardCarousel from "./EstateCardCarousel";

interface EstateCardProps {
  estate: Estate;
}

export default function EstateCard({ estate }: EstateCardProps) {
  const { id, name, location, state, shortDescription, priceRange, image, images, plotSizes, status, videoUrls, brochureUrl } = estate;
  const cardImages = images?.length ? images : image ? [image] : [];

  // Badge styles based on status
  const getStatusBadge = () => {
    switch (status) {
      case "available":
        return {
          text: "Available",
          classes: "bg-primary text-white",
        };
      case "selling-fast":
        return {
          text: "Selling Fast",
          classes: "bg-gold text-dark font-bold animate-pulse-soft",
        };
      case "sold-out":
        return {
          text: "Sold Out",
          classes: "bg-dark/80 text-white/80 line-through",
        };
      case "coming-soon":
        return {
          text: "Coming Soon",
          classes: "bg-accent text-white",
        };
      default:
        return {
          text: "Estate",
          classes: "bg-primary text-white",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-border/60 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative">
        <EstateCardCarousel images={cardImages} videoUrls={videoUrls} alt={name} />
        {/* Status Badge */}
        <span className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-md ${badge.classes}`}>
          {badge.text}
        </span>
        {/* State Badge */}
        <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
          {state}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium mb-2.5">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-2.5 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Short Description */}
        <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
          {shortDescription}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-light mb-5">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-text-light font-medium mb-1">
              Price Range
            </span>
            <span className="text-base font-bold text-dark font-[family-name:var(--font-heading)]">
              {priceRange}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-text-light font-medium mb-1">
              Plot Sizes
            </span>
            <span className="text-sm font-semibold text-text-muted">
              {plotSizes.join(", ")}
            </span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/estates/${id}`}
              className="flex items-center justify-center border border-primary hover:bg-primary/5 text-primary py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center"
            >
              View Details
            </Link>
            {status === "sold-out" ? (
              <button
                disabled
                className="flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-center"
              >
                Sold Out
              </button>
            ) : (
              <Link
                href={`/buy?estate=${id}`}
                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/10 text-center"
              >
                Buy Now
              </Link>
            )}
          </div>
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border border-border hover:bg-surface text-dark py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center w-full"
            >
              <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download Brochure (PDF)
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
