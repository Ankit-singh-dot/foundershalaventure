import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("light scroll-smooth", "font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans bg-white text-slate-900 antialiased selection:bg-slate-900 selection:text-white`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
