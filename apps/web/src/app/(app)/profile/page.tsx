"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface UserMetadata {
  firstName?: string;
  lastName?: string;
}

interface MeResponse {
  id: string;
  email: string;
  userRoles: { role: { name: string } }[];
  userMetadata: UserMetadata;
}

export default function ProfilePage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch<MeResponse>("/me")
      .then((data) => {
        setMe(data);
        setFirstName(data.userMetadata.firstName ?? "");
        setLastName(data.userMetadata.lastName ?? "");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const data = await apiFetch<MeResponse>("/me", {
        method: "PATCH",
        body: JSON.stringify({ userMetadata: { firstName, lastName } }),
      });
      setMe(data);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const displayName =
    me &&
    (me.userMetadata.firstName || me.userMetadata.lastName
      ? `${me.userMetadata.firstName ?? ""} ${me.userMetadata.lastName ?? ""}`.trim()
      : me.email);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {!me && !error && (
        <p className="rise font-mono text-sm text-muted">Loading profile…</p>
      )}

      {me && (
        <div className="rise">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            {"// crew profile"}
          </div>

          <div className="mt-5 flex items-center gap-5">
            <div className="font-display flex h-16 w-16 items-center justify-center rounded-md border border-line bg-accent-dim text-2xl font-semibold text-accent">
              {(displayName ?? me.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {displayName}
              </h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                {me.email}
                {me.userRoles.length > 0 &&
                  ` · ${me.userRoles.map((r) => r.role.name).join(", ")}`}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="mt-10 rounded-md border border-line bg-white/[0.03]"
          >
            <div className="border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted">
              PATCH /me · userMetadata
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  First name
                </span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ada"
                  className="h-11 rounded-md border border-line bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                  Last name
                </span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Lovelace"
                  className="h-11 rounded-md border border-line bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                />
              </label>
            </div>
            <div className="flex items-center gap-4 border-t border-line px-5 py-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-accent px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              {saved && (
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  saved
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {error && (
        <p className="rise mt-6 rounded-md border border-red-900/60 bg-red-950/40 p-3 font-mono text-xs leading-relaxed text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
