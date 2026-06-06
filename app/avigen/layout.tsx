import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Genetika Kenari - Avigen Pro | CBSM",
  description: "Prediksi hasil persilangan warna, genotipe, fenotipe, dan tingkat keberhasilan breeding burung kenari Anda menggunakan kalkulator genetika Avigen Pro.",
};

export default function AvigenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
