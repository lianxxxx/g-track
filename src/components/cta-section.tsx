import Link from "next/link";

/** Closing pitch after the FAQ: the last push before the footer. */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="px-6 py-24 sm:py-28">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <h2
          id="cta-heading"
          className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Go be the main <span className="italic">character.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-8 text-brand-300">
          You already did the hard part. g-track just makes it look iconic.
        </p>

        <Link
          href="/login"
          className="mt-9 flex h-12 items-center rounded-full bg-accent-primary px-7 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        >
          Start larping
        </Link>
      </div>
    </section>
  );
}
