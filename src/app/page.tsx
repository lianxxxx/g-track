import { ContributionGraph } from "@/components/contribution-graph";
import { FloatingIcons } from "@/components/floating-icons";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  description: site.description,
  url: site.url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <FloatingIcons />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Every commit counts.
        </h1>
        <p className="max-w-lg text-lg leading-8 text-brand-300">
          Connect your GitHub and watch your activity light up the board.
          Commits, PRs, issues, and reviews, all in one place.
        </p>
        <ContributionGraph />
      </main>
      </div>
    </>
  );
}
