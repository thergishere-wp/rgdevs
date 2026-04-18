import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RG Devs — Built by AI. Delivered fast.",
  description:
    "AI-powered web & mobile development studio. Bangkok, Thailand. Serving businesses, founders, and startups worldwide. From $25/month. First month free.",
  keywords: [
    "web development",
    "AI development",
    "mobile apps",
    "Bangkok",
    "Thailand",
    "subscription",
    "Next.js",
    "React Native",
  ],
  openGraph: {
    title: "RG Devs — Built by AI. Delivered fast.",
    description:
      "AI-native dev studio. Marketing sites, e-commerce, platforms, mobile apps. From $25/month.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
