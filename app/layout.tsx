import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GapScope — Competitor intelligence you can prove",
    template: "%s · GapScope",
  },
  description:
    "GapScope reads thousands of real reviews, searches, job posts and news stories about your competitors, then turns them into ranked opportunities and a plan you can act on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
