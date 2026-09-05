import type { Metadata } from "next";

import { ContributionGraph } from "@/components/contribution-graph";
import { FaqSection, faqs } from "@/components/faq-section";
import { ActivityPillRow, FloatingIcons } from "@/components/floating-icons";
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
        {/* Header is mt-6 + h-16 = 5.5rem; the hero fills the rest of the first viewport. */}
        <div className="relative flex min-h-[calc(100svh-5.5rem)] flex-col items-center justify-center px-6 py-12 sm:py-16">
          <FloatingIcons variant={2} />
          <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Your GitHub,{" "}
              <br className="hidden sm:inline" />
              but make it iconic.
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-8 text-brand-300">
              Start larping as the main character. Your commits, PRs, issues,
              and reviews, all glowing on one board.
            </p>
            <ContributionGraph />
            <ActivityPillRow className="md:hidden" />
          </div>
        </div>
        <PreviewSection />
        <HowItWorks />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
