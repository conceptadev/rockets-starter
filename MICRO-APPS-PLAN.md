# Micro-apps on Rockets — capability audit, contract & policies

Status: **slices 1–6 implemented** (backbone + per-app authz + generative UI). Slice 7 (eject CLI) pending. Scope: turn an installed artifact (JSON only, via the MCP) into a small, end-to-end **micro-app** — data (flow) + schema → persisted entity + CRUD endpoints + generative UI — with no per-app backend code in the dynamic tier, and a clean **eject** path to real Rockets code when an app outgrows the envelope.

## Decisions (locked)
1. Dynamic tier = **single `artifact_record` JSON table** + one generic resource. ✅
2. Default authz = **Own** (per-user rows; `owner` column), overridable via `x-acl`. ✅
3. Migration = **additive-only in dynamic, eject for breaking**. ✅
4. Sync = **install + manual Refresh** now (cron later — `@nestjs/schedule` not yet added). ✅
5. Install = **ADMIN-only** (`POST /flows` is ADMIN via ACL; MCP install gated by `ARTIFACT_MCP_TOKEN`). ✅

## What shipped (files)
- `infrastructure/artifact-record.entity.ts` — generic row table (+ added to `ENTITIES`, `autoLoadEntities:true`).
- `application/artifact-schema.ts` — JSON-Schema-subset validator + `x-*` helpers + `readPath`.
- `application/artifact-records.service.ts` — generic CRUD, Own/Any scoping, schema validation.
- `application/artifact-sync.service.ts` — run flow → validate rows → upsert/append.
- `presentation/http/records.controller.ts` — `/apps/:app/records` CRUD + `POST /apps/:app/sync` (ADMIN).
- `flows.controller.ts` — `GET /flows/:name/schema`; `artifact-workspace.service.ts` — schema persist/read; `install_artifact` MCP accepts `schema`.
- `app.acl.ts` / `workflows.resource-key.ts` — `apps:record` grants (ADMIN *Any; USER *Own).
- `apps/web/public/report-renderer.js` — `renderApp` schema-driven table + create/edit/delete forms.
- `report/[name]/page.tsx` — detects schema → generative CRUD UI (dashboards with `x-rows` are read-only).

---

## 1. Rockets capability audit (what we already have vs. what's missing)

Grounded in the current `apps/api` + `@bitwild/rockets`.

