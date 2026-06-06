import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  title: {
    default: "Edjay Realty | Premium Real Estate Investment in Nigeria",
    template: "%s | Edjay Realty",
  },
  description:
    "Invest in prime Nigerian real estate with confidence. Discover premium lands, estates, and investment opportunities designed to secure your future. Trusted by 1,200+ happy clients.",
  keywords: [
    "Real Estate Nigeria",
    "Land for Sale",
    "Property Investment",
    "Buy Land in Nigeria",
    "Estates for Sale",
    "Edjay Realty",
    "Anambra Real Estate",
    "Abuja Property",
  ],
  openGraph: {
    title: "Edjay Realty | Premium Real Estate Investment in Nigeria",
    description:
      "Discover premium lands, estates, and investment opportunities designed to secure your future.",
    type: "website",
    locale: "en_NG",
    siteName: "Edjay Realty",
  },
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: "var(--font-body)" }}>
        {!isAdmin && <Header />}
        <main className="flex-1 flex flex-col">{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
      </body>
    </html>
  );
}
