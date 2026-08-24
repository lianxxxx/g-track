import type { Metadata } from "next";
import { Geist_Mono, Sora } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const uncutSans = localFont({
  src: [
    { path: "./fonts/UncutSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/UncutSans-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-uncut-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${uncutSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
