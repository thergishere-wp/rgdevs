import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RG Devs — Web Platforms Built Different",
  description:
    "We build custom web platforms, ERP systems, dashboards, and booking apps. From $20/month. First month free.",
  keywords: [
    "web development",
    "web platforms",
    "ERP systems",
    "dashboards",
    "booking systems",
    "client portals",
  ],
  openGraph: {
    title: "RG Devs — Web Platforms Built Different",
    description:
      "Custom web platforms from $20/month. Built fast, built right.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('rg-theme');
                if (t) document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-barlow antialiased">{children}</body>
    </html>
  );
}
