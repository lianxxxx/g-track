import type { ReactNode } from "react";
import { FiBarChart2, FiRefreshCw, FiUser } from "react-icons/fi";

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
    icon: <FiUser className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "g-track syncs your activity",
    body: "Commits, pull requests, issues, and reviews are pulled through the GitHub API and normalized into a single event stream.",
    color: "text-brand-200",
    icon: <FiRefreshCw className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Your board lights up",
    body: "The heatmap and charts are built from your daily activity, and keep filling in as you work.",
    color: "text-accent-primary",
    icon: <FiBarChart2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
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
