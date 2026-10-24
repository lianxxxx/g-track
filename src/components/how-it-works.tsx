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
      <div className="mx-auto w-full max-w-5xl">
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
              {/* Path to the next step: a plain line down on phones, and on desktop the same ink
                  zigzag as the bento's Thursday chart. The last step is filled in like
                  the recap timeline's latest node, since that's where you end up. */}
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden
                    className="absolute -bottom-8 left-4 top-10 w-px bg-brand-600 md:hidden"
                  />
                  <span
                    aria-hidden
                    className="absolute top-1 right-[calc(-50%-0.5rem)] left-[calc(50%+1.5rem)] hidden h-6 text-brand-50 md:block"
                  >
                    <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                      <polyline
                        points="0,12 20,9 34,14 50,4 66,11 82,19 100,12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </span>
                </>
              )}
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border md:mx-auto ${
                  index === steps.length - 1
                    ? "border-brand-50 bg-brand-50 text-brand-950"
                    : "border-glass-border text-brand-300"
                }`}
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
