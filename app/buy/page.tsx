import { Suspense } from "react";
import { getEstates } from "../lib/db";
import BuyForm from "./BuyForm";

export const metadata = {
  title: "Buy Property | Edjay Realty",
  description: "Start your property purchase with Edjay Realty. Submit your buy request and our team will guide you.",
};

export default async function BuyPage() {
  const estates = await getEstates();

  return (
    <div className="min-h-screen bg-surface pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Secure Your Land Today
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
            Buy Now
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Ready to invest? Tell us which estate you&apos;re interested in and we&apos;ll handle the rest — from plot selection to documentation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="bg-white rounded-2xl border p-8 animate-pulse h-96" />}>
            <BuyForm estates={estates} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
