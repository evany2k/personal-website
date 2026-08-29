import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/data/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Evan Yatrou | Portfolio",
    template: "%s | Evan Yatrou",
  },
  description: "Software developer with a background in Environmental Science and Computer Science.",
  openGraph: {
    title: "Evan Yatrou | Portfolio",
    description: "Software developer with a background in Environmental Science and Computer Science.",
    siteName: "Evan Yatrou Portfolio",
    images: [
      {
        url: "/images/portfolio-website-image4.png",
        width: 1200,
        height: 630,
        alt: "Evan Yatrou - Portfolio Website Preview",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evan Yatrou | Portfolio",
    description: "Software developer with a background in Environmental Science and Computer Science.",
    images: ["/images/portfolio-website-image4.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="relative overflow-x-hidden min-h-full flex flex-col bg-[#F9F8F6] text-stone-800">

        {/* Subtle background decoration (Fixed to viewport so it never adds page scroll height) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-emerald-900/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-emerald-900/10 blur-3xl"></div>
        </div>

        <Navbar />

        {children}

        <Footer />

      </body>
    </html>
  );
}