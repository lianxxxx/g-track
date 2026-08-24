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
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Track your developer activity, all in one place.
        </h1>
        <p className="max-w-md text-lg leading-8 text-brand-300">
          {site.description}
        </p>
        <div className="rounded-card border border-glass-border bg-glass p-8 backdrop-blur-xl">
          <p className="text-sm text-brand-300">
            Sign in with GitHub is coming next. This card is the glass surface
            the dashboard will be built from.
          </p>
          <a
            href="https://github.com/lianxxxx/g-track"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-accent-primary px-6 font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
