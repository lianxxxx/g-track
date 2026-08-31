import type { ReactNode } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

type Step = {
  title: string;
  body: string;
  color: string;
  icon: ReactNode;
};

const steps: Step[] = [
  {
    title: "Sign in",
    body: "GitHub OAuth, from the browser. That's it.",
    color: "text-brand-200",
    icon: <FiUser className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Sync",
    body: "Commits, PRs, issues, and reviews pulled into one stream.",
    color: "text-brand-200",
    icon: <FiRefreshCw className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Slay",
    body: "Your board appears, and it's been waiting for this moment.",
    color: "text-brand-200",
    icon: <FiBarChart2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
];

/* Decorative chart for the card: four weeks of daily bars, grouped by event type. */
const barGroups = [
  {
    label: "Commits",
    dot: "bg-event-commit",
    heights: [55, 70, 40, 85, 60, 95, 50, 75, 65, 90, 45, 80],
  },
  {
    label: "Pull requests",
    dot: "bg-event-pr",
    heights: [60, 35, 75, 50, 85, 45, 70, 55, 65],
  },
  {
    label: "Reviews",
    dot: "bg-event-review",
    heights: [40, 65, 50, 80, 55, 70, 60],
  },
];

const stats = [
  { label: "Total events", value: "1,024", marker: "border-event-commit" },
  { label: "This week", value: "48", marker: "border-event-pr" },
];

function BoardCard() {
  return (
    <div
      aria-hidden
      className="w-full rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass text-brand-200">
          <FiActivity className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-semibold text-brand-50">Activity overview</p>
          <p className="mt-0.5 text-sm text-brand-300">
            Commits, pull requests, and reviews from the last four weeks
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`border-l-2 pl-3 ${stat.marker}`}>
            <p className="text-xs text-brand-300">{stat.label}</p>
            <p className="mt-0.5 font-heading text-2xl font-semibold tracking-tight text-brand-50 tabular-nums">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-28 items-end gap-[3px]">
        {barGroups.flatMap((group) =>
          group.heights.map((height, index) => (
            <span
              key={`${group.label}-${index}`}
              style={{ height: `${height}%` }}
              className={`flex-1 rounded-t-[3px] ${group.dot}`}
            />
          )),
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {barGroups.map((group) => (
          <span
            key={group.label}
            className="flex items-center gap-2 text-xs text-brand-300"
          >
            <span className={`h-2 w-2 rounded-full ${group.dot}`} />
            {group.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <h2
          id="how-it-works-heading"
          className="max-w-xl text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Sign in. Sync. Slay.
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-center text-lg leading-8 text-brand-300">
          One GitHub login and your board starts filling in. That&apos;s the whole tutorial.
        </p>

        <div className="mt-16 grid w-full gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <BoardCard />
          </div>

          <ol className="md:col-span-6 md:max-w-xl md:pl-6">
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
      </div>
    </section>
  );
}
