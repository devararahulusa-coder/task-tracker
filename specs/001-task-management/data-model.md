# Data Model: Task Management

Derived from the spec's Key Entities (Task) and Functional Requirements. One entity,
no relationships — matches the single-resource scope of this feature.

## Task

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | integer (auto-increment) | generated | Primary key. Identifies a task independently of its title (spec Clarifications: duplicate titles permitted). |
| `title` | string (max 200 chars) | yes | Trimmed before validation/storage. MUST NOT be empty or whitespace-only (FR-002, FR-006). Duplicate titles across different tasks are allowed. |
| `status` | enum: `pending` \| `completed` | yes | Defaults to `pending` on creation (FR-004). Mutable in both directions (FR-007). |
| `createdAt` | timestamp | generated | Set once at creation; used to order the list newest-first (FR-003, Clarifications). Never updated. |

No `updatedAt` field is included: no functional requirement or success criterion
depends on tracking last-modified time, and adding it would be an unjustified
field per constitution Principle I (Simplicity & YAGNI).

### Validation rules

- `title`: required; after trimming leading/trailing whitespace, MUST have length
  ≥ 1 and ≤ 200 characters. A create or update request with an empty/whitespace-only
  title is rejected (400) and — for updates — the task's existing title is left
  unchanged (FR-006).
- `status`: when provided on update, MUST be exactly `pending` or `completed`; any
  other value is rejected (400). Not settable on create (always starts `pending`).

### State transitions

```
pending  --(mark completed)--> completed
completed --(mark pending)--> pending
```

Both transitions are user-initiated (FR-007) and reversible; there is no terminal
state and no transition triggered by anything other than an explicit user action.
Editing `title` never changes `status`, and changing `status` never changes `title`
(spec Edge Cases).

### Lifecycle

- **Create**: `status` = `pending`, `createdAt` = now. (FR-001, FR-004)
- **Read**: list all tasks, optionally filtered by `status`, ordered by `createdAt`
  descending. (FR-003, FR-010)
- **Update**: `title` and/or `status` may be changed independently or together.
  (FR-005, FR-007)
- **Delete**: permanent, unconditional at the data layer once invoked (confirmation
  happens client-side before the call is made — see research.md). (FR-008, FR-009)
