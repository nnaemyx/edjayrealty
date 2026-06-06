"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Estates", href: "/estates" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
  { label: "Become an Affiliate", href: "/affiliate" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const showSolidHeader = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showSolidHeader
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-2"
          : "bg-transparent py-4"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Logo variant={showSolidHeader ? "dark" : "light"} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${showSolidHeader
                  ? "text-dark hover:text-primary hover:bg-primary/5"
                  : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/buy"
              id="header-cta"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              Buy Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-all ${showSolidHeader
              ? "text-dark bg-gray-100 hover:bg-gray-200 shadow-sm"
              : "text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              }`}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 ${showSolidHeader ? "bg-dark" : "bg-white"
                  } ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 ${showSolidHeader ? "bg-dark" : "bg-white"
                  } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 rounded-full transition-all duration-300 ${showSolidHeader ? "bg-dark" : "bg-white"
                  } ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-[60] transition-all duration-300 ${isMobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-10">
              <Logo variant="dark" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1" id="mobile-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-dark hover:text-primary hover:bg-primary/5 font-medium transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-border-light">
              <Link
                href="/buy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Buy Now
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full mt-3 border-2 border-primary text-primary hover:bg-primary hover:text-white text-center px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Book Inspection
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-border-light">
              <p className="text-sm text-text-muted mb-2">Need help?</p>
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
