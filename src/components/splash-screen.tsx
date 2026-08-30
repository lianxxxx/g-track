"use client";

import { useEffect, useState } from "react";

import { LoadingScreen } from "@/components/loading-screen";

const FADE_MS = 300;
/* Safety cap: leave even if load/fonts never settle (e.g. tab opened in the background). */
const MAX_WAIT_MS = 4000;

/** Full-page brand splash on a hard load of the landing page. Rendered on the server so it
 *  is already in place at first paint, then fades out as soon as the page is actually ready
 *  (window load + fonts). No artificial hold: on a fast connection it is only a brief flash. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"shown" | "leaving" | "done">("shown");

  useEffect(() => {
    let cancelled = false;
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          });
    const leave = () => {
      if (!cancelled) setPhase("leaving");
    };
    Promise.all([loaded, document.fonts.ready]).then(leave);
    const cap = setTimeout(leave, MAX_WAIT_MS);
    return () => {
      cancelled = true;
      clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const done = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(done);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden={phase === "leaving"}
      className={`fixed inset-0 z-[60] flex flex-col bg-brand-950 transition-opacity duration-300 ease-out motion-reduce:transition-none ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}
    >
      <LoadingScreen />
    </div>
  );
}
