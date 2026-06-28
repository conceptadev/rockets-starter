"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

// The shared renderer is loaded from /public/report-renderer.js and exposes
// window.SGReport. It is the SAME module used by the Cowork preview, so the
// report looks identical here and there.
declare global {
  interface Window {
    SGReport?: {
      renderReport: (el: HTMLElement, uiSchema: unknown, data: unknown) => void;
      renderError: (el: HTMLElement, message: string) => void;
    };
  }
}

interface RunState {
  status: string;
  results: Record<string, unknown>;
  errors?: { message: string }[];
}

function loadRenderer(): Promise<NonNullable<Window["SGReport"]>> {
  return new Promise((resolve, reject) => {
    if (window.SGReport) return resolve(window.SGReport);
    const existing = document.getElementById("sg-renderer-script");
    const onReady = () => (window.SGReport ? resolve(window.SGReport) : reject(new Error("Renderer is unavailable")));
    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => reject(new Error("Failed to load the renderer")));
      return;
    }
    const s = document.createElement("script");
    s.id = "sg-renderer-script";
    s.src = "/report-renderer.js";
    s.onload = onReady;
    s.onerror = () => reject(new Error("Failed to load the renderer"));
    document.head.appendChild(s);
  });
}

export default function ReportPage() {
  const params = useParams<{ name: string }>();
  const name = params?.name;
  const searchParams = useSearchParams();
  // Drill-down: any query param (e.g. ?project=123) is passed to the flow as input.
  const inputsKey = searchParams?.toString() ?? "";
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    const inputs: Record<string, string> = {};
    new URLSearchParams(inputsKey).forEach((v, k) => {
      inputs[k] = v;
    });
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [renderer, ui, state] = await Promise.all([
          loadRenderer(),
          apiFetch<unknown>(`/flows/${name}/ui`),
          apiFetch<RunState>(`/flows/${name}/run`, {
            method: "POST",
            body: JSON.stringify({ inputs }),
          }),
        ]);
        if (cancelled || !mountRef.current) return;
        renderer.renderReport(mountRef.current, ui, state.results);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name, inputsKey]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      {loading && <p style={{ color: "#5d6b8c" }}>Loading report…</p>}
      {error && (
        <div
          style={{
            background: "#fdecee",
            border: "1px solid #d6455b",
            color: "#d6455b",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <strong>Failed to load the report.</strong>
          <br />
          {error}
        </div>
      )}
      <div ref={mountRef} />
    </div>
  );
}
