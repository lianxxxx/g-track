import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { BrandMark } from "@/components/brand-logo";
import { GitHubSignInButton } from "@/components/github-sign-in-button";

const copy = {
  login: {
    heading: "g-track",
    body: "Sign in or create your account with GitHub.",
    button: "Continue with GitHub",
    errorPath: "/login",
  },
  signup: {
    heading: "g-track",
    body: "One GitHub login and you're in.",
    button: "Sign up with GitHub",
    errorPath: "/signup",
  },
} as const;

type Props = {
  mode: keyof typeof copy;
  /** Present when GitHub bounced back with ?error=... */
  githubFailed: boolean;
};

/** Shared login / sign-up card. Both modes run the same GitHub OAuth flow;
 *  the account is created on first authorization. */
export function AuthCard({ mode, githubFailed }: Props) {
  const c = copy[mode];

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center rounded-card border border-glass-border bg-glass p-8 text-center backdrop-blur-xl">
        <Link
          href="/"
          className="inline-flex rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
        >
          <BrandMark size={48} />
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{c.heading}</h1>
        <p className="mt-2 leading-7 text-brand-300">{c.body}</p>

        {githubFailed && (
          <p
            role="alert"
            className="mt-5 w-full rounded-xl border border-state-error/30 bg-state-error/10 px-4 py-3 text-sm text-state-error"
          >
            GitHub sign-in didn&apos;t go through. Give it another try.
          </p>
        )}

        <div className="mt-6 w-full">
          <GitHubSignInButton label={c.button} errorCallbackURL={c.errorPath} />
        </div>

        {mode === "signup" ? (
          <p className="mt-4 text-xs leading-5 text-brand-300">
            No GitHub account yet?{" "}
            <a
              href="https://github.com/signup"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm text-brand-100 underline underline-offset-4 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Create one on GitHub
            </a>{" "}
            first.
          </p>
        ) : (
          <p className="mt-4 text-xs leading-5 text-brand-300">
            New here?{" "}
            <Link
              href="/signup"
              className="rounded-sm text-brand-100 underline underline-offset-4 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Sign up
            </Link>
          </p>
        )}

        {mode === "login" && (
          <p className="mt-3 text-xs leading-5 text-brand-300">
            We only read your activity, never your code.
          </p>
        )}
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
