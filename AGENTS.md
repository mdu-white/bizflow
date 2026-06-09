# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

BizFlow is an early-stage project. Keep changes small, intentional, and aligned with the product and architecture docs in `docs/`.

## Working Style

- Read `docs/PRD.md` and `docs/ARCHITECTURE.md` before making product or structural changes.
- Prefer simple, maintainable implementations over speculative abstractions.
- Keep documentation updated when behavior, scope, or architecture changes.
- Do not introduce new dependencies without a clear need.
- Preserve user changes in the working tree.

## Verification

When code exists, run the narrowest relevant checks before finishing. If no automated checks exist yet, state what was manually reviewed.
