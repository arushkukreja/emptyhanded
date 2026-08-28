import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://emptyhanded.app"),
  title: "EmptyHanded — Never show up empty handed",
  description: "Remember every occasion and get thoughtful, personalized gift ideas for the people in your life. Completely free during early access.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "EmptyHanded",
    title: "Never show up empty handed again.",
    description: "Remember every occasion and get thoughtful gift ideas before the day arrives."
  },
  twitter: {
    card: "summary_large_image",
    title: "Never show up empty handed again.",
    description: "Remember every occasion and get thoughtful gift ideas before the day arrives."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