| Need | Status | Where / note |
|---|---|---|
| Authentication (who you are) | ✅ have | `RocketsModule.forRoot({ auth: defineMicrosoftAuth() })`, `AuthServerGuard`, `enableGlobalGuard: true`, `@AuthPublic()` |
| Authorization / RBAC | ✅ have | `AccessControlModule` + `accesscontrol`; `app.acl.ts` grants per resource with `createAny/readAny/updateAny/deleteAny`. Roles `ADMIN/USER` (`AppUserRole`). Supports **Own vs Any** → row-level ownership is expressible. |
| Resource system (CRUD) | ✅ have | `defineModuleResource(...)`, `CrudResource`, `RocketsResourceDefinition`; resources passed to `forRoot({ resources: [...] })`. |
| DB, driver-agnostic | ✅ have | `defineTypeOrmRepository(getDatabaseConfig())`; TypeORM (sqlite now, swappable). |
| Migrations tooling | ✅ have | `ormconfig.ts` + `ormSettingsFactory` (prod: `synchronize:false` + migrations dir); dev: `synchronize:true`. CLI scripts in `package.json`. |
| Artifact install (JSON push) | ✅ have | `install_artifact` / `list_artifacts` / `remove_artifact` MCP + `ArtifactWorkspaceService` writing `.stargate/flows` + `.stargate/ui`. |
| Live data via workflows | ✅ have | Stargate flow + `mcp.call` / `flow.merge` / `mcp.mapCall` (built-ins). |
| **Dynamic entity/table at runtime** | ⚠️ gap | Entities + resources are registered at **bootstrap** (`ENTITIES` array, `forRoot`). TypeORM DataSource is fixed at startup → adding a per-app table at runtime is the one real obstacle. **Design decision below.** |
| **Per-app authorization wiring** | ⚠️ small gap | RBAC exists, but each micro-app needs its data scoped to owner/roles. Generic, but must be written once. |
| **Schema versioning / migration policy** | ⚠️ gap | Agnostic DB ≠ migration story. Needs an explicit policy (below). |
| DTO validation style | ℹ️ note | Rockets resource DTOs use **class-validator** (not Zod). We author in Zod → ship JSON Schema → validate with a Zod/ajv pipe in the generic resource. (No conflict; just don't assume Zod DTOs natively.) |

**Verdict:** ~80% of the platform is already there. The only structural gap is *runtime tables*, which we resolve by **not creating a table per app** in the dynamic tier (see §3).

---

## 2. The two tiers (this is what keeps the project honest)

- **Dynamic tier (default, zero codegen, zero restart):** the micro-app is just JSON. It uses **one generic physical table** for all apps' rows and **one generic CRUD resource**. The installed **schema** drives validation, query shaping, and the UI — not physical DDL.
- **Eject tier (graduation):** when an app outgrows the envelope, a CLI generates a **real Rockets resource** (TypeORM entity + CRUD controller + DTO + migration) from the same schema. From then on it's normal, owned code.

The dynamic tier deliberately trades "real columns" for "no DDL, no migration-per-app, no restart." For *micro*-apps (small, end-to-end) that trade is correct; the eject tier covers everything else.

---

## 3. Dynamic tier design (no per-app table)

**One generic record table** (registered once at `forRoot`, normal entity):

```
artifact_record
  id           uuid (pk)
  app          varchar     -- artifact name (scopes every row)
  entityKey    varchar     -- logical entity within the app (usually = app)
  data         simple-json -- the row, validated against the app's schema
  owner        varchar     -- userId of creator (for Own/Any authz)
  capturedAt   timestamp   -- for snapshots/history (append mode)
  version      int         -- schema version the row was written under
  dateCreated/dateUpdated/dateDeleted (Rockets base columns)
  -- indexes: (app, entityKey), (app, owner)
```

**One generic CRUD resource** `/* e.g. */ /apps/:app/records`:
- `GET` list (filter/sort/paginate over `data` json), `GET/:id`, `POST`, `PATCH/:id`, `DELETE/:id`.
- Scoped to `app`; validates request bodies against the app's installed **schema** (Zod from JSON Schema); enforces RBAC (below).
- This is **static, generic code written once** — every micro-app reuses it. No per-app registration, no runtime DataSource changes.

**Why this dodges the runtime-table problem AND the migration problem:** rows are JSON in one table. Adding/removing fields in a micro-app schema is just a schema change — additive is automatic, and there's no `ALTER TABLE`. Migration risk is contained to the **eject** boundary.

**Sync vs view (the data lifecycle):**
- **Sync (write, slow):** run the flow (MCPs) → take `store.rows` → validate against schema → write to `artifact_record` (mode `upsert` by business key, or `append` with `capturedAt`). Trigger: on install (first load), scheduled (cron), or manual **Refresh**.
- **View (read, instant):** UI reads from `artifact_record` via the generic resource. Pays the MCP cost once per sync, not per view. (This also fixes the ~1–2 min fan-out latency we hit.)

---

## 4. The micro-app contract (the artifact bundle)

A micro-app = up to four JSON pieces, pushed via `install_artifact`:

1. **`flow.json`** — Stargate workflow (how to fetch/compose data). Built-ins only.
2. **`schema`** (JSON Schema, authored in Zod) — the entity shape. Source of truth for **validation + DB record + generative UI**. Carries extensions:
   - `x-entity`: logical name (default = app name)
   - `x-primaryKey`: business key(s) for `upsert`
   - `x-store`: `upsert | append`
   - `x-version`: integer schema version
   - `x-ui`: optional presentation hints (labels, order, hidden, format, which block)
3. **`store.json`** *(optional / can live as schema extensions)* — `rows` (path into flow result), `writeOn` (`install | schedule | manual`), schedule cron.
4. **`ui-hints.json`** *(optional)* — overrides on top of the generative UI.

**Authoring:** write Zod in Cowork (DX + types) → convert to JSON Schema (`z.toJSONSchema`) for transport → Rockets derives entity/validator/resource/UI from it. **Ship data, not executable code.**

### Envelope (what makes it a *micro*-app — stay inside or eject)

Allowed:
- 1 logical entity (or a couple, **no deep relations**).
- Single team / clear owner.
- Low-write concurrency.
- Read-mostly + simple forms (create/update/status).
- Authz: role-based + optional row-ownership (`Own`).
- Schema changes: **additive only** (new optional fields).

Triggers **eject → CLI codegen** (real Rockets resource + migration):
- relational/multi-entity joins, per-row/field-level permissions beyond Own/Any,
- breaking schema change (rename/retype/required field on existing data),
- high volume / need for real columns + indexes,
- custom server logic or bespoke UX the generative layer can't express.

---

## 5. Policies

### 5.1 Authorization (per micro-app, on top of Rockets RBAC)
- Each micro-app registers an **ACL resource key** (e.g. `app:<name>`); reuse `accesscontrol` grants.
- Default grants: **ADMIN** = `*Any`; **USER** = `readOwn`/`createOwn`/`updateOwn`/`deleteOwn` (row-ownership via the `owner` column), or `readAny` for shared read-only dashboards — declared per app in the schema (`x-acl`).
- `install_artifact` / `remove_artifact` require **ADMIN** (or an `app:install` permission) — installing creates endpoints, so it's privileged. The MCP token gate stays as defense-in-depth.
- The generic resource enforces grants on every CRUD call and filters by `owner` when the grant is `Own`.

### 5.2 Schema migration / versioning
- Every schema has `x-version`. Rows store the `version` they were written under.
- **Dynamic tier:** only **additive** changes are auto-applied (new optional field; reads tolerate missing fields). No destructive change in dynamic mode.
- **Breaking change:** bump major version → must **eject** (CLI generates a migration + backfill). Never silently rewrite data.
- Re-install with same version + additive diff = safe overwrite; with breaking diff = rejected with a clear "eject required" message.

### 5.3 Security / governance
- Validate schema on install (safe charset for `app`/field names, allowlisted types, required `x-primaryKey` for `upsert`).
- Validate every written/CRUD row against the schema (reject/coerce).
- Parameterized queries only; JSON-path filters whitelisted; pagination caps.
- MCP URLs SSRF-checked + from registered presets only (already the Stargate model).
- Audit: record who installed/removed and who wrote (we already have `owner`, `dateCreated`).

### 5.4 Data lifecycle
- `writeOn`: `install` (first load) + `schedule` (cron) recommended; `manual` Refresh always available.
- `upsert` = current state; `append` = history/snapshots (time-series dashboards).
- Reads always hit the DB (instant); Refresh triggers a sync.

---

## 6. Generative UI
- Renderer gains a **schema-driven mode**: fields → columns/inputs by type (string, number, date, enum→select, boolean→toggle, json→nested, ref→link). Table + detail + create/edit form generated from the schema.
- `ui-hints`/`x-ui` are pure presentation overrides (labels, order, hidden, formatting, block choice, drill-down links).
- `ui.json` (hand-written blocks) stays supported as a full override / escape hatch.

---

## 7. Build slices (mapped to existing Rockets pieces)

1. **`artifact_record` entity** + add to `ENTITIES` (uses existing TypeORM/synchronize).
2. **Generic CRUD resource** `apps/:app/records` via `defineModuleResource` + Zod-from-JSON-Schema validation pipe; wire ACL resource keys (reuse `app.acl.ts` pattern).
3. **Schema handling on install** — `install_artifact` accepts `schema`; persist it next to flow/ui; validate.
4. **Sync service** — run flow → validate → upsert/append into `artifact_record`; triggers (install/schedule/manual).
5. **Generative UI mode** in `report-renderer` + report page reads from the resource.
6. **Authz per app** — default grants from `x-acl`, ownership filtering.
7. **(Eject) CLI** `gen-resource` — schema → TypeORM entity + CRUD controller + DTO + migration.

---

## 8. Open decisions for review
1. Dynamic tier = **single `artifact_record` JSON table** (recommended) vs. dynamic per-app tables (needs DataSource rebuild/restart). Confirm the JSON-table approach for the dynamic tier?
2. Default authz for a new app: **`readAny` (shared dashboard)** or **`Own` (per-user data)** as the default, overridable via `x-acl`?
3. Migration stance: **additive-only in dynamic, eject for breaking** — agreed?
4. Sync default: **install + schedule + manual Refresh** — agreed cadence?
5. Who can install: **ADMIN-only** (recommended) vs a dedicated `app:install` permission?
