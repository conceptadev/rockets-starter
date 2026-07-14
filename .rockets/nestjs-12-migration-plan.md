# NestJS 12 Migration Plan — rockets-starter

> Status: **spike done, rockets repo blocker resolved** — `spike/nestjs-12-alpha` branch runs on 12.0.0-alpha.5 (see `docs/nestjs-12-spike.md`). As of 2026-07-10, `../../rockets/packages/{rockets-core,rockets-server,rockets-repository-typeorm}` (source, unreleased, vendored locally as `1.0.0-alpha.10`) are themselves pinned to `@nestjs/common|core@12.0.0-alpha.5`, `@nestjs/swagger@12.0.0-alpha.2`, `@concepta/nestjs-*@8.0.0-alpha.7` — the "rockets repo monorepo must move first" blocker below is resolved for the packages `feature/stargate-artifact` actually uses. `@nestjs/cqrs` moved to a **hard** (non-peer) dependency of `rockets-core` at `^11.0.0`, still no v12 line, running fine under the existing `require(esm)` CJS interop.
> Last reviewed: 2026-07-10
> Decision: **main stays on Nest 11.1.18 until stable Nest 12 + ecosystem packages are ready** — this only describes the alpha spike branches, not a production migration decision.

---

## Verdict

Do not migrate rockets-starter to NestJS 12 in production today.

