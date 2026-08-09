---

description: "Task list template for feature implementation"
---

# Tasks: Task Management

**Input**: Design documents from `/specs/001-task-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tasks-api.md, quickstart.md

**Tests**: Not included as dedicated tasks. The constitution (Principle V) makes testing encouraged but not mandatory for this learning project, and the spec does not request TDD; `quickstart.md` provides the validation scenarios instead (see T037).

**Organization**: Tasks are grouped by user story (from spec.md, in priority order P1–P5) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web app per plan.md: `backend/src/` (NestJS), `frontend/src/` (React). See plan.md
Project Structure for the full layout.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create the `backend/` and `frontend/` top-level folders per plan.md Project Structure
- [X] T002 Initialize the NestJS backend in `backend/`: `package.json`, `tsconfig.json` (with `"strict": true`, per constitution Principle IV), and dependencies (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `typeorm`, `pg`, `class-validator`, `class-transformer`)
- [X] T003 [P] Initialize the React + Vite frontend in `frontend/`: `package.json`, `tsconfig.json` (with `"strict": true`, per constitution Principle IV), `vite.config.ts`, dependencies (`react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`)
- [X] T004 [P] Create `backend/.env.example` documenting the required PostgreSQL connection variables (host, port, username, password, database name)
- [X] T005 [P] Configure ESLint + Prettier for `backend/` and for `frontend/`

**Checkpoint**: Both projects install and build with no source files yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Configure the TypeORM `DataSource` in `backend/data-source.ts`, reading connection settings from the env vars documented in `backend/.env.example`, with `synchronize: false` (constitution Principle III) and a `migrations` glob pointing at `backend/src/migrations/`
- [X] T007 [P] Create the `Task` entity in `backend/src/tasks/task.entity.ts` per data-model.md: `id` (auto-increment PK), `title` (varchar, max 200), `status` (enum `pending`/`completed`, default `pending`), `createdAt` (timestamp, default now)
- [X] T008 Generate the initial TypeORM migration in `backend/src/migrations/<timestamp>-CreateTask.ts` that creates the `task` table matching the entity from T007 (constitution Principle III — schema changes ship only as migrations)
- [X] T009 Create `backend/src/tasks/tasks.module.ts` with empty `TasksController`/`TasksService` classes in `backend/src/tasks/tasks.controller.ts` and `backend/src/tasks/tasks.service.ts`, and register `TasksModule` (plus the `DataSource`/`TypeOrmModule.forRoot`) in `backend/src/app.module.ts`
- [X] T010 [P] In `backend/src/main.ts`: bootstrap the Nest app, enable a global `ValidationPipe` (`whitelist: true`, `transform: true`), and enable CORS for the frontend's dev origin
- [X] T011 [P] Scaffold the frontend entry point: `frontend/index.html`, `frontend/src/main.tsx`, and a placeholder `frontend/src/App.tsx` that renders a "Task Tracker" heading
- [X] T012 [P] Create the frontend API request helper in `frontend/src/api/tasks.ts`: a shared `request()` function wrapping `fetch` with the backend base URL, JSON headers, and error handling (throws on non-2xx with the response's `message`) — no endpoint-specific functions yet

**Checkpoint**: Foundation ready — backend boots and connects to PostgreSQL with the `task` table migrated; frontend boots and renders a placeholder page. User story implementation can now begin.

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: A user can type a title, add it as a task, and see all their tasks listed (newest first).

**Independent Test**: Open the app, create one or more tasks with a title, and confirm each appears in the visible list immediately.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create `CreateTaskDto` in `backend/src/tasks/dto/create-task.dto.ts`: `title` required, trimmed, non-empty, max 200 chars (FR-001, FR-002; contracts/tasks-api.md `POST /tasks`)
- [X] T014 [US1] Implement `TasksService.create()` (status defaults to `pending`) and `TasksService.findAll()` (no filter yet; ordered by `createdAt` DESC) in `backend/src/tasks/tasks.service.ts` (FR-001, FR-003, FR-004) — depends on T013, T007
- [X] T015 [US1] Implement `TasksController` `POST /tasks` and `GET /tasks` in `backend/src/tasks/tasks.controller.ts`, returning `400` on validation failure per contracts/tasks-api.md — depends on T014
- [X] T016 [P] [US1] Add `getTasks()` and `createTask(title)` functions to `frontend/src/api/tasks.ts`, calling `GET /tasks` and `POST /tasks` per contracts/tasks-api.md — depends on T012
- [X] T017 [P] [US1] Create `TaskItem` component in `frontend/src/components/TaskItem.tsx` rendering a task's title and status
- [X] T018 [US1] Create `TaskList` component in `frontend/src/components/TaskList.tsx` rendering a list of `TaskItem`s, with an empty-state message when there are no tasks — depends on T017
- [X] T019 [P] [US1] Create `TaskForm` component in `frontend/src/components/TaskForm.tsx`: a title input and submit control that blocks empty/whitespace-only submissions client-side and surfaces the server's `400` message on failure (FR-002)
- [X] T020 [US1] Wire `frontend/src/App.tsx`: load tasks via `getTasks()` on mount, add a task via `TaskForm` + `createTask()` and prepend it to state, render `TaskList` (FR-011: reflect the new task in the list immediately) — depends on T016, T018, T019

**Checkpoint**: User Story 1 is fully functional and testable independently — this is the MVP.

---

## Phase 4: User Story 2 - Mark Tasks Completed or Pending (Priority: P2)

**Goal**: A user can toggle a task between Pending and Completed, in either direction.

**Independent Test**: Create a task, mark it completed, confirm the status changes, then mark it pending again and confirm it reverts.

### Implementation for User Story 2

- [X] T021 [P] [US2] Create `UpdateTaskDto` in `backend/src/tasks/dto/update-task.dto.ts`: optional `title` (same rules as create) and optional `status` (`pending`|`completed`) (FR-005, FR-006, FR-007 — also implements the backend for US4's title edit; see Phase 6; contracts/tasks-api.md `PATCH /tasks/:id`)
- [X] T022 [US2] Implement `TasksService.update()` in `backend/src/tasks/tasks.service.ts`: applies provided `title`/`status` independently, rejects an empty/whitespace `title` while preserving the existing one (FR-006), throws not-found for an unknown id (FR-005, FR-006 — also implements the backend for US4's title edit; see Phase 6) — depends on T021, T014
- [X] T023 [US2] Implement `TasksController` `PATCH /tasks/:id` in `backend/src/tasks/tasks.controller.ts`, returning `200` with the updated task, `400` on validation failure, `404` if not found (FR-005, FR-006 — also implements the backend for US4's title edit; see Phase 6) — depends on T022
- [X] T024 [P] [US2] Add `updateTask(id, { title?, status? })` function to `frontend/src/api/tasks.ts`, calling `PATCH /tasks/:id` — depends on T016
- [X] T025 [US2] Add a status toggle control to `TaskItem` (`frontend/src/components/TaskItem.tsx`) that calls `updateTask(id, { status })` and reflects the returned status — depends on T024, T017
- [X] T026 [US2] Wire the toggle handler in `frontend/src/App.tsx` to update the corresponding task in state after a successful `PATCH` (FR-011: reflect the status change in the list immediately) — depends on T025, T020

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Filter Tasks by Status (Priority: P3)

**Goal**: A user can switch between viewing All, only Pending, or only Completed tasks.

**Independent Test**: Create a mix of pending and completed tasks, select each filter option, and confirm only the matching tasks are shown.

### Implementation for User Story 3

- [X] T027 [US3] Extend `TasksService.findAll()` and the `GET /tasks` handler in `backend/src/tasks/tasks.service.ts` / `backend/src/tasks/tasks.controller.ts` to accept an optional `status` query parameter and filter accordingly, `400` on an invalid value (FR-010; contracts/tasks-api.md) — depends on T015
- [X] T028 [P] [US3] Create `TaskFilter` component in `frontend/src/components/TaskFilter.tsx`: All / Pending / Completed control
- [X] T029 [US3] Wire filter state in `frontend/src/App.tsx`: pass the selected status to `getTasks()` and re-fetch/re-render the list on change (FR-011: reflect the filtered list immediately) — depends on T028, T016, T020

**Checkpoint**: All of User Stories 1–3 work independently.

---

## Phase 6: User Story 4 - Edit a Task's Title (Priority: P4)

**Goal**: A user can update a task's title without deleting and recreating it.

**Independent Test**: Create a task, edit its title to a new value, and confirm the list shows the updated title with status unchanged.

### Implementation for User Story 4

- [X] T030 [US4] Add edit-mode UI to `TaskItem` (`frontend/src/components/TaskItem.tsx`): an edit control that reveals a title input, calls `updateTask(id, { title })` (reusing the function from T024) on save, and surfaces the server's `400` message on an empty/whitespace submission without discarding the task's current title (FR-005, FR-006) — depends on T024, T017
- [X] T031 [US4] Wire the title-edit handler in `frontend/src/App.tsx` to update the corresponding task's title in state after a successful `PATCH` (FR-011: reflect the updated title in the list immediately) — depends on T030, T020

**Checkpoint**: All of User Stories 1–4 work independently. (No new backend work: this story reuses the `PATCH /tasks/:id` endpoint built for US2.)

---

## Phase 7: User Story 5 - Delete a Task (Priority: P5)

**Goal**: A user can permanently remove a task they no longer need, after confirming.

**Independent Test**: Create a task, delete it (confirming the prompt), and confirm it no longer appears in the list under any filter.

### Implementation for User Story 5

- [X] T032 [P] [US5] Implement `TasksService.remove()` and the `TasksController` `DELETE /tasks/:id` handler in `backend/src/tasks/tasks.service.ts` / `backend/src/tasks/tasks.controller.ts`: `204` on success, `404` if not found (FR-008) — depends on T009
- [X] T033 [P] [US5] Add `deleteTask(id)` function to `frontend/src/api/tasks.ts`, calling `DELETE /tasks/:id` — depends on T012
- [X] T034 [US5] Add a delete control to `TaskItem` (`frontend/src/components/TaskItem.tsx`) that shows a confirmation prompt before calling `deleteTask`, and does nothing if the user cancels (FR-009) — depends on T033, T017
- [X] T035 [US5] Wire the delete handler in `frontend/src/App.tsx` to remove the task from state only after a confirmed, successful delete (FR-011: reflect the removal in the list immediately) — depends on T034, T020

**Checkpoint**: All five user stories are independently functional — the feature is complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T036 [P] Add minimal CSS for `TaskForm`, `TaskList`, `TaskItem`, and `TaskFilter` so the list, empty states, and controls are legible and usable
- [X] T037 Run every scenario in quickstart.md end-to-end against the running app (including the persistence check) and fix any discrepancy found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion; built in priority order P1 → P2 → P3 → P4 → P5 since US4 reuses US2's endpoint and every story reuses US1's `TaskItem`/`App.tsx` wiring
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories — this is the MVP
- **User Story 2 (P2)**: Builds on US1's `TaskItem`/`App.tsx`; independently testable once built
- **User Story 3 (P3)**: Builds on US1's `GET /tasks` and `App.tsx`; independently testable once built
- **User Story 4 (P4)**: Reuses US2's `PATCH /tasks/:id` endpoint and `updateTask()` client function; independently testable once built
- **User Story 5 (P5)**: Builds on US1's `TaskItem`/`App.tsx`; independently testable once built

### Within Each User Story

- DTOs/entities before services
- Services before controllers/endpoints
- Backend endpoint before the frontend API function that calls it
- API functions before the UI that calls them
- Story complete before moving to the next priority

### Parallel Opportunities

- Setup tasks T003, T004, T005 can run in parallel with each other (and with T002, once T001 exists)
- Foundational tasks T007, T010, T011, T012 can run in parallel with each other
- Within US1: T016, T017, T019 can run in parallel; T013 can run in parallel with all frontend tasks
- Within US2: T021 and T024 can run in parallel with each other
- Within US5: T032 and T033 can run in parallel with each other

---

## Parallel Example: User Story 1

```bash
# Backend DTO and frontend pieces can proceed together (different files, no shared dependency):
Task: "Create CreateTaskDto in backend/src/tasks/dto/create-task.dto.ts"
Task: "Add getTasks() and createTask() to frontend/src/api/tasks.ts"
Task: "Create TaskItem component in frontend/src/components/TaskItem.tsx"
Task: "Create TaskForm component in frontend/src/components/TaskForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart.md scenario 1–2 against the running app
5. Demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → validate independently → MVP
3. Add User Story 2 → validate independently
4. Add User Story 3 → validate independently
5. Add User Story 4 → validate independently
6. Add User Story 5 → validate independently
7. Polish (Phase 8) → run the full quickstart.md suite

---

## Notes

- No dedicated test tasks are included — per the constitution, testing is encouraged but not mandatory for this project. `quickstart.md` (validated in T037) is the acceptance mechanism.
- [P] tasks touch different files with no unfinished dependency between them
- [Story] label maps each task to its user story for traceability back to spec.md
- Every schema change happens only via a TypeORM migration (T008), never `synchronize: true` (constitution Principle III)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently before moving to the next
