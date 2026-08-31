import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { BrandMark } from "@/components/brand-logo";
import { GitHubSignInButton } from "@/components/github-sign-in-button";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to g-track with your GitHub account.",
  robots: { index: false, follow: false },
};

/** Sign up and log in are the same door: GitHub OAuth creates the account on first sign-in. */
export default async function LoginPage(props: PageProps<"/login">) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { error } = await props.searchParams;
  const githubFailed = error !== undefined;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-card border border-glass-border bg-glass p-8 backdrop-blur-xl">
        <Link
          href="/"
          className="inline-flex rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
        >
          <BrandMark size={48} />
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Welcome to g-track
        </h1>
        <p className="mt-2 leading-7 text-brand-300">
          Sign in or create your account with GitHub. One click, no forms.
        </p>

        {githubFailed && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-state-error/30 bg-state-error/10 px-4 py-3 text-sm text-state-error"
          >
            GitHub sign-in didn&apos;t go through. Give it another try.
          </p>
        )}

        <div className="mt-6">
          <GitHubSignInButton />
        </div>

        <p className="mt-6 text-xs leading-5 text-brand-300">
          We only read your activity, never your code.
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 flex items-center gap-2 rounded-full text-sm text-brand-300 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
      >
        <FiArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        Back to home
      </Link>
    </main>
  );
}
