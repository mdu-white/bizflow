# BizFlow SA

Production-grade multi-tenant SaaS foundation for South African SMEs.

## Stack

- Next.js 15 web app in `apps/web`
- NestJS API in `services/api`
- PostgreSQL with Prisma in `packages/database`
- Tailwind CSS and shadcn/ui-ready shared UI package in `packages/ui`
- Shared TypeScript contracts in `packages/types`
- Turborepo monorepo orchestration

## Architecture

BizFlow is organized as a workspace monorepo so product surfaces, backend services, data access, UI primitives, and shared contracts can evolve independently while staying versioned together.

- `apps/web`: Customer-facing SaaS application.
- `services/api`: API boundary, auth/RBAC enforcement, and business workflows.
- `packages/database`: Prisma schema, migrations, seed data, and Prisma client access.
- `packages/ui`: Shared Tailwind/shadcn-compatible UI primitives.
- `packages/types`: Shared enums, DTOs, and tenant-aware domain contracts.

Every business record is scoped to an organization. This supports multiple companies per user, isolates tenant data, and gives the API a consistent authorization boundary.

## Getting Started

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

## Scripts

- `npm run build`: Build all workspaces.
- `npm run dev`: Run development tasks.
- `npm run test`: Run unit tests.
- `npm run typecheck`: Type-check all workspaces.
- `npm run db:generate`: Generate Prisma client.
- `npm run db:migrate`: Apply database migrations.
- `npm run db:seed`: Seed demo data.

## Domain Model

The v1 schema includes organizations, users, organization members, clients, projects, transactions, director loans, contractors, and audit events. VAT fields are intentionally present on transaction records, while full South African VAT reporting is reserved for v2.

## Testing

Vitest is configured for shared packages and the web app. The API uses Vitest with Nest testing utilities. Initial smoke tests verify package wiring and health-check behavior.
