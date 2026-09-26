"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

type Props = {
  label?: string;
};

/** Runs a GitHub sync, then refreshes the server-rendered board. */
export function SyncButton({ label = "Sync now" }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function sync() {
    setPending(true);
    setFailed(false);

    try {
      const response = await fetch("/api/sync", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={sync}
        disabled={pending}
        className="flex h-11 items-center justify-center gap-2.5 rounded-full bg-accent-primary px-6 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-wait disabled:opacity-70"
      >
        <FiRefreshCw
          className={`h-4 w-4 ${pending ? "animate-spin" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
        {pending ? "Syncing" : label}
      </button>
      {failed && (
        <p role="alert" className="text-sm text-state-error">
          Couldn&apos;t reach GitHub. Try again in a moment.
        </p>
      )}
    </div>
  );
}
