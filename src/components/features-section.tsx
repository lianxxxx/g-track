import type { ReactNode } from "react";

import { cellColor } from "@/components/contribution-graph";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type FeedItem = {
  label: string;
  meta: string;
  color: string;
  icon: ReactNode;
};

const feedItems: FeedItem[] = [
  {
    label: "Pushed 3 commits to g-track",
    meta: "2h ago",
    color: "text-accent-primary",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" {...stroke} aria-hidden>
        <circle cx="12" cy="12" r="3.25" />
        <path d="M2.5 12h6.25" />
        <path d="M15.25 12h6.25" />
      </svg>
    ),
  },
  {
    label: "Merged #128 · activity sync",
    meta: "yesterday",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" {...stroke} aria-hidden>
        <circle cx="6" cy="5.5" r="2.25" />
        <circle cx="6" cy="18.5" r="2.25" />
        <circle cx="18" cy="18.5" r="2.25" />
        <path d="M6 7.75v8.5" />
        <path d="M12.5 5h3A2.5 2.5 0 0118 7.5v8.75" />
        <path d="M14.75 2.75L12.5 5l2.25 2.25" />
      </svg>
    ),
  },
  {
    label: "Reviewed #124 · heatmap colors",
    meta: "yesterday",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" {...stroke} aria-hidden>
        <path d="M12 5.25c-4.5 0-7.6 3.6-8.75 6.75C4.4 15.15 7.5 18.75 12 18.75s7.6-3.6 8.75-6.75C19.6 8.85 16.5 5.25 12 5.25z" />
        <circle cx="12" cy="12" r="2.75" />
      </svg>
    ),
  },
  {
    label: "Opened issue · streak badge",
    meta: "2d ago",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" {...stroke} aria-hidden>
        <circle cx="12" cy="12" r="8.25" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

/* 12 weeks x 7 days, dim -> bright levels for the mini heatmap preview. */
const miniLevels = (
  "0102103" + "2110114" + "2013011" + "2042301" +
  "1022013" + "4102110" + "3202011" + "0312401" +
  "1021013" + "0212041" + "0211013" + "1203210"
)
  .split("")
  .map(Number);

const weekBars = [
  { day: "M", height: "h-6", color: "bg-brand-600" },
  { day: "T", height: "h-10", color: "bg-brand-600" },
  { day: "W", height: "h-4", color: "bg-brand-600" },
  { day: "T", height: "h-14", color: "bg-accent-primary" },
  { day: "F", height: "h-8", color: "bg-brand-600" },
  { day: "S", height: "h-3", color: "bg-brand-600" },
  { day: "S", height: "h-11", color: "bg-brand-600" },
];

const card =
  "rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl transition-colors hover:border-brand-600";

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2
          id="features-heading"
          className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Built to make your work visible
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-brand-300">
          g-track turns scattered GitHub activity into one board you can
          actually read.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <article className={`${card} md:col-span-4`}>
            <h3 className="text-lg font-semibold text-brand-50">
              Every event, one feed
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-brand-300">
              Commits, pull requests, issues, and reviews are normalized into a
              single stream, so a day of work reads like one story instead of
              four tabs.
            </p>
            <ul aria-hidden className="mt-6 flex flex-col gap-2">
              {feedItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass px-3 py-2"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-glass-border bg-glass ${item.color}`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate text-sm text-brand-200">
                    {item.label}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-brand-400">
                    {item.meta}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className={`${card} md:col-span-2`}>
            <h3 className="text-lg font-semibold text-brand-50">
              A year on one board
            </h3>
            <p className="mt-2 text-sm leading-6 text-brand-300">
              Daily stats roll up into the heatmap, so streaks and quiet weeks
              are visible at a glance.
            </p>
            <div
              aria-hidden
              className="mt-6 grid w-fit max-w-full grid-flow-col grid-rows-7 gap-[3px] overflow-hidden"
            >
              {miniLevels.map((level, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-[3px] ${cellColor[level]}`}
                />
              ))}
            </div>
          </article>

          <article className={`${card} md:col-span-2`}>
            <h3 className="text-lg font-semibold text-brand-50">
              Connected in one click
            </h3>
            <p className="mt-2 text-sm leading-6 text-brand-300">
              Sign in with GitHub and authorize once. Your activity syncs
              through the API, with no webhooks and nothing to install.
            </p>
            <span
              aria-hidden
              className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border bg-glass text-accent-primary"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
                <path d="M9.5 14.5L4.75 19.25" />
                <path d="M13.75 3.75l6.5 6.5-3 3-6.5-6.5 3-3z" />
                <path d="M8.5 8.5l7 7" />
                <path d="M15.5 12.25l2.25 2.25" />
                <path d="M9.5 6.25L11.75 8.5" />
              </svg>
            </span>
          </article>

          <article className={`${card} md:col-span-4`}>
            <h3 className="text-lg font-semibold text-brand-50">
              The shape of your week
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-brand-300">
              Daily counts by event type become charts, so you can see when you
              ship, when you review, and when you plan.
            </p>
            <div aria-hidden className="mt-6 flex max-w-xs items-end gap-2">
              {weekBars.map((bar, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
                  <span
                    className={`w-full rounded-t ${bar.height} ${bar.color}`}
                  />
                  <span className="text-[10px] text-brand-500">{bar.day}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