- Nest 12 is still **draft/WIP** ([PR #16391](https://github.com/nestjs/nest/pull/16391), status blocked, target **early Q3 2026**).
- There is **no official v11→v12 migration guide**.
- Several ecosystem packages this stack depends on **do not have Nest 12 releases yet**.

Stay on **Nest 11.1.18** until stable Nest 12 + `@nestjs/typeorm` v12 + Rockets packages are validated together.

---

## Current baseline (rockets-starter)

| Area | Today |
|------|--------|
| Nest | `11.1.18` pinned in root + `apps/api` resolutions |
| Build | CJS (`"module": "commonjs"`), `tsc` |
| Tests | Jest + ts-jest |
| Lint | ESLint |
| ORM | TypeORM `0.3.20` + `sqlite3` |
| Framework | `@bitwild/rockets` via local `file:` link |
| Seeding | `@concepta/typeorm-seeding@4.0.0` (peers `typeorm ^0.3.0`) |
| Node | v20+ required (Nest 11); v22 OK |

---

## What Nest 12 actually changes (confirmed from official PRs)

1. **Official `@nestjs/*` packages publish as ESM** — existing CJS apps are expected to keep working via Node `require(esm)` ([PR #16391](https://github.com/nestjs/nest/pull/16391)).
2. **CLI/schematics** — new projects default to ESM + Vitest + oxlint; **CJS schematic keeps Jest** ([nest-cli PR #3280](https://github.com/nestjs/nest-cli/pull/3280), [schematics PR #2302](https://github.com/nestjs/schematics/pull/2302)).
3. **Standard Schema** on `@Body` / `@Query` / `@Param` — optional; class-validator still works.
4. **Rspack replaces webpack** in CLI (webpack deprecated) — irrelevant if we keep `tsc` build.
5. **Minor breaking changes** in some ecosystem packages — details not documented yet.

---

## Hard blockers

| Package | `@next` on npm (2026-06-09) | Problem |
|---------|-----------------------------|---------|
| `@nestjs/common/core/platform-express/testing` | `12.0.0-alpha.5` | Alpha only |
| `@nestjs/swagger` | `12.0.0-alpha.2` | Alpha, behind core |
| `@nestjs/config` | `12.0.0-next.0` | Pre-release |
| **`@nestjs/typeorm`** | **`9.0.0-next.2`** | **Stale. Peers `@nestjs/common ^8`. No v12 line. Latest stable `11.0.1` peers only `^10 \|\| ^11`** |
| **`@nestjs/cqrs`** | **`11.0.0-next.2`** | **No v12. Required by `@bitwild/rockets-*`** |
| `@bitwild/rockets` monorepo | All packages on Nest `^11.1.x` | Must move first |
| `@concepta/typeorm-seeding` | Peers `typeorm ^0.3.0` | Blocks TypeORM 1.0 path |
| Official migration guide | Does not exist | No authoritative checklist |

**Bottom line:** rockets-starter cannot fully run on Nest 12 today because **`@nestjs/typeorm` has no Nest 12-compatible release**.

---

## Dependency upgrade matrix (when stable hits)

### Must bump together (single PR wave)

```
@nestjs/common
@nestjs/core
@nestjs/platform-express
@nestjs/testing
@nestjs/config
@nestjs/swagger
@nestjs/typeorm          ← wait for v12 (or confirmed ^12 peer on new 11.x)
@nestjs/cli
@nestjs/schematics
```

### Rockets repo (`../../rockets`) — do this **before** rockets-starter

Packages to touch (all currently `^11.1.x`):

- `rockets-core`
- `rockets-app`
- `rockets-crud`
- `rockets-server`
- `rockets-repository-typeorm`

Steps:

1. Bump Nest deps to `^12.x` in rockets root resolutions.
2. `yarn build && yarn test && yarn test:e2e` across rockets.
3. Fix any ESM interop issues (Rockets ships CJS `dist/index.js` today — may need dual exports).
4. Publish or re-link alpha packages.

### rockets-starter — after Rockets is green

1. Update root + `apps/api` resolutions from `11.1.18` → `12.x`.
2. Update description/comments referencing Nest 11.
3. Run full matrix: `type-check`, `test`, `test:e2e`, `build`, manual Swagger smoke.

---

## Migration phases

```
Nest 11 baseline (NOW)
  → Rockets on Nest 12?
      No  → wait / spike in branch
      Yes → Phase 1: CJS + Nest 12 core
              → all tests green?
                  No  → fix interop / peer deps
                  Yes → Phase 2 (optional): ESM
                        → Phase 3 (optional): Vitest / oxlint / Zod
```

### Phase 0 — safe now on Nest 11

- Pin Node `>=20` in docs/CI (Nest 11 requirement).
- Keep resolutions centralized (already done in root `package.json`).
- Do **not** touch TypeORM 1.0 yet — separate migration (`sqlite3` → `better-sqlite3`, seeding lib swap).

### Phase 1 — minimum viable Nest 12 (when ecosystem ready)

**Keep CJS.** Lowest-risk path Nest documents for existing apps.

Changes:

- Bump `@nestjs/*` to stable 12.x.
- Keep `"module": "commonjs"`, Jest, ESLint, `tsc` build.
- No app code changes expected for ValidationPipe / class-validator DTOs.
- Verify `nest start`, e2e, Swagger at `/api`.

**Go/no-go gate:** `@nestjs/typeorm` publishes with `@nestjs/common ^12` peer + Rockets tests pass.

### Phase 2 — ESM (optional, separate PR)

Only if we want Nest 12 full-stack benefits (native ESM libs, future defaults):

- `"type": "module"` in `apps/api/package.json`
- `tsconfig`: `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`
- `.js` suffixes on relative imports
- Rockets packages need proper `"exports"` with `"import"` / `"require"` conditions
- Turbo workspace config updates

Monorepo-wide effort. **Not required** to run Nest 12.

### Phase 3 — toolchain alignment (optional)

| Change | Required for Nest 12? | Notes |
|--------|----------------------|-------|
| Jest → Vitest | No (CJS keeps Jest) | Do when picking ESM schematic |
| ESLint → oxlint | No | Tooling only |
| class-validator → Zod | No | Standard Schema is additive |
| webpack → rspack | No | We use `tsc`, not webpack |

---

## What NOT to change yet

- Do **not** bump to `@nestjs/*@next` on main — alpha + missing `@nestjs/typeorm` v12.
- Do **not** migrate to TypeORM 1.0 as part of Nest 12 — `@concepta/typeorm-seeding@4.0.0` ties us to 0.3.x.
- Do **not** switch to Zod/Standard Schema unless there is a validation refactor goal — Rockets CRUD DTOs use class-validator.
- Do **not** ESM-first the starter before Rockets packages support it.

---

## Spike branch procedure (early validation)

Use an isolated branch, not main.

```bash
# In rockets repo first
# bump resolutions to 12.0.0-alpha.5, rebuild, test

# In rockets-starter (expect failure until @nestjs/typeorm v12 exists)
yarn add @nestjs/common@next @nestjs/core@next @nestjs/platform-express@next \
  @nestjs/testing@next @nestjs/swagger@next @nestjs/config@next \
  --dev @nestjs/cli@next @nestjs/schematics@next
```

Expected outcome today: build or runtime failure on `@nestjs/typeorm` peer mismatch.

---

## Separate track: TypeORM 0.3 → 1.0

Not Nest 12, but will hit us eventually:

- Node 20+ required
- `sqlite3` deprecated → `better-sqlite3`
- `@concepta/typeorm-seeding` likely needs replacement or upgrade
- `@nestjs/typeorm@11.0.1` already supports TypeORM 1.0 on **Nest 11**

Plan this as its own migration after Nest 12 is stable.

---

## Recommended timeline

| When | Action |
|------|--------|
| **Now (Jun 2026)** | Stay Nest 11. Monitor [PR #16391](https://github.com/nestjs/nest/pull/16391) |
| **Nest 12 stable + `@nestjs/typeorm` v12** | Phase 1 in Rockets, then rockets-starter |
| **After Phase 1 green** | Decide ESM (Phase 2) vs stay CJS |
| **Later** | TypeORM 1.0 + seeding migration |

---

## Decision summary

1. **Primary path:** Nest 11 until Nest 12 stable + `@nestjs/typeorm` v12 + Rockets validated.
2. **First code change belongs in the Rockets repo**, not rockets-starter.
3. **Phase 1 = bump deps, keep CJS/Jest/tsc** — no architectural rewrite needed.
4. **Phase 2/3 = optional modernization**, not blockers.

---

## References

- [NestJS v12 release PR](https://github.com/nestjs/nest/pull/16391)
- [NestJS CLI v12 PR](https://github.com/nestjs/nest-cli/pull/3280)
- [NestJS schematics v12 PR](https://github.com/nestjs/schematics/pull/2302)
- [NestJS v10→v11 migration guide](https://docs.nestjs.com/migration-guide) (only published guide today)
- [Standard Schema](https://standardschema.dev/)
- [@nestjs/typeorm TypeORM 1.0 support PR](https://github.com/nestjs/typeorm/pull/2562)
