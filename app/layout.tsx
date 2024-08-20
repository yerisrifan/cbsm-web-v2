import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title:
    "CBSM - Aplikasi Manajemen Breeding Kenari Yorkshire | Pengelolaan Ternak Kenari Terbaik",
  description:
    "CBSM (Canary Breeding System Management) adalah aplikasi manajemen breeding kenari yang dirancang untuk membantu peternak dalam mengelola dan mencatat data breeding kenari Yorkshire dengan mudah dan efisien. Fitur utama CBSM meliputi pencatatan data kenari, manajemen pasangan, inkubasi telur, dan pengelolaan penjualan burung. Dapatkan analisis statistik mendalam berdasarkan tahun dan jenis kelamin, serta filter data berdasarkan pemilik. Dengan CBSM, optimalkan proses breeding kenari Anda dan tingkatkan keberhasilan ternak Anda. CBSM adalah solusi terbaik bagi peternak kenari yang ingin sukses dalam bisnis breeding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-arial">
        <Navbar />
        <Hero />
        {children}
        <Footer />
      </body>
    </html>
  );
}
