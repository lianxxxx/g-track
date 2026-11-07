import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/* A week that was going fine, then crashed: hatching that stays dense, then empty cells after
   the drop. Same cell styles as the 404 art. */
const crashedWeek = [1, 2, 3, 3, 0, 0, 0];
const cellStyle = [
  "border-brand-700",
  "border-brand-600",
  "border-brand-400 bg-[repeating-linear-gradient(135deg,var(--brand-400)_0_1px,transparent_1px_5px)]",
  "border-brand-50 bg-[repeating-linear-gradient(135deg,var(--brand-50)_0_1px,transparent_1px_3px)]",
];

/* Activity climbing for four days, then a straight drop to the floor. Straight segments on
   purpose: a crash shouldn't look smooth. */
const CELL = 30;
const crashLine = [28, 20, 12, 6, 40, 40, 40]
  .map((y, index) => `${index === 0 ? "M" : "L"} ${(index + 0.5) * CELL} ${y}`)
  .join(" ");

/** Pulls Next's short error reference (`digest`) off the thrown value, if it has one. */
function digestOf(error: unknown) {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const { digest } = error;
    if (typeof digest === "string") return digest;
  }
  return null;
}

type Props = {
  error: unknown;
  retry: () => void;
};

/** The 500 screen, shared by error.tsx and global-error.tsx. Shows a reference code, never the error itself. */
export function ErrorScreen({ error, retry }: Props) {
  const digest = digestOf(error);

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
              <path
                d={crashLine}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="grid grid-cols-7 justify-items-center">
              {crashedWeek.map((level, index) => (
                <span key={index} className={`h-6 w-6 rounded-md border ${cellStyle[level]}`} />
              ))}
            </div>
          </div>

          <p className="font-mono text-xs text-brand-400">500</p>
          <h1 className="mt-3 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Something broke <span className="italic">on our end.</span>
          </h1>
          <p className="mt-4 max-w-md text-pretty text-lg leading-8 text-brand-300">
            This page crashed while loading. Not your fault. Try again, or head home and come
            back in a bit.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="flex h-12 items-center rounded-full bg-accent-primary px-7 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Try again
            </button>
            <Link
              href="/"
              className="flex h-12 items-center rounded-full border border-glass-border px-7 text-sm font-medium text-brand-100 transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Back home
            </Link>
          </div>

          {digest && <p className="mt-8 font-mono text-xs text-brand-400">Ref: {digest}</p>}
        </div>
      </main>
    </>
  );
}
