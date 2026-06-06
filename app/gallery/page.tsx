import { getGalleryImages } from "../lib/db";
import GalleryGrid from "../components/GalleryGrid";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="min-h-screen bg-surface/30 pt-28 pb-20">
      {/* Header banner */}
      <section className="bg-dark text-white py-16 relative overflow-hidden mb-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-light mb-3">
            On-Site Development
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Our Media Gallery
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            See real-time progress on our project sites. Verified infrastructure work, layout designs, and client allocation ceremonies.
          </p>
        </div>
      </section>

      {/* Main Grid Container */}
      <div className="container mx-auto">
        <GalleryGrid images={images} />
      </div>
    </div>
  );
}
