# Rockets Starter

Monorepo boilerplate: NestJS 11 API (`@bitwild/rockets` v2 DSL) + Next.js frontend, managed with Turborepo.

## Quick start

```bash
yarn install
cp apps/api/.env.example apps/api/.env
yarn dev
```

| App | URL |
|-----|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api |

## What's inside

- **`apps/api`** — NestJS backend, SQLite, fake auth, module-based DDD layout
- **`apps/web`** — Next.js + Tailwind
- **`packages/`** — shared ESLint and TypeScript configs

## API architecture (v2)

Single dependency: **`@bitwild/rockets`**. No `@bitwild/rockets-auth`, no manual CRUD controllers.

- **CRUD resources** — `defineResource()` in `src/modules/{name}/{name}.resource.ts`
- **Custom features** — `defineModuleResource()` (e.g. `modules/report/`)
- **Owned data** — `OwnerStampHook` + `OwnerScopeHook` on category/task
- **Public data** — `announcement` with `@AuthPublic()`
- **Auth** — `defineFakeAuth()` returns a static dev user (swap for production)

See [apps/api/README.md](apps/api/README.md) for layout and scripts.

## Scripts

- `yarn dev` — all apps
- `yarn dev:api` / `yarn dev:web` — single app
- `yarn build` — production build
- `yarn type-check` — TypeScript
- `yarn lint` — ESLint

## development-guides/

Markdown guides in this folder describe **legacy v7 patterns** (manual CRUD adapters, Postgres, rockets-auth). For the current v2 DSL, use [btwld/skills](https://github.com/btwld/skills) instead.

## Next steps

- Replace fake auth with a real adapter
- Add modules under `apps/api/src/modules/`
- Extend `apps/web`
- Tests: `cd apps/api && yarn test && yarn test:e2e`
