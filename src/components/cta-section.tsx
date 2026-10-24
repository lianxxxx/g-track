import Link from "next/link";

/* Same hatching as the bento's streak bar. */
const inkHatch =
  "bg-[repeating-linear-gradient(135deg,var(--brand-50)_0_1.5px,transparent_1.5px_6px)]";

/* A row of contribution cells, drawn like the hero graph; the middle one is solid ink and a size up: you. */
const spotlightRow = [0, 1, 0, 2, 0, 1, 3, -1, 3, 1, 0, 2, 0, 1, 0];
const spotlightCell = [
  "border border-brand-800",
  "border border-brand-600",
  `border border-brand-400 ${inkHatch}`,
  `border border-brand-50 ${inkHatch}`,
];

function SpotlightArt() {
  return (
    <div aria-hidden className="mt-10 flex items-center gap-1.5">
      {spotlightRow.map((level, index) =>
        level === -1 ? (
          <span key={index} className="mx-1 h-6 w-6 rounded-md bg-brand-50" />
        ) : (
          <span key={index} className={`h-4 w-4 rounded-[3px] ${spotlightCell[level]}`} />
        ),
      )}
    </div>
  );
}

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
        <SpotlightArt />

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
