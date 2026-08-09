# Research: Task Management

**Input**: [plan.md](./plan.md) Technical Context — no `NEEDS CLARIFICATION` markers
remained after `/speckit-clarify`; the technology stack itself is fixed by the
project constitution (NestJS/TS backend, React/TS frontend, PostgreSQL, TypeORM).
The decisions below cover implementation choices *within* that fixed stack that the
spec and constitution leave open.

## Primary key strategy

- **Decision**: Numeric auto-increment (`SERIAL`/`GENERATED`) primary key for `Task`.
- **Rationale**: Simplest option TypeORM and PostgreSQL support natively; a
  single-user learning app has no need for globally-unique, client-generatable, or
  non-guessable IDs. Aligns with constitution Principle I (Simplicity & YAGNI).
- **Alternatives considered**: UUID primary key — rejected as unnecessary overhead
  (extra column type, less readable during learning/debugging) with no requirement
  in the spec that calls for it.

## Status representation

- **Decision**: A Postgres/TypeORM enum column `status` with values `pending` and
  `completed`, defaulting to `pending`.
- **Rationale**: Matches FR-004/FR-007 exactly (two states, toggle between them); an
  enum is self-documenting and lets the database reject invalid values.
- **Alternatives considered**: Boolean `completed` flag — rejected because the spec's
  domain language is Pending/Completed (a status), not a true/false flag, and a
  dedicated status column reads more clearly and extends more naturally if a third
  status were ever needed (though none is planned).

## Update endpoint shape

- **Decision**: A single `PATCH /tasks/:id` endpoint accepting a partial body
  (`{ title?: string; status?: 'pending' | 'completed' }`) that covers both FR-005
  (edit title) and FR-007 (toggle status).
- **Rationale**: Both are "modify an existing task" operations on the same resource;
  one endpoint with an `UpdateTaskDto` (NestJS `PartialType`) is simpler than two
  near-identical endpoints, per constitution Principle I.
- **Alternatives considered**: Separate `PATCH /tasks/:id/title` and
  `PATCH /tasks/:id/status` endpoints — rejected as unnecessary duplication for a
  single entity with only two mutable fields.

## Filtering mechanism

- **Decision**: `GET /tasks?status=pending|completed` with the query param omitted
  meaning "All" (FR-010).
- **Rationale**: Idiomatic REST filtering; keeps a single list endpoint instead of
  three separate routes.
- **Alternatives considered**: Separate endpoints per filter (`/tasks/pending`,
  `/tasks/completed`) — rejected as redundant with a query-param filter.

## Delete confirmation (FR-009)

- **Decision**: Confirmation is a frontend concern — the React app shows a confirm
  prompt before calling `DELETE /tasks/:id`. The backend performs the delete
  unconditionally when called; it does not need a confirmation token or two-step
  protocol.
- **Rationale**: The spec's requirement is about the user's interaction, not an API
  contract concern; a client-side confirm keeps the API simple (one DELETE call =
  one deletion), per Principle I.
- **Alternatives considered**: A soft-delete or two-phase "propose then confirm"
  API — rejected as unneeded complexity; the spec's Assumptions explicitly rule out
  undo/trash/archive.

## Frontend state management

- **Decision**: Plain React component state (`useState`) lifted to the `App`
  component; no external state-management library.
- **Rationale**: One entity, one page, no cross-page or deeply-nested shared state —
  React's built-in state is sufficient. Matches Principle I.
- **Alternatives considered**: Redux/Zustand/Context-based store — rejected as
  premature abstraction for a single-page, single-entity app.

## Frontend build tooling

- **Decision**: Vite for the React + TypeScript frontend.
- **Rationale**: Minimal config, fast dev server, standard, beginner-friendly
  starting point for React + TS in 2026.
- **Alternatives considered**: Create React App — rejected as unmaintained;
  Next.js — rejected as unneeded (no SSR/routing requirement exists here).

## HTTP client

- **Decision**: Native browser `fetch` wrapped in a small `src/api/tasks.ts` module.
- **Rationale**: No requirement (interceptors, retries, cancellation) justifies an
  HTTP client library. Matches Principle I and the Additional Constraints preference
  for what the platform already provides.
- **Alternatives considered**: axios — rejected as an unjustified dependency.

## DTO validation

- **Decision**: `class-validator` + `class-transformer` with NestJS's global
  `ValidationPipe`, enforcing: `title` is a non-empty (after trim) string with a
  reasonable max length (200 chars); `status`, when present, is one of the two enum
  values.
- **Rationale**: This is NestJS's idiomatic, documented pattern for DTO validation
  (constitution Principle IV) and directly implements FR-002/FR-006.
- **Alternatives considered**: Manual `if` validation in the service layer —
  rejected as less idiomatic and harder to keep consistent across create/update.

## Migration workflow

- **Decision**: A single initial TypeORM migration creates the `task` table
  (`id`, `title`, `status` enum default `pending`, `createdAt` timestamp default
  `now()`). `synchronize` is `false` in every `DataSource`/NestJS config, per
  constitution Principle III. Migrations are run via the TypeORM CLI
  (`typeorm migration:run`) against a `data-source.ts` shared by app and CLI.
- **Rationale**: Directly satisfies the constitution's non-negotiable migration
  requirement.
- **Alternatives considered**: `synchronize: true` for local dev convenience —
  explicitly forbidden by the constitution in every environment; not considered.

## Cross-origin requests

- **Decision**: Enable NestJS's built-in CORS support for the frontend's dev-server
  origin (and configurable origin for other environments).
- **Rationale**: Backend and frontend run as separate processes/ports in
  development; CORS is required for the browser to call the API at all.
- **Alternatives considered**: A reverse proxy in front of both — rejected as
  unneeded infrastructure for a learning project.
