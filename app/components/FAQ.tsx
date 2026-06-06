"use client";

import { useState } from "react";
import { FAQ as FAQType } from "../lib/data";

interface FAQProps {
  faqs: FAQType[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto" id="faq-accordion">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            {/* Header / Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 text-left font-semibold text-dark hover:text-primary transition-colors gap-4"
              aria-expanded={isOpen}
            >
              <span className="font-[family-name:var(--font-heading)] text-base sm:text-lg">
                {faq.question}
              </span>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface hover:bg-primary/10 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isOpen ? "rotate-185 text-primary" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Answer Content */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[500px] border-t border-border-light" : "max-h-0"
              }`}
            >
              <div className="p-5 text-sm sm:text-base text-text-muted leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
