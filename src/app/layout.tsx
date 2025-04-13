import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// allow zooming out
export const metadata: Metadata = {
  title: "Mosėdžio kavinė",
  description: "Mosėdžio kavinė. Grill patikalai, pietūs, maitas išsinešimui.",
  // viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes",
  creator: "Vilius Valinskis",
  keywords: ["Mosėdžio kavinė", "Mosėdis", "kavinė", "restoranas", "maistas", "kavinė mosėdyje", "kavinė skuodė", "maistas išsinešimui", "maistas į namus", "mosedžio kavinė", "mosedžio kavinė", "mosedžio restoranas", "restaurant in mosėdis", "restaurant"],
};

export async function generateStaticParams() {
  return [{ lang: 'lt' }, { lang: 'en' }]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
