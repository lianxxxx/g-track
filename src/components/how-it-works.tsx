import type { ReactNode } from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type Step = {
  title: string;
  body: string;
  color: string;
  icon: ReactNode;
};

const steps: Step[] = [
  {
    title: "Sign in with GitHub",
    body: "One OAuth authorization, straight from the browser. No tokens to paste, nothing to install.",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
        <circle cx="12" cy="8.5" r="3.75" />
        <path d="M5.25 19.5c1.4-2.9 3.9-4.25 6.75-4.25s5.35 1.35 6.75 4.25" />
      </svg>
    ),
  },
  {
    title: "g-track syncs your activity",
    body: "Commits, pull requests, issues, and reviews are pulled through the GitHub API and normalized into a single event stream.",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
        <path d="M19.25 12a7.25 7.25 0 01-12.7 4.8" />
        <path d="M4.75 12a7.25 7.25 0 0112.7-4.8" />
        <path d="M19.25 4.5v2.9h-2.9" />
        <path d="M4.75 19.5v-2.9h2.9" />
      </svg>
    ),
  },
  {
    title: "Your board lights up",
    body: "The heatmap and charts are built from your daily activity, and keep filling in as you work.",
    color: "text-accent-primary",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
        <path d="M4.5 20v-5" />
        <path d="M9.5 20V9.5" />
        <path d="M14.5 20v-8" />
        <path d="M19.5 20V4.5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2
            id="how-it-works-heading"
            className="max-w-md text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            From sign-in to a living board
          </h2>
          <p className="mt-4 max-w-md text-lg leading-8 text-brand-300">
            Three steps, no setup. The board starts filling from your first
            sync.
          </p>
        </div>

        <ol className="md:col-span-7 md:max-w-xl">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <div aria-hidden className="flex flex-col items-center">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass backdrop-blur-xl ${step.color}`}
                >
                  {step.icon}
                </span>
                {index < steps.length - 1 && (
                  <span className="my-2 w-px flex-1 bg-glass-border" />
                )}
              </div>
              <div className={index < steps.length - 1 ? "pb-10" : ""}>
                <h3 className="pt-2.5 text-lg font-semibold text-brand-50">
                  {step.title}
                </h3>
                <p className="mt-2 leading-7 text-brand-300">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
