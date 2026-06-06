import Image from "next/image";
import Link from "next/link";
import { getEstates, getStats, getWhyChooseUs, getTestimonials, getGalleryImages, getCeoProfile } from "./lib/db";
import EstateCard from "./components/EstateCard";
import StatsCounter from "./components/StatsCounter";
import TestimonialCarousel from "./components/TestimonialCarousel";
import GalleryGrid from "./components/GalleryGrid";
import ContactForm from "./components/ContactForm";
import { buildWhatsAppUrl } from "./lib/whatsapp";

export default async function Home() {
  const estates = await getEstates();
  const stats = await getStats();
  const whyChooseUs = await getWhyChooseUs();
  const testimonials = await getTestimonials();
  const galleryImages = await getGalleryImages();
  const ceo = await getCeoProfile();

  // We'll show the top 3 selling-fast or available estates on the homepage
  const featuredEstates = estates.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* ---------------- SECTION 1: HERO ---------------- */}
      <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 lg:py-32 overflow-hidden bg-dark">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="Premium Estate Background"
            fill
            priority
            className="object-cover opacity-30 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/85 to-dark" />
          {/* Subtle Green/Red ambient glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[130px] pointer-events-none" />
        </div>

        <div className="container mx-auto relative z-10 flex flex-col items-center text-center px-4">
          {/* Tagline Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
            Nigeria&apos;s Trusted Real Estate Platform
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white font-[family-name:var(--font-heading)] max-w-4xl tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Invest in Prime Real Estate with <span className="text-primary-light">Confidence</span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed mb-10 animate-slide-up">
            Discover premium lands, estates, and investment opportunities designed to secure your future. Start building generational wealth through smart property investments today.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto px-4 justify-center animate-slide-up">
            <Link
              href="/estates"
              className="bg-primary hover:bg-primary-light text-white text-base font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 text-center min-w-[200px]"
            >
              Explore Properties
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 hover:border-white hover:bg-white/5 text-white text-base font-bold px-8 py-4 rounded-full transition-all duration-300 text-center min-w-[200px] backdrop-blur-sm"
            >
              Book Inspection
            </Link>
          </div>

          {/* Trust Features Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-14 animate-slide-up text-white/80 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified Properties
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Trusted Documentation
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Response Within 24 Hours
            </span>
          </div>

          {/* Stats Bar */}
          <div className="w-full max-w-5xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 animate-fade-in shadow-2xl">
            <div className="pt-0 flex flex-col justify-center">
              <StatsCounter target={stats.happyClients} label="Happy Clients" suffix="+" />
            </div>
            <div className="pt-4 md:pt-0 md:pl-4 flex flex-col justify-center">
              <StatsCounter target={stats.propertiesSold} label="Properties Sold" suffix="+" />
            </div>
            <div className="pt-4 md:pt-0 md:pl-4 flex flex-col justify-center">
              <StatsCounter target={stats.estatesManaged} label="Active Estates" />
            </div>
            <div className="pt-4 md:pt-0 md:pl-4 flex flex-col justify-center">
              <StatsCounter target={stats.investmentVolume} label="Investment Vol (₦)" prefix="₦" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 text-xs font-semibold tracking-wider uppercase select-none animate-float cursor-pointer hidden md:flex">
          <span>Scroll Down</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ---------------- SECTION 2: FEATURED ESTATES ---------------- */}
      <section id="featured-estates" className="py-24 bg-white">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Featured Projects
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark">
                Our Premium Estates
              </h2>
            </div>
            <Link
              href="/estates"
              className="inline-flex items-center gap-2 group text-primary font-bold hover:text-primary-dark transition-colors self-start"
            >
              <span>View All Properties</span>
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredEstates.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm border border-dashed border-border rounded-2xl w-full col-span-3">
              No premium estates listed yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {featuredEstates.map((estate) => (
                <EstateCard key={estate.id} estate={estate} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- SECTION 3: WHY CHOOSE US ---------------- */}
      <section id="why-choose-us" className="py-24 bg-surface border-y border-border/40">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Why Invest With Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
              Designed For High Return On Investment
            </h2>
            <p className="text-text-muted text-base sm:text-lg">
              We offer stress-free real estate acquisitions backed by solid legal frameworks and premium infrastructure development.
            </p>
          </div>

          {/* Cards Grid */}
          {whyChooseUs.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              Our core investment principles and value propositions will be updated soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                >
                  {/* Icon mapping */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300">
                    {feature.icon === "shield" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {feature.icon === "file" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {feature.icon === "calendar" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {feature.icon === "headphones" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    {feature.icon === "lock" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {feature.icon === "trending" && (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                  </div>
                  {/* Heading */}
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  {/* Description */}
                  <p className="text-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- SECTION 4: ABOUT US + MISSION/VISION ---------------- */}
      <section id="about-us" className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Image Composite */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="About Edjay Realty"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/10" />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl p-5 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                  10+
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">Years of Excellence</p>
                  <p className="text-xs text-text-muted font-medium">Securing investment properties in Nigeria</p>
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                About Our Company
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6 leading-tight">
                Securing Your Future Through Land Ownership
              </h2>
              <p className="text-text-muted text-base sm:text-lg mb-6 leading-relaxed">
                At Edjay Realty, we believe that every piece of property represents the potential for a brighter tomorrow. With integrity, innovation, and customer-centricity at our core, we guide our clients through a seamless acquisition process.
              </p>
              <p className="text-text-muted text-base sm:text-lg mb-8 leading-relaxed">
                Whether you are a first-time investor, a diaspora client looking for secure home-based assets, or looking to build developer portfolios, our carefully curated estates in Anambra and Abuja offer premium potential.
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Complete C of O Processing",
                  "Free Inspections & Site Visits",
                  "Secure Allocation & Immediate Handover",
                  "100% Genuine, Non-Omonile Land",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-semibold text-text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="bg-surface/50 rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-3">Our Mission</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To simplify property acquisition in Nigeria through transparency, rigid verification, and flexible pricing structures, enabling both local and international clients to invest with absolute peace of mind.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-surface/50 rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-shadow duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-dark mb-3">Our Vision</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To be the leading and most trusted property developer in Southeast Nigeria, recognized for launching self-sustaining residential layouts that redefine modern African living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4B: MEET THE FOUNDER ---------------- */}
      <section id="meet-the-founder" className="py-24 bg-surface border-y border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            {/* Founder Image */}
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 border border-border/40">
              <Image
                src={ceo.image}
                alt={`${ceo.name} - ${ceo.role}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 bg-primary/90 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                  {ceo.role}
                </span>
              </div>
            </div>

            {/* Founder Content */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                {ceo.sectionLabel}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4 leading-tight">
                {ceo.name}
              </h2>
              {ceo.tagline && (
                <p className="text-lg text-primary font-semibold mb-6">
                  {ceo.tagline}
                </p>
              )}
              {ceo.bioParagraph1 && (
                <p className="text-text-muted text-base leading-relaxed mb-6">
                  {ceo.bioParagraph1}
                </p>
              )}
              {ceo.bioParagraph2 && (
                <p className="text-text-muted text-base leading-relaxed mb-8">
                  {ceo.bioParagraph2}
                </p>
              )}

              {/* Achievements */}
              {ceo.achievements.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {ceo.achievements.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-border/50 text-center">
                      <span className="block text-2xl font-extrabold text-primary font-[family-name:var(--font-heading)]">
                        {stat.value}
                      </span>
                      <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: GALLERY PREVIEW ---------------- */}
      <section id="gallery-preview" className="py-24 bg-surface border-t border-border/40">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Photo Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
              Explore Our Project Sites
            </h2>
            <p className="text-text-muted text-base sm:text-lg">
              Visual previews of layout designs, on-site infrastructure, road mapping, and customer handover events.
            </p>
          </div>

          {galleryImages.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No project site pictures uploaded yet.
            </div>
          ) : (
            <GalleryGrid limit={8} images={galleryImages} />
          )}

          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center border border-primary hover:bg-primary/5 text-primary text-sm font-bold px-8 py-3.5 rounded-xl transition-all"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 6: TESTIMONIALS ---------------- */}
      <section id="testimonials" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
              What Our Investors Say
            </h2>
            <p className="text-text-muted text-base sm:text-lg">
              Over 1,200 investors have trusted Edjay Realty to build their real estate portfolios. Read their stories.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No customer testimonials posted yet.
            </div>
          ) : (
            <TestimonialCarousel testimonials={testimonials} />
          )}
        </div>
      </section>

      {/* ---------------- SECTION 7: CONTACT & MAPS ---------------- */}
      <section id="contact" className="py-24 bg-surface border-t border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Columns: Contact Info & Map */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  Get In Touch
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
                  Talk To Our Sales Team
                </h2>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  Have questions about our payment plans, inspections, or title documentations? Our experienced agents are ready to assist you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  {
                    title: "Head Office Address",
                    value: "Awka, Anambra State, Nigeria",
                    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                  },
                  {
                    title: "Phone Support",
                    value: "+234 801 234 5678",
                    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  },
                  {
                    title: "Email Inquiry",
                    value: "info@edjayrealty.com",
                    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-border/40 shadow-sm shadow-gray-100/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-sm">{item.title}</h4>
                      <p className="text-text-muted text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 shadow-md">
                {/* Using a clean styling fallback map / premium UI map component */}
                <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
                  <svg className="w-10 h-10 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="font-bold text-dark text-sm">Interactive Map Location</p>
                  <p className="text-text-muted text-xs mt-1">Awka-Enugu Expressway Office Hub, Awka, Anambra State</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs bg-dark hover:bg-dark-light text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Open Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Right Columns: Inquiry Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 8: CTA BANNER ---------------- */}
      <section id="cta-banner" className="py-20 bg-dark text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-heading)] mb-6 leading-tight">
            Ready to Secure Your Piece of the Future?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t wait to buy land, buy land and wait. Schedule a free site visit or chat with an investment specialist today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={buildWhatsAppUrl("Hello Edjay Realty, I'm ready to invest in an estate.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
            >
              {/* WhatsApp icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Chat with an Agent</span>
            </a>
            <Link
              href="/contact"
              className="border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center"
            >
              Book Physical Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
