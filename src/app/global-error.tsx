"use client";

import "./globals.css";
import { htmlClassName, themeInitScript } from "./root-document";
import { ErrorScreen } from "@/components/error-screen";

/** 500 for when the root layout itself fails. It replaces the layout, so it brings its own
 *  <html>, fonts, global CSS, and stored theme. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <head>
        <title>Something broke · g-track</title>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorScreen error={error} retry={retry} />
      </body>
    </html>
  );
}
