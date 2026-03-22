import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeScript }   from "@/components/theme-script";
import { DarkModeSync }  from "@/components/dark-mode-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataMind AI — Natural Language Analytics for Any Business",
  description:
    "Connect your data. Ask anything. Take action. AI-powered analytics that works for banks, hospitals, e-commerce, NGOs, HR teams and more.",
  openGraph: {
    title: "DataMind AI — Natural Language Analytics for Any Business",
    description: "Connect your data. Ask anything. Take action.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <DarkModeSync />
        {children}
      </body>
    </html>
  );
}
