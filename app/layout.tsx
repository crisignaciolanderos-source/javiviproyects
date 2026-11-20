import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "@/components/layout/whatsapp-float";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JAVIVI — Cosmética y ropa",
  description: "Tienda online JAVIVI: cosmética y ropa usada. Compra por WhatsApp. Envío en Chile.",
  openGraph: {
    title: "JAVIVI",
    description: "Cosmética y ropa usada. Compra por WhatsApp.",
    locale: "es_CL",
    type: "website",
  },
  other: {
    "cache-control": "no-store, no-cache, must-revalidate",
    pragma: "no-cache",
    expires: "0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "#0f0f1a" }}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}