import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lawmwad Technologies & Industries",
  description: "Leading provider of AI-driven software and hardware solutions for businesses, schools, hospitals, and industries.",
  keywords: "AI solutions, software development, hardware innovations, school management, hospital management, e-commerce, IoT, Uganda tech company",
  authors: [{ name: "Lawmwad Technologies" }],
  creator: "Lawmwad Technologies",
  publisher: "Lawmwad Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lawmwad.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Lawmwad Technologies & Industries",
    description: "Leading provider of AI-driven software and hardware solutions for businesses, schools, hospitals, and industries.",
    url: 'https://lawmwad.vercel.app',
    siteName: 'Lawmwad Technologies',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lawmwad Technologies & Industries",
    description: "Leading provider of AI-driven software and hardware solutions for businesses, schools, hospitals, and industries.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'oHXlN8JZG9FhaQZ56_11F84FeGZYN4Iy6kPFWy68-kw',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
