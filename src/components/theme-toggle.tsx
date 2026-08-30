"use client";

import type { MouseEvent } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

/* Must match the key read by the theme init script in src/app/layout.tsx. */
const THEME_STORAGE_KEY = "g-track-theme";

function applyNextTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  if (next === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage unavailable (private mode, blocked); the toggle still works for this page.
  }
}

/* Reveals the new theme as a circle growing out of the toggle's icon.
   Uses the View Transitions API; browsers without it (or with reduced motion) switch instantly.
   The matching CSS lives in globals.css (::view-transition-*(root)). */
function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof document.startViewTransition !== "function" || reduceMotion) {
    applyNextTheme();
    return;
  }

  // The icon is centered in the button, so the button's center is the icon's center.
  const rect = event.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  // Distance from the icon to the farthest viewport corner, so the circle ends up covering everything.
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(applyNextTheme);
  transition.ready
    .then(() => {
      const reveal = document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "ease-in", pseudoElement: "::view-transition-new(root)" },
      );
      // Hold the circle at 0 until the first snapshot frame has painted. That frame is slow on
      // this page, and an animation clocked from `ready` would already be well past the icon
      // by the time anything shows on screen.
      reveal.pause();
      requestAnimationFrame(() => reveal.play());
    })
    .catch(() => {
      // Transition was skipped (hidden tab, another transition started); the theme is already applied.
    });
}

/** Icon and accessible name switch via the `light:` variant, so SSR markup matches whatever theme is stored. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass text-brand-100 transition-colors hover:border-brand-600 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
    >
      <FiSun className="h-4.5 w-4.5 light:hidden" strokeWidth={1.75} aria-hidden />
      <FiMoon className="hidden h-4.5 w-4.5 light:block" strokeWidth={1.75} aria-hidden />
      <span className="sr-only light:hidden">Switch to light theme</span>
      <span className="sr-only hidden light:inline">Switch to dark theme</span>
    </button>
  );
}
