"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiGithub,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

const AUTO_ADVANCE_MS = 4000;

/* Every panel fills the same box so switching steps never resizes the card. */
const PANEL = "flex min-h-[19rem] flex-col justify-center";

function SignInPanel() {
  return (
    <div className={`${PANEL} items-center gap-5 text-center`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-glass-border bg-glass text-brand-100">
        <FiGithub className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-semibold text-brand-50">Sign in to g-track</p>
        <p className="mt-1 text-sm text-brand-300">
          One click. No setup, no config file.
        </p>
      </div>
      <span className="flex h-11 w-full max-w-[17rem] items-center justify-center gap-2 rounded-full bg-accent-primary text-sm font-medium text-brand-950">
        <FiGithub className="h-4 w-4" strokeWidth={2} />
        Continue with GitHub
      </span>
      <p className="text-xs text-brand-300">
        Read-only access. Revoke it anytime.
      </p>
    </div>
  );
}

type SyncState = "done" | "active" | "pending";

const syncSteps: { label: string; state: SyncState }[] = [
  { label: "Authenticated as lianxxxx", state: "done" },
  { label: "Scanned 14 repositories", state: "done" },
  { label: "Pulling events", state: "active" },
  { label: "Building your board", state: "pending" },
];

/* Partial counts: these add up to the 624 already pulled. */
const syncCounts = [
  { label: "commits", value: "487", dot: "bg-event-commit" },
  { label: "pull requests", value: "82", dot: "bg-event-pr" },
  { label: "reviews", value: "55", dot: "bg-event-review" },
];

function StepIcon({ state }: { state: SyncState }) {
  if (state === "done") {
    return (
      <FiCheck
        className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent-primary"
        strokeWidth={3}
        aria-hidden
      />
    );
  }

  if (state === "active") {
    return (
      <FiRefreshCw
        className="mt-[3px] h-3.5 w-3.5 shrink-0 animate-spin text-accent-primary [animation-duration:2.4s] motion-reduce:animate-none"
        strokeWidth={2.5}
        aria-hidden
      />
    );
  }

  return (
    <span
      aria-hidden
      className="mt-[3px] h-3.5 w-3.5 shrink-0 rounded-full border border-glass-border"
    />
  );
}

function SyncPanel() {
  return (
    <div className={PANEL}>
      <div className="flex items-center gap-3">
        <p className="font-semibold text-brand-50">Syncing</p>
        <span className="ml-auto font-mono text-xs tabular-nums text-brand-300">
          624 / 1,024
        </span>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-glass-border">
        <div className="h-full w-1/3 rounded-full bg-accent-primary animate-sweep motion-reduce:animate-none" />
      </div>

      <div className="mt-6 flex flex-col gap-2.5 font-mono text-sm">
        {syncSteps.map((step) => (
          <div key={step.label} className="flex flex-col gap-2">
            <p
              className={`flex items-start gap-2.5 ${
                step.state === "pending" ? "text-brand-400" : "text-brand-200"
              }`}
            >
              <StepIcon state={step.state} />
              {step.label}
            </p>

            {step.state === "active" && (
              <div className="mb-0.5 ml-[7px] flex flex-col gap-2 border-l border-glass-border pl-5">
                {syncCounts.map((count) => (
                  <p key={count.label} className="flex items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${count.dot}`} />
                    <span className="text-brand-300">{count.label}</span>
                    <span className="ml-auto tabular-nums text-brand-100">
                      {count.value}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const boardStats = [
  { label: "events", value: "1,024" },
  { label: "day streak", value: "21" },
  { label: "busiest day", value: "Thu" },
];

function SlayPanel() {
  return (
    <div className={`${PANEL} items-center gap-6 text-center`}>
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary-soft text-accent-primary">
          <FiCheck className="h-6 w-6" strokeWidth={3} />
        </span>
        <div>
          <p className="font-semibold text-brand-50">Your board is live</p>
          <p className="mt-1 text-sm text-brand-300">
            14 repositories, 9 months of history
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {boardStats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-3xl font-semibold tracking-tight text-brand-50 tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-brand-300">{stat.label}</p>
          </div>
        ))}
      </div>

      <span className="flex h-11 w-full max-w-[17rem] items-center justify-center gap-2 rounded-full bg-accent-primary text-sm font-medium text-brand-950">
        Open your board
        <FiArrowRight className="h-4 w-4" strokeWidth={2} />
      </span>
    </div>
  );
}

type Step = {
  id: string;
  title: string;
  body: string;
  icon: ReactNode;
  panel: ReactNode;
};

const steps: Step[] = [
  {
    id: "sign-in",
    title: "Sign in",
    body: "GitHub OAuth, from the browser. That's it.",
    icon: <FiUser className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
    panel: <SignInPanel />,
  },
  {
    id: "sync",
    title: "Sync",
    body: "Commits, PRs, issues, and reviews pulled into one stream.",
    icon: <FiRefreshCw className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
    panel: <SyncPanel />,
  },
  {
    id: "slay",
    title: "Slay",
    body: "Your board appears, and it's been waiting for this moment.",
    icon: <FiBarChart2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
    panel: <SlayPanel />,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  /* Once the reader picks a step themselves, stop moving it under them. */
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % steps.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [pinned]);

  const activeStep = steps[active];

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
          One GitHub login and your board starts filling in. That&apos;s the
          whole tutorial.
        </p>

        <div className="mt-16 grid w-full gap-12 md:grid-cols-12 md:items-center">
          {/* Phone screens skip the mockup: the steps below already tell the story. */}
          <div className="hidden md:col-span-6 md:block">
            <div className="w-full rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl">
              <div
                key={activeStep.id}
                aria-hidden
                className="animate-fade-up motion-reduce:animate-none"
              >
                {activeStep.panel}
              </div>
            </div>
          </div>

          <ol className="md:col-span-6 md:max-w-xl md:pl-6">
            {steps.map((step, index) => {
              const isActive = index === active;
              return (
                <li key={step.id} className="flex gap-5">
                  <div aria-hidden className="flex flex-col items-center">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-glass text-brand-300 backdrop-blur-xl transition-colors ${
                        isActive
                          ? "md:border-accent-primary md:bg-accent-primary-soft md:text-accent-primary"
                          : ""
                      }`}
                    >
                      {step.icon}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="my-2 w-px flex-1 bg-glass-border" />
                    )}
                  </div>

                  <div className={index < steps.length - 1 ? "pb-10" : ""}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setActive(index);
                        setPinned(true);
                      }}
                      className="pt-2.5 text-left text-lg font-semibold text-brand-50 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
                    >
                      {step.title}
                    </button>
                    <p
                      className={`mt-2 leading-7 text-brand-300 transition-colors ${
                        isActive ? "md:text-brand-200" : ""
                      }`}
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
