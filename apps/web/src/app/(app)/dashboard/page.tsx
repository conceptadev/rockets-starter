"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const handleSummarize = async () => {
    const input = text.trim();

    if (!input) {
      setError("Enter text to summarize.");
      setSummary("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await apiFetch<{ summary: string }>(
        "/workflows/ai-summary/summarize",
        {
          method: "POST",
          body: JSON.stringify({ text: input }),
        },
      );

      setSummary(result.summary);
      setSummaryOpen(false);
    } catch (err) {
      setSummary("");
      setError(err instanceof Error ? err.message : "Summary failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rise space-y-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          // dashboard
        </div>

        <section className="rounded-md border border-line bg-white/[0.03] p-4">
          <div className="font-mono text-xs uppercase tracking-widest text-muted">
            Workflow
          </div>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display text-xl font-extrabold text-foreground">
              AI Summary
            </h1>
            <span className="font-mono text-xs text-muted">
              .stargate/flows/ai-summary.json
            </span>
          </div>
        </section>

        <div className="space-y-3">
          <label
            htmlFor="summary-text"
            className="block font-mono text-xs uppercase tracking-widest text-muted"
          >
            Text
          </label>
          <textarea
            id="summary-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            className="w-full resize-y rounded-md border border-line bg-white/[0.03] px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
            placeholder="Paste text here..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          {error ? (
            <p className="font-mono text-xs text-accent">{error}</p>
          ) : null}
        </div>

        {summary ? (
          <section className="rounded-md border border-line bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setSummaryOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                Summary
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                {summaryOpen ? "Hide" : "Show"}
              </span>
            </button>

            {summaryOpen ? (
              <p className="border-t border-line px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-foreground">
                {summary}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
