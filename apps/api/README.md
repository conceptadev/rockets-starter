# Rockets Starter — API

NestJS 11 backend using **@bitwild/rockets** (v2 DSL), TypeORM, and SQLite. Runs on port **3001**.

## Quick start

From repo root:

```bash
cp apps/api/.env.example apps/api/.env
yarn dev:api
```

Or from this folder:

```bash
cp .env.example .env
yarn dev
```

Swagger UI: http://localhost:3001/api

## Stack

- **NestJS 11** — API framework
- **@bitwild/rockets** — `defineResource`, `defineModuleResource`, CRUD, hooks, auth guard
- **TypeORM** — SQLite (dev), migrations for CLI/seeding
- **Fake auth** — static dev user; no login endpoint (replace with a real adapter for production)

## Auth behaviour

| Resource | Guard | Notes |
|----------|-------|-------|
| `announcement` | skipped (`@AuthPublic()`) | truly public |
| `category`, `task`, `report`, `/me` | `AuthServerGuard` runs | fake adapter always matches — any request gets the dev user |

Replace `defineFakeAuth()` when you need real token validation.

## Database

- **SQLite** file: `DATABASE_PATH` (default `rockets-starter.sqlite` under `apps/api`)
- Dev: `synchronize: true` via `src/config/database.config.ts`
- CLI: `yarn sandbox:init` (migrations + seed)

```bash
yarn migration:run
yarn migration:generate ./src/migrations/MigrationName
yarn seed:run
yarn sandbox:init
```

## Scripts

| Script | Purpose |
|--------|---------|
| `yarn dev` | Start with watch (port 3001) |
| `yarn build` | Compile for production |
| `yarn start:prod` | Run compiled app |
| `yarn test` | Unit tests |
| `yarn test:e2e` | E2E tests |
| `yarn migration:run` | Run pending migrations |
| `yarn seed:run` | Run seeders |
| `yarn sandbox:init` | Migrations + seed |

## Project layout

```
src/
├── app.module.ts              # composition root — RocketsModule.forRoot only
├── auth/                      # fake auth bootstrap
├── config/database.config.ts  # SQLite + entity list for CLI
├── shared/domain/             # shared enums (AppUserRole)
└── modules/                   # bounded contexts (DDD)
    ├── announcement/          # public CRUD (defineResource)
    ├── category/              # owned CRUD + soft delete
    ├── task/                  # owned CRUD + soft delete
    ├── report/                # custom endpoint (defineModuleResource)
    ├── user-metadata/         # Rockets userMetadata wiring
    └── user/                  # UserEntity for seeder
```

Each module:

- `domain/` — enums, domain types
- `application/` — DTOs, controllers, services
- `infrastructure/` — TypeORM entities
- `{name}.resource.ts` or `{name}.feature.ts` — Rockets registration
- `index.ts` — public export

## Docs

- Monorepo: [README](../../README.md)
- Rockets patterns: [btwld/skills](https://github.com/btwld/skills)
