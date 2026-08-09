# Implementation Plan: Task Management

**Branch**: `001-task-management` | **Date**: 2026-08-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-management/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A single-user task tracker: create a task with a title, view all tasks (newest first),
edit a task's title, toggle a task between Pending and Completed, delete a task
(with confirmation), and filter the list by All/Pending/Completed. Technical approach:
a NestJS + TypeORM REST API backed by PostgreSQL exposes a single `Task` resource
(create, list with optional status filter, partial update for title/status, delete);
a React SPA consumes that API with plain component state — no additional libraries
beyond the fixed stack mandated by the constitution.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS (backend and frontend)

**Primary Dependencies**: NestJS 10.x, TypeORM 0.3.x, `pg` (PostgreSQL driver),
class-validator/class-transformer (DTO validation) — backend. React 18.x, Vite —
frontend. No state-management or HTTP-client library beyond the browser `fetch` API.

**Storage**: PostgreSQL (single `task` table; schema managed exclusively via TypeORM
migrations per the constitution)

**Testing**: Encouraged, not mandatory (per constitution Principle V). If written:
Jest (NestJS default) for backend, React Testing Library for frontend.

**Target Platform**: Linux server (backend, containerizable); modern evergreen web
browsers (frontend)

**Project Type**: Web application — separate `backend/` and `frontend/` folders in
one repository (per constitution Principle II and Additional Constraints)

**Performance Goals**: None beyond ordinary interactive responsiveness — this is a
single-user learning app, not a scale target. Requests should complete fast enough
that the UI feels immediate (well under 1s) on local/typical hosting.

**Constraints**: No authentication (per spec FR-013); `synchronize` MUST be `false`
in every environment (constitution Principle III); keep the design beginner-friendly
and avoid abstractions not required by a current FR (constitution Principle I).

**Scale/Scope**: Single implied user; task lists expected in the tens, not thousands
(per spec Assumptions — no pagination/search needed). One entity, one REST resource,
one frontend page.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Simplicity & YAGNI (NON-NEGOTIABLE) | No abstractions beyond what the 13 FRs require (no repository-pattern layer beyond TypeORM's own repository, no state-management library, no generic CRUD framework) | PASS |
| II. Fixed Technology Stack | NestJS+TS backend, React+TS frontend, PostgreSQL, TypeORM, `backend/` + `frontend/` folders in this repo | PASS |
| III. Schema Changes via Migrations Only | All schema changes ship as TypeORM migration files; `synchronize: false` in every config | PASS |
| IV. Strong Typing & Clear NestJS Structure | Strict TS; backend uses module/controller/service/DTO/entity separation for the `Task` resource | PASS |
| V. Testing & Verification Encouraged, Not Mandatory | No test-coverage gate imposed by this plan; tests are optional artifacts | PASS |

No violations — Complexity Tracking table is not needed.

**Post-Phase 1 re-check**: data-model.md (one entity, no relationships), the
`tasks-api.md` contract (four endpoints on one resource, default NestJS error
shape), and quickstart.md were reviewed against the same table above — none
introduce a new dependency, layer, or deviation from the fixed stack. All five
gates remain PASS.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── task.entity.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── migrations/
│   │   └── <timestamp>-CreateTask.ts
│   ├── app.module.ts
│   └── main.ts
├── test/            # optional, per constitution Principle V
├── .env.example
├── data-source.ts   # TypeORM DataSource config (used by CLI + app)
└── package.json

frontend/
├── src/
│   ├── api/
│   │   └── tasks.ts       # fetch wrapper for the Task API
│   ├── components/
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskFilter.tsx
│   ├── App.tsx
│   └── main.tsx
├── test/            # optional, per constitution Principle V
└── package.json
```

**Structure Decision**: Web application layout with `backend/` (NestJS) and
`frontend/` (React) as separate top-level folders in this single repository, per
constitution Principle II and the Additional Constraints requiring each to be
independently runnable. The backend has a single `tasks` module (module,
controller, service, DTOs, entity — constitution Principle IV) since there is only
one entity in scope. The frontend has no routing/state library: one page composed
of a form, a filter control, and a list, per Principle I.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is intentionally empty.
