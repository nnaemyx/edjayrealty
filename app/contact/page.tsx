import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface/30 pt-28 pb-20">
      {/* ---------------- HERO HEADER ---------------- */}
      <section className="bg-dark text-white py-16 relative overflow-hidden mb-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        </div>
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-light mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Contact Edjay Realty
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Have questions about estate layouts, inspections, or customized payment structures? We are here to help.
          </p>
        </div>
      </section>

      {/* ---------------- CONTENT ---------------- */}
      <section className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Office info & Working hours & Maps */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Cards */}
            <div className="space-y-4">
              {[
                {
                  title: "Head Office Address",
                  value: "Awka, Anambra State, Nigeria",
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                },
                {
                  title: "Phone Lines",
                  value: "+234 806 563 8548",
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                },
                {
                  title: "Support Email",
                  value: "info@edjayrealty.com",
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-border/40 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-sm">{item.title}</h4>
                    <p className="text-text-muted text-sm mt-0.5 leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Working Hours */}
            <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-dark flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Office Hours
              </h3>
              <div className="space-y-2 text-sm font-semibold text-text-muted divide-y divide-border-light">
                <div className="flex justify-between py-2">
                  <span>Monday - Friday</span>
                  <span className="text-dark">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Saturday</span>
                  <span className="text-dark">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2 text-accent">
                  <span>Sunday</span>
                  <span>Closed (Inspections by Bookings only)</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/40 shadow-md">
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

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
