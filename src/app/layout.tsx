import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mosėdžio kavinė",
  description: "Mosėdžio kavinė. Grill patikalai, pietūs, maitas išsinešimui.",
  creator: "Vilius Valinskis",
  keywords: ["Mosėdžio kavinė", "Mosėdis", "kavinė", "restoranas", "maistas", "kavinė mosėdyje", "kavinė skuodė", "maistas išsinešimui", "maitas į namus", "mosedžio kavinė", "mosedžio kavinė", "mosedžio restoranas", "restaurant in mosėdis", "restaurant"],
};

export async function generateStaticParams() {
  return [{ lang: "lt" }, { lang: "en" }, { lang: "lv" }, { lang: "de" }, { lang: "ru" }];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${garamond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
