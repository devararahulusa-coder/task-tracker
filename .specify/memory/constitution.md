<!--
Sync Impact Report
==================
Version change: 1.0.0 → 2.0.0
Modified principles:
  - II. Test-First Development → REMOVED (testing no longer mandatory)
  - III. Explicit Frontend/Backend Contracts → REPLACED by II. Fixed Technology Stack
  - IV. Code Review & Quality Gates → REMOVED (review no longer mandatory)
  - V. Observability & Versioning → REPLACED by III. Schema Changes via Migrations Only,
    IV. Strong Typing & Clear NestJS Structure, and V. Testing & Verification Encouraged
    (semantic-versioning requirement dropped; structured-logging language dropped)
  - I. Simplicity & YAGNI (NON-NEGOTIABLE) → retained unchanged as the main principle
Added sections:
  - Core Principles: II. Fixed Technology Stack, III. Database Schema Changes via
    Migrations Only, IV. Strong Typing & Clear NestJS Structure, V. Testing &
    Verification Encouraged, Not Mandatory
Removed sections:
  - Mandatory-review/CI language from Development Workflow (replaced with a lightweight,
    non-blocking workflow description)
Templates requiring follow-up: none — dependent templates (plan/spec/tasks) read this
  file at runtime and were not modified per scope guard.
Deferred items: none
-->

# Task Tracker Constitution

## Core Principles

### I. Simplicity & YAGNI (NON-NEGOTIABLE)
Every feature MUST be implemented with the simplest design that satisfies the current,
stated requirement. Speculative abstractions, configuration options, or extensibility
hooks for imagined future needs MUST NOT be added. Duplication of a few similar lines is
preferred over a premature shared abstraction until a third real use case exists. Any
dependency, layer, or pattern that cannot be justified by a current requirement MUST be
removed or rejected in review.
**Rationale**: Task Tracker is a learning project. Unnecessary complexity gets in the way
of understanding the stack, and simple code is the cheapest code to read, verify, and
change while learning.

### II. Fixed Technology Stack
The project MUST use: NestJS with TypeScript for the backend, React with TypeScript for
the frontend, PostgreSQL as the database, and TypeORM as the ORM. Backend and frontend
MUST live in separate top-level folders within this single repository. No alternative
framework, database, or ORM MUST be introduced without an amendment to this constitution.
**Rationale**: A fixed, well-known stack keeps the learning focus on building features
and understanding these specific tools, rather than on evaluating or integrating
alternatives.

### III. Database Schema Changes via Migrations Only
Every database schema change MUST be made through a TypeORM migration file, committed
to the repository. TypeORM's `synchronize` option MUST always be `false` in every
environment. Entities MUST NOT be relied upon to auto-generate or alter schema at
runtime.
**Rationale**: Migrations are how real-world TypeORM projects manage schema, and
learning that discipline from the start avoids the false confidence — and eventual data
loss — that `synchronize: true` invites.

### IV. Strong Typing & Clear NestJS Structure
TypeScript MUST be used in strict, strongly-typed form on both backend and frontend —
`any` MUST be avoided except where genuinely unavoidable, and such cases MUST be
explicit and narrow. Backend code MUST follow NestJS's standard module, controller,
service, DTO, and entity structure: controllers MUST handle HTTP concerns, services
MUST hold business logic, DTOs MUST validate/shape input and output, and entities MUST
represent persisted data. Layers MUST NOT be merged together for convenience.
**Rationale**: This structure is NestJS's idiomatic pattern and strong typing catches
mistakes at compile time — both are worth the small extra ceremony precisely because
this is a learning project meant to build correct habits.

### V. Testing & Verification Encouraged, Not Mandatory
Writing automated tests and manually verifying behavior are encouraged whenever they
help confirm a feature works or a bug is fixed, but neither is required to merge or
ship a change. Contributors MAY skip tests for small or exploratory changes without
justification.
**Rationale**: This is a small learning project without the maintenance-cost pressures
that make mandatory testing worthwhile elsewhere; making verification optional keeps
the focus on learning the stack rather than on process overhead.

## Additional Constraints

Backend and frontend MUST each be self-contained in their own top-level folder (e.g.
`backend/`, `frontend/`) and MUST be runnable independently of each other in
development. Configuration and secrets MUST NOT be committed to the repository.
Any addition of a new dependency beyond the fixed stack (Principle II) MUST be
justified against Principle I (Simplicity & YAGNI) — prefer what NestJS, React, or
TypeORM already provide over adding a new library.

## Development Workflow

Changes may be made directly or via pull request, at the contributor's discretion —
neither review nor CI is required to merge. Contributors are encouraged to run the
build and, where practical, manually verify a change before considering it done.
Database schema changes MUST still follow Principle III (migrations only, never
`synchronize: true`) regardless of how the change is merged.

## Governance

This constitution supersedes other project practices and templates when they conflict.
Amendments require: (1) a documented rationale for the change, (2) an update to this
file including the Sync Impact Report, and (3) a version bump per the policy below.

**Versioning policy**: MAJOR — backward-incompatible governance or principle removal/
redefinition. MINOR — a new principle or materially expanded section added. PATCH —
wording clarifications or non-semantic fixes.

**Compliance review**: Compliance with the Core Principles above — especially the
Fixed Technology Stack (II) and Migrations Only (III), which are NON-NEGOTIABLE — is
expected on every change, but is a self-check rather than a mandatory blocking gate,
consistent with Principle V.

**Version**: 2.0.0 | **Ratified**: 2026-08-08 | **Last Amended**: 2026-08-08
