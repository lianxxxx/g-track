"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

type Props = {
  name: string;
  email: string;
  image: string | null;
};

/** Avatar trigger with the account actions tucked into a dropdown, so the
 *  header stays down to a theme toggle and one control. */
export function UserMenu({ name, email, image }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    // pointerdown rather than click, so the menu closes before the press lands
    // on whatever is underneath it.
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  async function signOut() {
    setPending(true);
    const { error } = await authClient.signOut();
    if (error) {
      // Session is still valid; re-enable the item so the user can retry.
      setPending(false);
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-full border border-glass-border bg-glass py-1 pl-1 pr-3 transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-accent-primary"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-medium text-brand-100"
          >
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="hidden text-sm text-brand-100 sm:inline">{name}</span>
        {/* The name carries the accessible name from sm up; below that it is display:none. */}
        <span className="sr-only sm:hidden">Account menu</span>
        <FiChevronDown
          className={`h-4 w-4 shrink-0 text-brand-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-12 z-50 w-56 rounded-card border border-glass-border bg-brand-900 p-2 light:bg-brand-950"
        >
          <div className="border-b border-glass-border px-3 pb-3 pt-2">
            <p className="truncate text-sm font-medium text-brand-50">{name}</p>
            <p className="mt-0.5 truncate text-xs text-brand-300">{email}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            disabled={pending}
            className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-brand-100 transition-colors hover:bg-glass hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary disabled:cursor-wait disabled:opacity-70"
          >
            <FiLogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {pending ? "Signing out" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
