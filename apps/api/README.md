# Rockets Starter — API

NestJS 12 backend using **@concepta/rockets** (`0.0.1-dev.0`), TypeORM, SQLite, Microsoft Entra ID, and Stargate workflows. Port **3001**.

## Quick start

From repo root:

```bash
cp apps/api/.env.example apps/api/.env
yarn dev:api
```

Swagger UI: http://localhost:3001/api

## Stack

- **NestJS 12 alpha** — API framework
- **@concepta/rockets** — `RocketsModule`, `defineModuleResource`, `/me`, global auth guard
- **@concepta/rockets-repository-typeorm** — TypeORM repository bootstrap
- **TypeORM** — SQLite (dev)
- **Microsoft Entra ID** — `defineMicrosoftAuth()`
- **Stargate** — in-process workflow runtime (`@stargate/server`)

## Auth

Set `MICROSOFT_TENANT_ID` and `MICROSOFT_CLIENT_ID` in `.env`. Requests need `Authorization: Bearer <Entra access token>`.

## Project layout

```
src/
├── app.module.ts              # RocketsModule.forRoot
├── auth-microsoft/            # Entra ID adapter
├── config/database.config.ts
├── shared/domain/
└── modules/
    ├── user-metadata/         # /me fields
    ├── stargate/              # workflow runtime boundary
    └── workflows/             # sample + generic flow endpoints
```

## Scripts

| Script | Purpose |
|--------|---------|
| `yarn dev` | Start with watch (port 3001) |
| `yarn build` | Compile for production |
| `yarn test` | Unit tests |
| `yarn test:e2e` | E2E tests |
| `yarn migration:run` | Run pending migrations |

## Docs

- Monorepo: [README](../../README.md)
- Stargate module: [src/modules/stargate/README.md](./src/modules/stargate/README.md)
- Packages: [npm @concepta/rockets](https://www.npmjs.com/package/@concepta/rockets)
