"use client";

import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-logo";
import { inkHatch } from "@/components/stat-charts";

type Props = {
  /** The page is ready: the bar snaps to full. Without it (route loading.tsx) the screen just
   *  unmounts when the segment streams in, wherever the bar got to. */
  done?: boolean;
};

/* Brand loading state: mark, hatched progress bar, and tagline fade up together.
   Used by the route-level loading.tsx fallback and by the first-load splash on the landing page. */
export function LoadingScreen({ done = false }: Props) {
  // Starts empty, then one frame later eases toward 90%: fast at first, slowing the longer the
  // wait, like a real progress bar. `done` interrupts that and runs the rest quickly, so a fast
  // load gets a fast bar.
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const width = done ? "100%" : started ? "90%" : "0%";

  return (
    <div
      role="status"
      aria-label="Loading g-track"
      className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <div className="animate-fade-up motion-reduce:animate-none">
        <BrandMark size={56} />
      </div>
      {/* The streak bar from the landing bento, filling with hatching. */}
      <div
        aria-hidden="true"
        className="animate-fade-up relative h-4 w-32 rounded-md border border-brand-50 motion-reduce:animate-none"
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-l-md transition-[width] motion-reduce:transition-none ${
            done ? "duration-200 ease-out" : "duration-[4s] ease-[cubic-bezier(0.1,0.8,0.2,1)]"
          } ${inkHatch}`}
          style={{ width }}
        />
      </div>
      <p className="animate-fade-up text-sm text-brand-300 motion-reduce:animate-none">
        Your GitHub, but make it iconic.
      </p>
    </div>
  );
}
