# Contract: Task API

REST API exposed by the `backend/` NestJS app to the `frontend/` React app. All
request/response bodies are JSON. This is the single external interface for this
feature (no other consumers). Field types and validation rules are defined in
[data-model.md](../data-model.md).

Base path: `/tasks`

## `GET /tasks`

List tasks, optionally filtered by status. Implements FR-003, FR-010.

**Query parameters**:

| Name | Values | Required | Effect |
|---|---|---|---|
| `status` | `pending` \| `completed` | no | Restricts the list to that status. Omit for "All". |

**Response `200`**: array of Task, ordered by `createdAt` descending.

```json
[
  { "id": 2, "title": "Write report", "status": "pending", "createdAt": "2026-08-08T10:15:00.000Z" },
  { "id": 1, "title": "Buy milk", "status": "completed", "createdAt": "2026-08-08T09:00:00.000Z" }
]
```

**Response `400`**: `status` provided but not one of the two valid values.

## `POST /tasks`

Create a task. Implements FR-001, FR-002, FR-004.

**Request body**:

```json
{ "title": "Buy milk" }
```

**Response `201`**: the created Task (`status` is always `pending`).

```json
{ "id": 3, "title": "Buy milk", "status": "pending", "createdAt": "2026-08-08T11:00:00.000Z" }
```

**Response `400`**: `title` missing, empty, or whitespace-only.

## `PATCH /tasks/:id`

Update a task's `title` and/or `status`. Implements FR-005, FR-006, FR-007.
At least one of `title`/`status` should be present; either may be provided alone.

**Request body** (either or both fields):

```json
{ "title": "Buy oat milk" }
```

```json
{ "status": "completed" }
```

**Response `200`**: the updated Task.

**Response `400`**: `title` provided but empty/whitespace-only (task's title is left
unchanged — FR-006), or `status` provided but not `pending`/`completed`.

**Response `404`**: no task with that `id` exists.

## `DELETE /tasks/:id`

Permanently delete a task. Implements FR-008. Confirmation (FR-009) is a frontend
concern (see research.md) — by the time this endpoint is called, the user has
already confirmed; the backend deletes unconditionally.

**Response `204`**: task deleted, no body.

**Response `404`**: no task with that `id` exists.

## Error format

Errors use NestJS's default shape:

```json
{ "statusCode": 400, "message": "title must not be empty", "error": "Bad Request" }
```

No custom error envelope is introduced (constitution Principle I).
