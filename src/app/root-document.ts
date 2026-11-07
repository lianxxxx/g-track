import { Geist_Mono, Sora } from "next/font/google";
import localFont from "next/font/local";

/* Shared by the root layout and global-error.tsx, which replaces the layout and has to set up
   its own <html> with the same fonts and theme. */

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

export const htmlClassName = `${sora.variable} ${uncutSans.variable} ${geistMono.variable} h-full antialiased`;

/* Runs before first paint so a stored light theme doesn't flash dark. Dark is the default. */
export const themeInitScript = `try{if(localStorage.getItem("g-track-theme")==="light")document.documentElement.dataset.theme="light"}catch{}`;
