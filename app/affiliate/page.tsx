"use client";

import { useState } from "react";
import { affiliatePackages } from "../lib/data";

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    channels: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", experience: "", channels: "" });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-surface/30 pt-28 pb-20">
      {/* ---------------- HERO HEADER ---------------- */}
      <section className="bg-dark text-white py-20 relative overflow-hidden mb-16">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-light mb-4">
            Earn With Us
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-[family-name:var(--font-heading)] leading-tight mb-6">
            Become an Edjay Realty Affiliate
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Partner with Southeast Nigeria&apos;s most trusted real estate brand. Earn premium commissions (up to 15%) by referring buyers to our verified estates.
          </p>
        </div>
      </section>

      {/* ---------------- PACKAGES / COMPARISON ---------------- */}
      <section className="container mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
            Select Your Partnership Tier
          </h2>
          <p className="text-text-muted text-sm sm:text-base">
            Whether you are just starting or have a professional network, we have packages tailored to maximize your earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {affiliatePackages.map((pkg, i) => {
            const isPro = pkg.name.includes("Pro");
            return (
              <div
                key={i}
                className={`rounded-2xl p-8 border flex flex-col h-full transition-all duration-300 ${
                  isPro
                    ? "bg-dark text-white border-primary shadow-xl shadow-primary/10 relative"
                    : "bg-white text-dark border-border/60 shadow-md"
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3.5 right-6 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-dark">
                    Recommended
                  </span>
                )}
                {/* Package Head */}
                <div className="mb-6 pb-6 border-b border-border/20">
                  <h3 className={`text-xl font-bold font-[family-name:var(--font-heading)] ${isPro ? "text-primary-light" : "text-dark"}`}>
                    {pkg.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-[family-name:var(--font-heading)]">{pkg.commission}</span>
                    <span className={`text-xs ${isPro ? "text-gray-400" : "text-text-muted"} font-semibold uppercase tracking-wider`}>Commission</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-6 flex-1 mb-8">
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPro ? "text-gray-300" : "text-text-light"}`}>
                      Package Perks
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={isPro ? "text-gray-250" : "text-text-muted"}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPro ? "text-gray-300" : "text-text-light"}`}>
                      Requirements
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPro ? "text-accent-light" : "text-accent"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={isPro ? "text-gray-250" : "text-text-muted"}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#register-form"
                  className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
                    isPro
                      ? "bg-primary hover:bg-primary-light text-white"
                      : "bg-dark hover:bg-dark-light text-white"
                  }`}
                >
                  Join as {pkg.name}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="bg-white border-y border-border/40 py-20 mb-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-dark mb-4">
              How Affiliate Marketing Works
            </h2>
            <p className="text-text-muted text-sm sm:text-base">
              Start earning immediately. We handle allocations, documentation, and client management while you collect commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register Free",
                desc: "Fill our simple online form below to create your affiliate profile.",
              },
              {
                step: "02",
                title: "Share Listings",
                desc: "Use our premium brochures, images, and videos to pitch to potential buyers.",
              },
              {
                step: "03",
                title: "Book Inspection",
                desc: "Schedule physical or virtual site visits for your client with our guides.",
              },
              {
                step: "04",
                title: "Collect Commission",
                desc: "Get paid instantly within 24 hours of client deposit validation.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <span className="text-6xl font-extrabold text-primary/10 font-[family-name:var(--font-heading)] block mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-dark mb-2 font-[family-name:var(--font-heading)]">
                  {step.title}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FORM SECTION ---------------- */}
      <section className="container mx-auto max-w-3xl" id="register-form">
        <div className="bg-white rounded-2xl p-8 border border-border/60 shadow-xl shadow-gray-100/50">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6 text-center">
            Affiliate Program Registration
          </h2>

          {status === "success" ? (
            <div className="bg-primary/10 border border-primary/20 text-primary p-8 rounded-xl text-center animate-scale-in">
              <svg className="w-16 h-16 mx-auto mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Application Received!</h3>
              <p className="text-sm opacity-85 leading-relaxed">
                Thank you for applying to the Edjay Realty affiliate program. Our onboarding coordinator will review your profile and contact you via email/phone within 48 hours to complete training.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="affiliate-name" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="affiliate-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chukwudi Emeka"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="affiliate-email" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="affiliate-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. chukwudi@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="affiliate-phone" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="affiliate-phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +234..."
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="affiliate-experience" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                  Real Estate Experience Tier
                </label>
                <select
                  id="affiliate-experience"
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none text-sm bg-white text-text-muted"
                >
                  <option value="">Select your experience level</option>
                  <option value="none">No experience (interested in free training)</option>
                  <option value="beginner">Beginner (1-2 years in sales/realty)</option>
                  <option value="intermediate">Intermediate (3-5 years professional experience)</option>
                  <option value="pro">Pro (5+ years / active agency broker)</option>
                </select>
              </div>

              {/* Marketing Channels */}
              <div>
                <label htmlFor="affiliate-channels" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                  How will you promote Edjay Realty estates?
                </label>
                <textarea
                  id="affiliate-channels"
                  name="channels"
                  required
                  rows={4}
                  value={formData.channels}
                  onChange={handleChange}
                  placeholder="e.g. Promoting to WhatsApp groups, Facebook ads, network of diaspora investors..."
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "submitting" ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Application...</span>
                  </>
                ) : (
                  <span>Register Now</span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
