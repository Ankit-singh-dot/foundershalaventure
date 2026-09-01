import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Foundershala Ventures | Investment Banking & Valuation Advisory",
  description:
    "Institutional sell-side investment banking for growth-stage startups. AI valuation modeling, confidential information memorandum preparation, M&A advisory, and equity capital raising.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className={`${inter.variable} font-sans bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white`}>
        <SmoothScrollProvider>
          <Navbar />
          <main className="min-h-screen bg-white">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
