import { SidebarLayout } from "@/components/SidebarLayout";
import { getSession } from "@/lib/auth";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://monivo.com"),
  title: "Monivo | Intelligent Financial Command Center",
  description:
    "Master your portfolio with Monivo. Real-time asset tracking, intelligent insights, and secure financial management for your personal wealth.",
  keywords: [
    "personal finance",
    "asset tracking",
    "wealth management",
    "financial dashboard",
    "portfolio tracker",
    "expense tracking",
  ],
  authors: [{ name: "Monivo Financial Systems" }],
  openGraph: {
    title: "Monivo | Intelligent Financial Command Center",
    description: "Master your portfolio with real-time tracking and insights.",
    url: "https://monivo.com",
    siteName: "Monivo",
    images: [
      {
        url: "/images/logo_monivo.png",
        width: 1200,
        height: 630,
        alt: "Monivo Financial Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monivo | Intelligent Financial Command Center",
    description: "Master your portfolio with real-time tracking and insights.",
    images: ["/images/logo_monivo.png"],
  },
  icons: {
    icon: "/images/icon_monivo.png",
    apple: "/images/icon_monivo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarLayout session={session}>{children}</SidebarLayout>
      </body>
    </html>
  );
}
