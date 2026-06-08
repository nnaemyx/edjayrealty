"use client";

import { useState } from "react";
import { buildWhatsAppUrl, navigateWhatsAppWindow } from "../lib/whatsapp";

interface ContactFormProps {
  estate?: string;
}

export default function ContactForm({ estate }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const estateName = estate || "General Inquiry";
    const whatsappMessage = [
      "Hello Edjay Realty, I submitted an inquiry:",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Estate/Interest: ${estateName}`,
      `Message: ${formData.message}`,
    ].join("\n");
    const waWindow = window.open("", "_blank");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estate: estateName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      navigateWhatsAppWindow(waWindow, whatsappMessage);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      waWindow?.close();
      console.error(error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-border/60 shadow-xl shadow-gray-50/50">
      <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-dark mb-6">
        Send Us a Message
      </h3>

      {status === "success" ? (
        <div className="bg-primary/10 border border-primary/20 text-primary p-6 rounded-xl text-center animate-scale-in">
          <svg className="w-12 h-12 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-lg font-bold mb-1">Message Sent Successfully!</h4>
          <p className="text-sm opacity-85">
            Your inquiry is saved. WhatsApp should have opened — tap send there to reach us directly. We will also follow up within 24 hours.
          </p>
          <a
            href={buildWhatsAppUrl(
              `Hello Edjay Realty, I submitted an inquiry about ${estate || "your properties"}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            Open WhatsApp
          </a>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 text-sm font-semibold underline hover:text-primary-dark transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" id="inquiry-form">
          {/* Name */}
          <div>
            <label htmlFor="form-name" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="form-name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300"
            />
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-email" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="form-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
            <div>
              <label htmlFor="form-phone" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="form-phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +234..."
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="form-message" className="block text-xs font-semibold uppercase tracking-wider text-text-light mb-2">
              How Can We Help You?
            </label>
            <textarea
              id="form-message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about the property or estate you are interested in..."
              className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-gray-300 resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-accent text-xs font-bold bg-accent/10 border border-accent/20 px-4 py-2.5 rounded-xl">
              An error occurred while submitting. Please check your network and try again.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending Message...</span>
              </>
            ) : (
              <span>Submit Inquiry</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
