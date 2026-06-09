# BizFlow Product Requirements Document

## Overview

BizFlow SA is a multi-tenant SaaS platform for South African SMEs that need a clear operating layer for companies, users, clients, projects, transactions, director loans, and contractors.

## Goals

- Support multiple companies per user.
- Keep all business data scoped to an organization.
- Provide role-based access for owners, admins, finance users, project managers, and members.
- Treat director loans as first-class business records.
- Prepare transaction data for South African VAT support in v2.

## Non-Goals

- Replace full ERP platforms in v1.
- Implement SARS VAT submissions in v1.
- Build deep accounting package integrations before the core model is stable.

## Target Users

- South African SME owners and directors.
- Finance and operations managers.
- Project-led service businesses.
- SMEs using contractors and director funding.

## Core Modules

- Organizations
- Users
- Organization Members
- Clients
- Projects
- Transactions
- Director Loans
- Contractors

## Business Rules

- Every business entity must belong to an organization.
- A user can belong to multiple organizations.
- Roles are scoped to organization membership.
- Financial amounts are stored in cents and default to ZAR.
- Director loan balance must be tracked independently from generic transactions.
- VAT fields may be stored on transactions, but full VAT reporting is planned for v2.

## Success Metrics

- Users can switch between organizations without data leakage.
- Owners can invite users and assign organization roles.
- Finance users can see transactions and director loan balances per company.
- Project managers can connect projects, clients, and contractors.
