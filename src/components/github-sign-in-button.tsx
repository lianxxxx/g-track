"use client";

import { useEffect, useState } from "react";
import { FiGithub } from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

/** Starts the GitHub OAuth flow. On success the browser leaves for GitHub, so
 *  the pending state only needs to cover the round trip to our own API. */
type Props = {
  label: string;
  /** Where Better Auth sends the browser when GitHub returns an error (it appends ?error=...). */
  errorCallbackURL: string;
};

export function GitHubSignInButton({ label, errorCallbackURL }: Props) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  // Coming back from GitHub with the Back button restores this page from bfcache,
  // pending state included. Reset so the button is usable again.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setPending(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function signIn() {
    setPending(true);
    setFailed(false);
    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL,
    });
    if (error) {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-accent-primary text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-wait disabled:opacity-70"
      >
        <FiGithub className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        {pending ? "Heading to GitHub" : label}
      </button>
      {failed && (
        <p role="alert" className="text-sm text-state-error">
          Couldn&apos;t reach the sign-in service. Try again in a moment.
        </p>
      )}
    </div>
  );
}
