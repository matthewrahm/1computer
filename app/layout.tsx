import type { Metadata } from "next";
import { Syne, Outfit, Space_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://1computer.lol"),
  title: "1 Computer, 1 Dream | $1COMPUTER on Solana",
  description:
    "They said you need connections. You need money. You need luck. All you needed was one computer. $1COMPUTER on Solana.",
  openGraph: {
    title: "1 Computer, 1 Dream | $1COMPUTER",
    description:
      "All it takes is one computer and a dream. $1COMPUTER on Solana.",
    images: [
      {
        url: "/images/1computer-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "1 Computer, 1 Dream — $1COMPUTER on Solana",
      },
    ],
    type: "website",
    siteName: "1 Computer 1 Dream",
  },
  twitter: {
    card: "summary_large_image",
    site: "@1Computer1Dream",
    title: "1 Computer, 1 Dream | $1COMPUTER",
    description:
      "All it takes is one computer and a dream. $1COMPUTER on Solana.",
    images: [
      {
        url: "/images/1computer-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "1 Computer, 1 Dream — $1COMPUTER on Solana",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} ${spaceMono.variable} ${cormorant.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
