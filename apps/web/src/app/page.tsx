"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    initAuth().then((account) => {
      if (window.self !== window.top) {
        return;
      }

      router.replace(account ? "/profile" : "/login");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-sm text-muted">Redirecting…</p>
    </div>
  );
}
