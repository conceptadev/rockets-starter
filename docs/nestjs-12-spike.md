# NestJS 12 alpha spike — vendoring notes

> Branch: `spike/nestjs-12-alpha`
> Status: **working** — API boots, Swagger serves, unit + e2e tests pass.
> Caveat: `node_modules` is hand-vendored in this repo (yarn install is broken
> by `workspace:^` specifiers in the `file:`-linked rockets packages), so the
> steps below must be repeated on a fresh checkout.

## Versions

| Package | Version |
|---|---|
| `@nestjs/common` / `core` / `platform-express` / `testing` | `12.0.0-alpha.5` |
| `@nestjs/swagger` | `12.0.0-alpha.2` |
| `@nestjs/config` | `12.0.0-next.0` |
| `@nestjs/typeorm` | `11.0.0` (no v12 exists; runs on 12 via loose peers) |
| `@nestjs/cli` / `schematics` | kept at 11 (just wraps tsc here) |

Nest 12 packages are ESM-only (`"type": "module"`). The app stays CJS and
loads them through Node >= 22.12 `require(esm)`.

## Vendoring procedure

1. Stage in a temp dir (alphas have stale `^11` peer ranges, hence the flag):
   ```bash
   mkdir /tmp/nest12-stage && cd /tmp/nest12-stage && npm init -y
   npm install --legacy-peer-deps @nestjs/common@12.0.0-alpha.5 \
     @nestjs/core@12.0.0-alpha.5 @nestjs/platform-express@12.0.0-alpha.5 \
     @nestjs/testing@12.0.0-alpha.5 @nestjs/swagger@12.0.0-alpha.2 \
     @nestjs/config@12.0.0-next.0
   ```
2. Copy each `@nestjs/*` package over the root `node_modules` copy. For any
   dependency whose root version does not satisfy the new range, nest the
   staged copy under `<pkg>/node_modules/` (done for `path-to-regexp`,
   `swagger-ui-dist`, `es-toolkit`, `@standard-schema/spec`, `dotenv`,
   `dotenv-expand`).
3. Delete the stale shadow copy `apps/api/node_modules/@nestjs/swagger` (11.x).

## Required patches to vendored files

Alpha packaging bugs; all should be re-checked (and hopefully dropped) on
each new alpha:

1. **`@nestjs/config/package.json`** — `exports["."]` only has an `import`
   condition, so CJS consumers cannot resolve it at all. Add
   `"default": "./dist/index.js"`.
2. **`@nestjs/config/dist/{config.service,utils/merge-configs.util}.js`** —
   `import set from 'es-toolkit/compat/set'` resolves to nothing under a CJS
   resolver. Rewritten to named imports from `'es-toolkit/compat'`.
3. **`@nestjs/swagger/dist/{swagger-module,swagger-ui/swagger-ui}.js`** —
   `const require = createRequire(import.meta.url)` cannot be transformed to
   CJS for Jest (shadows the module-wrapper `require`, and `import.meta` is
   ESM-only syntax). Renamed to `_cjsRequire` anchored at a literal path.

## Jest changes (committed)

- `transformIgnorePatterns` allowlists `@nestjs/*` so ts-jest transpiles the
  ESM dists to CJS (Jest's registry cannot `require(esm)`).
- ts-jest transform options: `isolatedModules`, `allowJs`,
  `esModuleInterop` (the express default import needs it; in turn
  `import * as request from 'supertest'` became `import request`).
- `moduleNameMapper` maps `@nestjs/common/utils/load-package.util.js` (uses
  `import.meta`) to the CJS shim at `apps/api/test/load-package.shim.js`.

## Known gaps / blockers for a real upgrade

- `@nestjs/typeorm` has no v12 line (its `next` tag is a stale 9.x).
- `@nestjs/cqrs` (required by `@bitwild/rockets-*`) has no v12.
- `@bitwild/rockets-*` peer `@nestjs/* ^11.1.x` — the rockets repo must move
  before this starter does (see `.rockets/nestjs-12-migration-plan.md`).
