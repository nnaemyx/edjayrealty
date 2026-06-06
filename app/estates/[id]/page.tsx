import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEstateById } from "../../lib/db";
import { formatCurrency } from "../../lib/utils";
import FAQ from "../../components/FAQ";
import ContactForm from "../../components/ContactForm";
import EstateGalleryCarousel from "../../components/EstateGalleryCarousel";

interface EstatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EstateDetailPage({ params }: EstatePageProps) {
  const { id } = await params;
  const estate = await getEstateById(id);

  if (!estate) {
    notFound();
  }

  // Create WhatsApp message link
  const whatsappUrl = `https://wa.me/2348012345678?text=Hello%20Edjay%20Realty%2C%20I%27m%20interested%20in%20${encodeURIComponent(
    estate.name
  )}%20at%20${encodeURIComponent(estate.location)}.`;

  return (
    <div className="min-h-screen bg-surface/30 pt-20">
      {/* ---------------- HERO BANNER ---------------- */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end pb-12 bg-dark">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={estate.image}
            alt={estate.name}
            fill
            priority
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/45 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto relative z-10 text-white">
          <div className="max-w-4xl">
            {/* Navigation back */}
            <Link
              href="/estates"
              className="inline-flex items-center gap-1 text-white/70 hover:text-primary-light text-xs font-semibold uppercase tracking-wider mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Estates</span>
            </Link>

            {/* Title / Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1.5 bg-primary rounded-full text-xs font-bold uppercase tracking-wider">
                {estate.status.replace("-", " ")}
              </span>
              <span className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wider">
                {estate.state} State
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-heading)] leading-tight mb-4">
              {estate.name}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-white/80 text-sm sm:text-base font-medium">
              <svg className="w-5 h-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{estate.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- MAIN BODY ---------------- */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content (Overview, Plan, FAQs) */}
            <div className="lg:col-span-8 space-y-12">
              {/* About Estate */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-5 pb-3 border-b border-border-light">
                  Estate Overview
                </h2>
                <p className="text-text-muted text-base leading-relaxed mb-6">
                  {estate.description}
                </p>

                {/* Features & Amenities grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                  {/* Estate Features */}
                  <div>
                    <h3 className="text-base font-bold text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-primary rounded-full" />
                      Infrastructure Features
                    </h3>
                    <ul className="space-y-3">
                      {estate.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-text-muted text-sm font-semibold">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estate Amenities */}
                  <div>
                    <h3 className="text-base font-bold text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-accent rounded-full" />
                      Estate Amenities
                    </h3>
                    <ul className="space-y-3">
                      {estate.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-text-muted text-sm font-semibold">
                          <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing & Plot Sizes Table */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6 pb-3 border-b border-border-light">
                  Available Plots & Sizing
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-xs font-bold uppercase tracking-wider text-text-light">
                        <th className="py-4 pr-4">Plot Size</th>
                        <th className="py-4 px-4">Dimension Status</th>
                        <th className="py-4 px-4 text-right">Pricing starting at</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light text-sm font-semibold text-text-muted">
                      {estate.plotSizes.map((size, idx) => (
                        <tr key={idx} className="hover:bg-surface/20 transition-colors">
                          <td className="py-4 pr-4 text-dark font-bold font-[family-name:var(--font-heading)] text-base">
                            {size}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/5 text-primary text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              Ready for allocation
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-dark font-extrabold text-base">
                            {/* Derive a dummy proportional pricing based on starting price */}
                            {formatCurrency(
                              estate.priceFrom * (1 + (parseInt(size) - 300) / 600)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gallery / Images Carousel */}
              <EstateGalleryCarousel images={estate.images} name={estate.name} />

              {/* FAQs Accordion */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6 pb-3 border-b border-border-light">
                  Frequently Asked Questions
                </h2>
                <FAQ faqs={estate.faqs} />
              </div>
            </div>

            {/* Right Sidebar (Pricing details, payment plan outline, Inquiry) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Payment Plans Card */}
              <div className="bg-dark text-white rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-5 pb-3 border-b border-white/10">
                  Flexible Payment Plans
                </h3>
                <div className="space-y-4">
                  {estate.paymentPlans.map((plan, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-primary-light uppercase tracking-wider">{plan.name}</span>
                        {plan.discount && (
                          <span className="text-[10px] bg-accent text-white px-2 py-0.5 rounded font-bold uppercase">
                            {plan.discount}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>Duration: {plan.duration}</span>
                        <span>Deposit: {plan.initialDeposit}</span>
                      </div>
                      {plan.monthlyPayment && (
                        <p className="text-xs text-white/50 mt-1.5 pt-1.5 border-t border-white/5">
                          {plan.monthlyPayment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Instant CTA */}
                <div className="mt-8 space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary-light text-white text-center py-3.5 rounded-xl font-bold block transition-all shadow-lg shadow-primary/10"
                  >
                    Discuss With Agent
                  </a>
                </div>
              </div>

              {/* Inquiry Form */}
              <ContactForm estate={estate.name} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
