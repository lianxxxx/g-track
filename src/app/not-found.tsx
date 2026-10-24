import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/* A week that fades out, drawn like the landing art: hatching that thins day by day,
   then a dashed square where today's contribution should be. -1 marks that missing day. */
const fadingWeek = [3, 3, 2, 1, 1, 0, -1];
const cellStyle = [
  "border-brand-700",
  "border-brand-600",
  "border-brand-400 bg-[repeating-linear-gradient(135deg,var(--brand-400)_0_1px,transparent_1px_5px)]",
  "border-brand-50 bg-[repeating-linear-gradient(135deg,var(--brand-50)_0_1px,transparent_1px_3px)]",
];

/* Activity curve over the same week (one point per cell), sliding down into a flatline. */
const CELL = 30;
const curvePoints = [6, 10, 16, 26, 30, 38, 38].map((y, index) => ({ x: (index + 0.5) * CELL, y }));
/* Smooth curve through the points (Catmull-Rom turned into cubic Béziers), like the Busiest day chart. */
const flatline = curvePoints.reduce((path, current, index) => {
  if (index === 0) return `M ${current.x} ${current.y}`;
  const p0 = curvePoints[index - 2] ?? curvePoints[index - 1];
  const p1 = curvePoints[index - 1];
  const p3 = curvePoints[index + 1] ?? current;
  const c1 = `${(p1.x + (current.x - p0.x) / 6).toFixed(2)} ${(p1.y + (current.y - p0.y) / 6).toFixed(2)}`;
  const c2 = `${(current.x - (p3.x - p1.x) / 6).toFixed(2)} ${(current.y - (p3.y - p1.y) / 6).toFixed(2)}`;
  return `${path} C ${c1} ${c2} ${current.x} ${current.y}`;
}, "");

/** Root 404: also catches unmatched URLs. Its own slim header, since the landing nav links are page anchors. */
export default function NotFound() {
  return (
    <>
      <header className="mt-6 px-6">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
          >
            <BrandLogo />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center px-6 py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div aria-hidden className="mb-10 flex w-[210px] flex-col gap-3 text-brand-50">
            <svg viewBox={`0 0 ${CELL * 7} 44`} className="w-full overflow-visible">
              <path d={flatline} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
            <div className="grid grid-cols-7 justify-items-center">
              {fadingWeek.map((level, index) => (
                <span
                  key={index}
                  className={`h-6 w-6 rounded-md border ${
                    level === -1 ? "border-dashed border-brand-50" : cellStyle[level]
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="font-mono text-xs text-brand-400">404</p>
          <h1 className="mt-3 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Zero contributions <span className="italic">here.</span>
          </h1>
          <p className="mt-4 max-w-md text-pretty text-lg leading-8 text-brand-300">
            Nothing was ever pushed to this page. Head back before your streak
            notices.
          </p>

          <Link
            href="/"
            className="mt-9 flex h-12 items-center rounded-full bg-accent-primary px-7 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            Back home
          </Link>
        </div>
      </main>
    </>
  );
}
