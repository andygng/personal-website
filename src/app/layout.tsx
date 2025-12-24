import type { Metadata } from "next";
import { Fraunces, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const normalizedSiteUrl = siteUrl
  ? siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
    ? siteUrl
    : `https://${siteUrl}`
  : undefined;

export const metadata: Metadata = {
  title: "Anderson Ng",
  description: "Designing thoughtful products and playful tools.",
  metadataBase: normalizedSiteUrl ? new URL(normalizedSiteUrl) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-deep">
      <body
        className={`${fraunces.variable} ${splineMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
