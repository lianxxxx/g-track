"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const { error } = await authClient.signOut();
    if (error) {
      // Session is still valid; re-enable the button so the user can retry.
      setPending(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="flex h-10 items-center rounded-full border border-glass-border px-5 text-sm font-medium text-brand-100 transition-colors hover:border-brand-600 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Signing out" : "Sign out"}
    </button>
  );
}
