import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "CBSM - Aplikasi Manajemen Breeding Kenari Yorkshire Terbaik",
  description:
    "CBSM (Canary Breeding System Management) adalah aplikasi manajemen breeding burung kenari Yorkshire. Catat dan kelola data ternak dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-arial">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CBSM Canary Breeding",
              "operatingSystem": "Android, iOS",
              "applicationCategory": "BusinessApplication, Utilities",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR",
              },
            }),
          }}
        />
        <Navbar />
        <Hero />
        {children}
        <Footer />
      </body>
    </html>
  );
}
