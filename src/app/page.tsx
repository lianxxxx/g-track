import type { Metadata } from "next";
import Link from "next/link";

import { ContributionGraph } from "@/components/contribution-graph";
import { CtaSection } from "@/components/cta-section";
import { FaqSection, faqs } from "@/components/faq-section";
import { HowItWorks } from "@/components/how-it-works";
import { PreviewSection } from "@/components/preview/preview-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SplashScreen } from "@/components/splash-screen";
import { site } from "@/lib/site";

/** Canonical lives here, not in the root layout, so noindex pages (login, dashboard) don't inherit it. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  url: site.url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <>
      <SplashScreen />
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="flex-1">
        <div className="px-6 pb-12 pt-14 sm:pt-20">
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-brand-50 sm:text-5xl lg:whitespace-nowrap">
              Your GitHub, but make it{" "}
              <span className="italic">iconic.</span>
            </h1>

            <p className="mt-6 max-w-md text-pretty text-base leading-7 text-brand-300 sm:text-lg sm:leading-8">
              You&apos;re the main character. Act like it. Your commits, PRs,
              issues, and reviews, all glowing on one board.
            </p>

            <Link
              href="/login"
              className="mt-9 flex h-12 items-center rounded-full bg-accent-primary px-7 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Start larping
            </Link>

            <div className="mt-16 w-full max-w-4xl sm:mt-20">
              <ContributionGraph />
            </div>
          </div>
        </div>
        <PreviewSection />
        <HowItWorks />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
