"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface ArtifactSummary {
  name: string;
  title: string;
  subtitle: string;
  updatedAt: number;
}

function timeAgo(ms: number): string {
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default function ArtifactsPage() {
  const [items, setItems] = useState<ArtifactSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ArtifactSummary[]>("/flows")
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="sg-gal">
      <style>{CSS}</style>
      <header className="sg-gal-head">
        <div>
          <h1>Artifacts</h1>
          <p>Reports created by Claude. Click one to open it.</p>
        </div>
        <span className="sg-gal-count">{items ? `${items.length}` : "…"}</span>
      </header>

      {error && <div className="sg-gal-err">Failed to load: {error}</div>}

      {!items && !error && <p className="sg-gal-muted">Loading…</p>}

      {items && items.length === 0 && (
        <div className="sg-gal-empty">
          <div className="t">No artifacts yet</div>
          <div>Add a <code>.stargate/ui/&lt;name&gt;.json</code> file and matching flow to see it here.</div>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="sg-gal-grid">
          {items.map((a) => (
            <Link key={a.name} href={`/report/${a.name}`} className="sg-gal-card">
              <div className="sg-gal-badge">report</div>
              <div className="sg-gal-title">{a.title}</div>
              {a.subtitle && <div className="sg-gal-sub">{a.subtitle}</div>}
              <div className="sg-gal-foot">
                <span>{timeAgo(a.updatedAt)}</span>
                <span className="sg-gal-arrow" aria-hidden>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const CSS = `
.sg-gal{--g-sf:#fff;--g-ink:#141a2e;--g-mut:#5d6b8c;--g-ln:#e4e9f4;--g-acc:#2f6bff;--g-accsoft:#eaf0ff;
  --g-shadow:0 1px 2px rgba(20,40,80,.05),0 1px 10px rgba(20,40,80,.05);max-width:980px;margin:0 auto;padding:24px 20px;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--g-ink)}
@media (prefers-color-scheme:dark){.sg-gal{--g-sf:#161c29;--g-ink:#e9edf6;--g-mut:#93a0bf;--g-ln:#27314a;
  --g-acc:#6ea8fe;--g-accsoft:#1a2740;--g-shadow:0 1px 2px rgba(0,0,0,.35)}}
.sg-gal-head{display:flex;align-items:flex-start;justify-content:space-between;margin:0 0 20px}
.sg-gal-head h1{font-size:24px;font-weight:800;letter-spacing:-.01em;margin:0}
.sg-gal-head p{color:var(--g-mut);font-size:14px;margin:4px 0 0}
.sg-gal-count{background:var(--g-accsoft);color:var(--g-acc);font-weight:800;border-radius:999px;padding:4px 12px;font-size:13px}
.sg-gal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.sg-gal-card{display:block;background:var(--g-sf);border:1px solid var(--g-ln);border-radius:16px;padding:16px 18px;
  box-shadow:var(--g-shadow);text-decoration:none;color:inherit;transition:transform .12s,border-color .12s,box-shadow .12s}
.sg-gal-card:hover{transform:translateY(-2px);border-color:var(--g-acc);box-shadow:0 6px 20px rgba(47,107,255,.12)}
.sg-gal-badge{display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;
  color:var(--g-acc);background:var(--g-accsoft);border-radius:6px;padding:3px 8px;margin-bottom:10px}
.sg-gal-title{font-size:16px;font-weight:700;line-height:1.3}
.sg-gal-sub{color:var(--g-mut);font-size:13px;margin-top:4px}
.sg-gal-foot{display:flex;align-items:center;justify-content:space-between;margin-top:14px;color:var(--g-mut);font-size:12px}
.sg-gal-arrow{font-size:16px;color:var(--g-acc);transition:transform .12s}
.sg-gal-card:hover .sg-gal-arrow{transform:translateX(3px)}
.sg-gal-muted{color:var(--g-mut)}
.sg-gal-err{background:#fdecee;border:1px solid #d6455b;color:#d6455b;border-radius:12px;padding:12px 14px}
.sg-gal-empty{text-align:center;color:var(--g-mut);padding:48px 16px;background:var(--g-sf);border:1px dashed var(--g-ln);border-radius:16px}
.sg-gal-empty .t{font-weight:700;color:var(--g-ink);margin-bottom:4px}
.sg-gal-empty code{background:var(--g-accsoft);color:var(--g-acc);border-radius:5px;padding:1px 6px}
`;
