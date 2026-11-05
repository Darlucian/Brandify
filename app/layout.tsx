import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
  "https://brandify-jade.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brandify",
    template: "%s | Brandify",
  },
  description:
    "Create, organize, and manage personalized content ideas for your brand.",
  verification: { google: "Ys_N2WVFKsiFumAnme99I-4CT02iLqZl6uiNjLfZdOE" },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Brandify",
    title: "Brandify",
    description:
      "Create, organize, and manage personalized content ideas for your brand.",
    images: [
      {
        url: `${siteUrl}/brandify-og.png`,
        width: 1200,
        height: 630,
        alt: "Brandify",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandify",
    description:
      "Create, organize, and manage personalized content ideas for your brand.",
    images: [`${siteUrl}/brandify-og.png`],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased text-black`}
    >
      <body className="min-h-100dvh bg-gray-50">{children}
        <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}
