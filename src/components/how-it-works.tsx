import type { IconType } from "react-icons";
import { FiBarChart2, FiRefreshCw, FiUser } from "react-icons/fi";

const steps: { title: string; body: string; icon: IconType }[] = [
  {
    title: "Sign in",
    body: "GitHub OAuth, from the browser. That's it.",
    icon: FiUser,
  },
  {
    title: "Sync",
    body: "Commits, PRs, issues, and reviews pulled into one stream.",
    icon: FiRefreshCw,
  },
  {
    title: "Slay",
    body: "Your board appears, and it's been waiting for this moment.",
    icon: FiBarChart2,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <h2
            id="how-it-works-heading"
            className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Sign in. Sync. <span className="italic">Slay.</span>
          </h2>
          <p className="mt-4 max-w-md text-pretty text-lg leading-8 text-brand-300">
            One GitHub login and your board starts filling in. That&apos;s the
            whole tutorial.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex gap-4 md:block">
              {/* Timeline to the next step: down the left on phones, across on desktop. */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-8 left-4 top-10 w-px bg-glass-border md:bottom-auto md:left-[calc(50%+1.5rem)] md:right-[calc(-50%-0.5rem)] md:top-4 md:h-px md:w-auto"
                />
              )}
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-border text-brand-300 md:mx-auto"
              >
                <step.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="md:mt-6 md:text-center">
                <h3 className="pt-1 font-medium text-brand-50 md:pt-0">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-brand-300">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
