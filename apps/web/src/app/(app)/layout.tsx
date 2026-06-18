"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAccount, signOut } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/profile", label: "Profile" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAccount().then((account) => {
      if (account) {
        setReady(true);
      } else {
        router.replace("/login");
      }
    });
  }, [router]);

  const handleSignOut = async () => {
    // Full-page redirect; Entra ID sends us back to /login.
    await signOut();
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-sm text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="bg-grid pointer-events-none absolute inset-0" />

      <aside className="relative z-10 flex w-56 flex-col border-r border-line">
        <div className="border-b border-line px-6 py-5">
          <span className="font-display text-sm font-extrabold tracking-[0.3em] text-foreground">
            ROCKETS
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                  active
                    ? "bg-accent-dim text-accent"
                    : "text-muted hover:bg-white/[0.04] hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <button
            onClick={handleSignOut}
            className="w-full rounded-md border border-line px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-12 sm:px-10">
        {children}
      </main>
    </div>
  );
}
