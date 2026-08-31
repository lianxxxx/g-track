import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { site } from "@/lib/site";

/** Closing call to action plus sign-off: no border, no nav (the sticky header already
 *  carries it). Whitespace from the FAQ section above is the only separator. */
export function SiteFooter() {
  return (
    <footer className="px-6 pb-12 pt-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <Link
          href="/"
          className="flex items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
        >
          <BrandLogo />
        </Link>

        <p className="mt-3 text-sm text-brand-300">Your GitHub, but make it iconic.</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="flex h-11 items-center rounded-full bg-accent-primary px-6 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="flex h-11 items-center rounded-full border border-glass-border px-6 text-sm font-medium text-brand-100 transition-colors hover:border-brand-600 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
          >
            Log in
          </Link>
        </div>

        <p className="mt-10 text-xs text-brand-300">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
