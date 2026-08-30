"use client";

import { useEffect, useState } from "react";

import { LoadingScreen } from "@/components/loading-screen";

/* Entrance animations finish around 850ms; hold a beat after, then fade to the hero. */
const HOLD_MS = 1500;
const FADE_MS = 400;

/** Full-page brand splash on a hard load of the landing page. Rendered on the server so it
 *  is already in place at first paint, then fades out and unmounts once the hold elapses. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"shown" | "leaving" | "done">("shown");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduceMotion ? 600 : HOLD_MS;
    const leave = setTimeout(() => setPhase("leaving"), hold);
    const done = setTimeout(() => setPhase("done"), hold + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, []);

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
      className={`fixed inset-0 z-[60] flex flex-col bg-brand-950 transition-opacity duration-400 ease-out motion-reduce:transition-none ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}
    >
      <LoadingScreen />
    </div>
  );
}
