"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initAuth, signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth().then((account) => {
      if (account) {
        router.replace("/profile");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  const handleSignIn = async () => {
    setError(null);
    setBusy(true);
    try {
      // Full-page redirect to Entra ID; we come back on "/".
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="glow pointer-events-none absolute inset-0" />

      <header className="rise relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-sm font-extrabold tracking-[0.3em] text-foreground">
          ROCKETS
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          <span className="blink mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          systems nominal
        </span>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div
            className="rise font-mono text-[11px] uppercase tracking-[0.25em] text-accent"
            style={{ animationDelay: "80ms" }}
          >
            // access control
          </div>

          <h1
            className="rise font-display mt-3 text-4xl font-semibold leading-tight text-foreground"
            style={{ animationDelay: "160ms" }}
          >
            Launch
            <br />
            sequence.
          </h1>

          <p
            className="rise mt-4 text-sm leading-relaxed text-muted"
            style={{ animationDelay: "240ms" }}
          >
            Sign in with your Microsoft 365 account to access the dashboard.
          </p>

          <div className="rise mt-10" style={{ animationDelay: "320ms" }}>
            <button
              onClick={handleSignIn}
              disabled={checking || busy}
              className="group flex h-13 w-full items-center justify-between rounded-md border border-line bg-white/[0.04] px-5 font-mono text-sm text-foreground transition-all hover:border-accent hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 21 21" aria-hidden>
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                {busy ? "Authenticating…" : "Sign in with Microsoft"}
              </span>
              <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
                →
              </span>
            </button>
          </div>

          {error && (
            <p className="rise mt-4 rounded-md border border-red-900/60 bg-red-950/40 p-3 font-mono text-xs leading-relaxed text-red-300">
              {error}
            </p>
          )}
        </div>
      </main>

      <footer
        className="rise relative z-10 flex items-center justify-between px-6 py-5 font-mono text-[11px] uppercase tracking-widest text-muted sm:px-10"
        style={{ animationDelay: "400ms" }}
      >
        <span>rockets starter</span>
        <span>entra id · oauth 2.0</span>
      </footer>
    </div>
  );
}
