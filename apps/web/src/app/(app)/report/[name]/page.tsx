"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

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

type McpErrorKind =
  | { type: "missing"; server: string }
  | { type: "auth" }
  | null;

function parseMcpError(error: string): McpErrorKind {
  const capMatch = error.match(/No capability found for ['""]?([a-z0-9_-]+)['""]?/i);
  if (capMatch) return { type: "missing", server: capMatch[1] };
  if (/authenti|401|unauthorized/i.test(error) && /MCP server/i.test(error))
    return { type: "auth" };
  return null;
}

function McpSetupForm({
  initialName = "",
  initialUrl = "",
  onSaved,
}: {
  initialName?: string;
  initialUrl?: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [url, setUrl] = useState(initialUrl);
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const isUpdate = !!initialUrl;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      await apiFetch("/flows/mcp-servers", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), url: url.trim(), token: token.trim() || undefined }),
      });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.badge}>{isUpdate ? "MCP auth failed" : "MCP setup required"}</div>
      <h2 style={styles.heading}>
        {isUpdate ? <>Update token for <code style={styles.code}>{initialName}</code></> : "Configure MCP server"}
      </h2>
      <p style={styles.sub}>
        {isUpdate
          ? <>The <strong>{initialName}</strong> server returned 401. Add or update the bearer token.</>
          : "This report needs an MCP server that isn't registered. Fill in the details below."}
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isUpdate && (
          <label style={styles.label}>
            Server name
            <input style={styles.input} type="text" placeholder="meta-ads" value={name}
              onChange={(e) => setName(e.target.value)} required autoFocus />
          </label>
        )}
        <label style={styles.label}>
          MCP server URL
          <input style={styles.input} type="url" placeholder="https://mcp.example.com/ads"
            value={url} onChange={(e) => setUrl(e.target.value)} required autoFocus={isUpdate} />
        </label>
        <label style={styles.label}>
          Bearer token <span style={styles.optional}>{isUpdate ? "(leave blank to keep existing)" : "(optional)"}</span>
          <input style={styles.input} type="password" placeholder="EAAm…"
            value={token} onChange={(e) => setToken(e.target.value)} />
        </label>
        {err && <div style={styles.errInline}>{err}</div>}
        <button style={styles.btn} type="submit" disabled={saving || !name.trim() || !url.trim()}>
          {saving ? "Saving…" : isUpdate ? "Update and retry" : "Save and run report"}
        </button>
      </form>
    </div>
  );
}

export default function ReportPage() {
  const params = useParams<{ name: string }>();
  const name = params?.name;
  const searchParams = useSearchParams();
  const inputsKey = searchParams?.toString() ?? "";
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mcpError, setMcpError] = useState<McpErrorKind>(null);
  const [mcpServers, setMcpServers] = useState<Record<string, { transport?: { url?: string } }>>({});
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    const inputs: Record<string, string> = {};
    new URLSearchParams(inputsKey).forEach((v, k) => { inputs[k] = v; });

    (async () => {
      setLoading(true);
      setError(null);
      setMcpError(null);
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
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        const kind = parseMcpError(msg);
        if (kind) {
          setMcpError(kind);
          if (kind.type === "auth") {
            const servers = await apiFetch<Record<string, { transport?: { url?: string } }>>("/flows/mcp-servers").catch(() => ({}));
            if (!cancelled) setMcpServers(servers);
          }
        } else {
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [name, inputsKey, runKey]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 20px" }}>
      {loading && <p style={{ color: "#5d6b8c" }}>Loading report…</p>}

      {!loading && mcpError?.type === "missing" && (
        <McpSetupForm
          initialName={mcpError.server}
          onSaved={() => { setRunKey((k) => k + 1); }}
        />
      )}

      {!loading && mcpError?.type === "auth" && (() => {
        const entries = Object.entries(mcpServers);
        if (entries.length === 0) return (
          <McpSetupForm onSaved={() => { setRunKey((k) => k + 1); }} />
        );
        return entries.map(([sName, cfg]) => (
          <McpSetupForm key={sName} initialName={sName}
            initialUrl={cfg.transport?.url ?? ""}
            onSaved={() => { setRunKey((k) => k + 1); }} />
        ));
      })()}

      {!loading && error && (
        <div style={styles.errBox}>
          <strong>Failed to load the report.</strong>
          <br />
          {error}
        </div>
      )}

      <div ref={mountRef} />
    </div>
  );
}

const styles = {
  card: {
    background: "var(--color-surface, #fff)",
    border: "1px solid #e4e9f4",
    borderRadius: 16,
    padding: "28px 32px",
    maxWidth: 480,
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: ".06em",
    color: "#c47900",
    background: "#fff8e6",
    borderRadius: 6,
    padding: "3px 8px",
    marginBottom: 12,
  } as React.CSSProperties,
  heading: { fontSize: 20, fontWeight: 800, margin: "0 0 8px" } as React.CSSProperties,
  sub: { color: "#5d6b8c", fontSize: 14, margin: "0 0 20px" } as React.CSSProperties,
  code: {
    background: "#eaf0ff",
    color: "#2f6bff",
    borderRadius: 5,
    padding: "1px 6px",
    fontFamily: "monospace",
  } as React.CSSProperties,
  form: { display: "flex", flexDirection: "column" as const, gap: 14 },
  label: { display: "flex", flexDirection: "column" as const, gap: 4, fontSize: 13, fontWeight: 600 },
  optional: { fontWeight: 400, color: "#5d6b8c" },
  input: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d0d7ea",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  btn: {
    marginTop: 4,
    padding: "10px 20px",
    background: "#2f6bff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    alignSelf: "flex-start",
  } as React.CSSProperties,
  errInline: {
    color: "#d6455b",
    fontSize: 13,
    background: "#fdecee",
    borderRadius: 8,
    padding: "8px 12px",
  } as React.CSSProperties,
  errBox: {
    background: "#fdecee",
    border: "1px solid #d6455b",
    color: "#d6455b",
    borderRadius: 12,
    padding: "14px 16px",
  } as React.CSSProperties,
};
