"use client";

import type { MouseEvent } from "react";

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

/* Both icons stay mounted and stacked so they can rotate and scale past each other. */
const ICON_CLASS =
  "absolute h-4.5 w-4.5 transition-[rotate,scale,opacity] duration-300 ease-out motion-reduce:transition-none";

/** Icon and accessible name switch via the `light:` variant, so SSR markup matches whatever theme is stored. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-100 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
    >
      {/* Hand-built like the moon: the Feather sun, its disc hatched on the lower half. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${ICON_CLASS} light:-rotate-90 light:scale-0 light:opacity-0`}
        aria-hidden
      >
        <defs>
          <pattern
            id="sun-hatch"
            width={3}
            height={3}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={3} strokeWidth={1} />
          </pattern>
          <clipPath id="sun-half">
            <rect x={0} y={12} width={24} height={12} />
          </clipPath>
        </defs>
        <circle cx={12} cy={12} r={5} fill="url(#sun-hatch)" stroke="none" clipPath="url(#sun-half)" />
        <circle cx={12} cy={12} r={5} />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Hand-built (react-icons has no hatched moon): the Feather crescent, filled with the
          same diagonal hatching as the landing page line art. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${ICON_CLASS} rotate-90 scale-0 opacity-0 light:rotate-0 light:scale-100 light:opacity-100`}
        aria-hidden
      >
        <defs>
          <pattern
            id="moon-hatch"
            width={3}
            height={3}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={3} stroke="currentColor" strokeWidth={1} />
          </pattern>
          {/* Hatch only the lower half, like a partly filled streak bar. */}
          <clipPath id="moon-half">
            <rect x={0} y={12} width={24} height={12} />
          </clipPath>
        </defs>
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          fill="url(#moon-hatch)"
          clipPath="url(#moon-half)"
        />
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only light:hidden">Switch to light theme</span>
      <span className="sr-only hidden light:inline">Switch to dark theme</span>
    </button>
  );
}
