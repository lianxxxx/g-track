import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { site } from "@/lib/site";

/** Sign-off only: no border, no nav (the sticky header already carries it), no button
 *  (the CTA section above is the closing call to action). */
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

        <p className="mt-3 text-sm text-brand-300">
          Your GitHub, but make it <span className="italic">iconic.</span>
        </p>

        <p className="mt-8 text-xs text-brand-300">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
