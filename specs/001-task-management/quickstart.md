# Quickstart: Task Management

Validates the feature end-to-end against the acceptance scenarios in
[spec.md](./spec.md). See [data-model.md](./data-model.md) for the `Task` shape and
[contracts/tasks-api.md](./contracts/tasks-api.md) for the API used below.

## Prerequisites

- Node.js 20 LTS, npm
- A running PostgreSQL instance (local install or `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`)
- `backend/.env` configured with the database connection (see `backend/.env.example`)

## Setup

```bash
# Backend
cd backend
npm install
npm run migration:run   # applies the TypeORM migration(s) — synchronize is always false
npm run start:dev       # starts the API (default http://localhost:3000)

# Frontend (separate terminal)
cd frontend
npm install
npm run dev              # starts the Vite dev server (default http://localhost:5173)
```

## Validation scenarios

Each scenario maps to a user story in spec.md and can be run either through the UI
at `http://localhost:5173` or directly against the API with `curl`.

### 1. Create and view tasks (User Story 1)

```bash
curl -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' \
  -d '{"title":"Buy milk"}'
curl http://localhost:3000/tasks
```

**Expected**: the POST returns `201` with `status: "pending"`; the GET returns an
array containing that task. In the UI: typing a title and submitting shows the task
at the top of the list immediately.

### 2. Reject empty titles (User Story 1, edge case)

```bash
curl -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' -d '{"title":"   "}'
```

**Expected**: `400`. No task is created (confirm with `GET /tasks`).

### 3. Mark completed / pending (User Story 2)

```bash
curl -X PATCH http://localhost:3000/tasks/1 -H 'Content-Type: application/json' -d '{"status":"completed"}'
curl -X PATCH http://localhost:3000/tasks/1 -H 'Content-Type: application/json' -d '{"status":"pending"}'
```

**Expected**: each call returns `200` with the new `status`; the title is unchanged
by either call.

### 4. Filter by status (User Story 3)

```bash
curl "http://localhost:3000/tasks?status=pending"
curl "http://localhost:3000/tasks?status=completed"
curl http://localhost:3000/tasks
```

**Expected**: each returns only tasks matching that status; the unfiltered call
returns all tasks. In the UI: switching the All/Pending/Completed control updates
the visible list without a page reload.

### 5. Edit a task's title (User Story 4)

```bash
curl -X PATCH http://localhost:3000/tasks/1 -H 'Content-Type: application/json' -d '{"title":"Buy oat milk"}'
curl -X PATCH http://localhost:3000/tasks/1 -H 'Content-Type: application/json' -d '{"title":"   "}'
```

**Expected**: the first call returns `200` with the new title and unchanged status;
the second returns `400` and a follow-up `GET /tasks/1`-equivalent (`GET /tasks`)
shows the title was left unchanged.

### 6. Delete a task, with confirmation (User Story 5)

In the UI: choosing delete on a task shows a confirmation prompt; cancelling leaves
the task in the list; confirming removes it. Against the API directly (confirmation
is a frontend-only step per research.md):

```bash
curl -X DELETE http://localhost:3000/tasks/1
curl http://localhost:3000/tasks
```

**Expected**: `204`, then the task no longer appears in any subsequent `GET /tasks`
call, under any filter.

### 7. Persistence across restarts (SC-003)

```bash
# after creating a few tasks, stop and restart the backend
# (Ctrl+C the `npm run start:dev` process, then run it again)
curl http://localhost:3000/tasks
```

**Expected**: previously created tasks are still present with their latest titles
and statuses — proving persistence is to PostgreSQL, not in-memory.
