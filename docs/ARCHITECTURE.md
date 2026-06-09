# BizFlow Architecture

## Overview

BizFlow SA is a Turborepo monorepo for a production-grade multi-tenant SaaS platform serving South African SMEs. The system is organized around tenant-scoped business operations: organizations, users, organization members, clients, projects, transactions, director loans, and contractors.

## Workspace Layout

- `apps/web`: Next.js 15 application using React, Tailwind CSS, and shadcn/ui-compatible shared components.
- `services/api`: NestJS API service responsible for application boundaries, RBAC, orchestration, and future auth integration.
- `packages/database`: Prisma schema, migrations, seed data, and Prisma client access.
- `packages/ui`: Shared Tailwind/shadcn-compatible UI primitives.
- `packages/types`: Shared TypeScript contracts and enums.

## Architecture Decisions

### Turborepo Monorepo

Turborepo keeps the web app, API service, database schema, UI primitives, and shared types in one versioned system while still allowing each workspace to own its own scripts and dependencies. This is a practical fit for an early SaaS because schema and contract changes can land atomically with API and UI changes.

### Organization as Tenant Boundary

Every business entity belongs to an organization through `organizationId`. This makes multi-company support explicit, keeps authorization decisions consistent, and lets the API enforce tenant isolation at every query boundary.

### NestJS API Boundary

NestJS is used for the backend because its modules, dependency injection, guards, and testing utilities map well to RBAC-heavy SaaS services. The initial API includes a health endpoint, Prisma module, and RBAC utility; domain modules can now be added without changing the platform shape.

### Prisma and PostgreSQL

Prisma owns the database schema and generated client, while PostgreSQL provides relational integrity for tenant-scoped business records. Foreign keys and tenant-oriented indexes are included in the initial migration to protect data consistency and query performance.

### Director Loans as First-Class Entities

Director loans are modeled independently instead of being hidden inside generic transactions. This preserves the accounting meaning of director funding, repayments, write-offs, and balances while still allowing future links to transaction records.

### VAT Planned for v2

Transaction records include `vatRateBasisPts` and `vatAmountCents` so VAT-aware data can be stored from day one. Full South African VAT workflows, reports, submissions, and period handling are deferred to v2.

### Shared UI and Types

`packages/ui` centralizes shadcn-compatible primitives to keep product surfaces consistent. `packages/types` keeps role names, module concepts, and API contracts aligned between web and API code without introducing runtime coupling.

## Security Model

- Organization membership links users to companies.
- Roles are organization-scoped, not global.
- RBAC should be enforced in API guards before tenant-scoped data access.
- Queries for business data must include `organizationId`.

## Testing Strategy

Vitest is the default unit test runner across packages. API tests use Nest-compatible unit patterns, while database tests initially verify schema invariants that protect tenant isolation.
