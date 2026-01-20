import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Lawmwad Technologies | Software Solutions for Africa",
    template: "%s | Lawmwad Technologies",
  },
  description: "Building innovative software solutions for African businesses. From school management to fleet tracking, we create technology that works offline-first and integrates with local payment systems.",
  keywords: [
    "software development Uganda",
    "school management system Africa",
    "fleet tracking system",
    "mobile app development",
    "enterprise software",
    "offline-first applications",
    "mobile money integration",
    "web development Uganda",
    "Lawmwad Technologies"
  ],
  authors: [{ name: "Lawmwad Technologies" }],
  creator: "Lawmwad Technologies",
  publisher: "Lawmwad Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lawmwad.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Lawmwad Technologies | Software Solutions for Africa",
    description: "Building innovative software solutions for African businesses. From school management to fleet tracking, we create technology that works offline-first.",
    url: 'https://lawmwad.com',
    siteName: 'Lawmwad Technologies',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/1000050622.png',
        width: 512,
        height: 512,
        alt: 'Lawmwad Technologies Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lawmwad Technologies | Software Solutions for Africa",
    description: "Building innovative software solutions for African businesses.",
    images: ['/1000050622.png'],
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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
