import { FiChevronDown } from "react-icons/fi";

/** Single source for the FAQ content; page.tsx derives FAQPage JSON-LD from it. */
export const faqs = [
  {
    question: "Does g-track read my code?",
    answer:
      "No, and honestly, why would we? Nobody's checking your AI-generated code, bro. We only log that you pushed, opened, merged, or reviewed something. The files stay on GitHub. Keep larping, keep committing.",
  },
  {
    question: "What activity does g-track show?",
    answer:
      "Everything you do on GitHub that counts as work: commits, pull requests, issues, and code reviews. Each one becomes an event on your board and feeds your daily stats.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. g-track runs in the browser. Sign in with GitHub, authorize once, and syncing happens server-side from then on.",
  },
  {
    question: "Is my dashboard public?",
    answer:
      "No. Your dashboard sits behind your sign-in and search engines are told not to index it. Only the marketing pages are public.",
  },
  {
    question: "Can I track more than GitHub?",
    answer:
      "GitHub is the first source. Activity is stored in a normalized event model, so more sources can feed the same board later.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2
          id="faq-heading"
          className="text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Things people ask before they commit
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-center text-lg leading-8 text-brand-300">
          No, we don&apos;t read your code. Yes, it&apos;s free to look.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group rounded-card border border-glass-border bg-glass px-6 py-5 backdrop-blur-xl transition-colors open:border-brand-600 hover:border-brand-600"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left font-medium text-brand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary [&::-webkit-details-marker]:hidden">
                {faq.question}
                <FiChevronDown
                  className="h-4 w-4 shrink-0 text-brand-300 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </summary>
              <p className="mt-3 pr-8 leading-7 text-brand-300">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
