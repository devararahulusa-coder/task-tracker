# Feature Specification: Task Management

**Feature Branch**: `001-task-management`

**Created**: 2026-08-08

**Status**: Draft

**Input**: User description: "Build a small Task Tracker web application. A user can create a task with a title, view all tasks, edit a task title, mark a task as completed or pending, and delete a task. The task list should allow filtering by All, Pending, and Completed. Keep the application simple and do not add authentication or other features."

## Clarifications

### Session 2026-08-08

- Q: When a user views the task list, in what order should tasks be displayed? → A: Newest task first (most recently created at the top)
- Q: Should task titles need to be unique, or can a user create multiple tasks with the exact same title? → A: Duplicate titles are allowed — tasks are distinct by identity, not by title
- Q: When a user deletes a task, should the system ask for confirmation first, or delete it immediately? → A: Ask for confirmation before deleting (e.g., a confirm prompt)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and View Tasks (Priority: P1)

A user opens the application, types a title for something they need to do, and adds it
to their list. The task immediately appears in the task list so the user can see
everything they've captured.

**Why this priority**: Capturing tasks is the foundational value of a task tracker.
Without the ability to create and see tasks, no other feature has anything to operate
on.

**Independent Test**: Can be fully tested by opening the application, creating one or
more tasks with a title, and confirming each appears in the visible list. Delivers
value on its own as a simple running list of things to do.

**Acceptance Scenarios**:

1. **Given** an empty task list, **When** the user enters a title and submits it,
   **Then** a new task with that title appears in the list with a Pending status.
2. **Given** an existing list of tasks, **When** the user adds another task, **Then**
   the new task appears in the list alongside the existing ones without removing or
   altering them.
3. **Given** the task creation field, **When** the user submits without entering a
   title (or enters only whitespace), **Then** no task is created and the user is
   informed the title is required.

---

### User Story 2 - Mark Tasks Completed or Pending (Priority: P2)

A user works through their list and marks a task as completed once it's done. If they
change their mind, they can mark it back to pending.

**Why this priority**: Tracking progress — not just listing tasks — is what makes a
task tracker useful day to day, second only to being able to create tasks at all.

**Independent Test**: Can be fully tested by creating a task, marking it completed,
confirming its status changes, then marking it pending again and confirming it
reverts. Delivers value by letting a user distinguish finished work from outstanding
work.

**Acceptance Scenarios**:

1. **Given** a task with Pending status, **When** the user marks it completed,
   **Then** the task's status updates to Completed and is reflected immediately in the
   list.
2. **Given** a task with Completed status, **When** the user marks it pending,
   **Then** the task's status updates back to Pending.

---

### User Story 3 - Filter Tasks by Status (Priority: P3)

A user with a mix of finished and unfinished tasks switches between viewing All tasks,
only Pending tasks, or only Completed tasks, to focus on what matters right now.

**Why this priority**: Filtering adds significant usability once a list grows beyond a
handful of items, but the list is usable without it, so it ranks below creation and
status tracking.

**Independent Test**: Can be fully tested by creating a mix of pending and completed
tasks, then selecting each filter option and confirming only the matching tasks are
shown. Delivers value by letting users focus on relevant tasks without scrolling
through everything.

**Acceptance Scenarios**:

1. **Given** a list containing both pending and completed tasks, **When** the user
   selects the "Pending" filter, **Then** only tasks with Pending status are shown.
2. **Given** a list containing both pending and completed tasks, **When** the user
   selects the "Completed" filter, **Then** only tasks with Completed status are shown.
3. **Given** any filter is active, **When** the user selects "All", **Then** every
   task is shown regardless of status.

---

### User Story 4 - Edit a Task's Title (Priority: P4)

A user notices a task's wording is unclear or has changed and updates its title
without needing to delete and recreate it.

**Why this priority**: Useful for correcting mistakes or refining tasks, but less
central than creating, tracking, and filtering tasks.

**Independent Test**: Can be fully tested by creating a task, editing its title to a
new value, and confirming the list shows the updated title with the task's status
unchanged.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** the user edits its title to a new, non-empty
   value and saves, **Then** the task displays the updated title and keeps its
   existing status.
2. **Given** an existing task being edited, **When** the user attempts to save an
   empty (or whitespace-only) title, **Then** the edit is rejected and the task's
   original title is preserved.

---

### User Story 5 - Delete a Task (Priority: P5)

A user removes a task they no longer need to track, keeping their list relevant.

**Why this priority**: Important for keeping the list manageable long-term, but a user
can still get value from the tracker without it (e.g., by marking items completed
instead), so it's the lowest priority of the five.

**Independent Test**: Can be fully tested by creating a task, deleting it, and
confirming it no longer appears in the list under any filter.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** the user chooses to delete it and confirms the
   deletion, **Then** the task is permanently removed and no longer appears in the
   list under any filter.
2. **Given** an existing task, **When** the user chooses to delete it but does not
   confirm (cancels), **Then** the task remains unchanged in the list.

---

### Edge Cases

- What happens when the task list is empty under a given filter (e.g., no completed
  tasks yet)? The user should see a clear indication that there is nothing to show for
  that filter, not a blank or broken-looking screen.
- What happens if a user submits a task title that is only whitespace? It MUST be
  treated the same as an empty title and rejected.
- What happens if a user edits a task's title but resubmits the exact same (trimmed)
  title as before? This MUST succeed as a normal update, leaving the task's title and
  status unchanged — it is not an empty/whitespace title, so FR-006's rejection rule
  does not apply to it.
- What happens when a task is deleted while a specific filter (e.g., "Completed") is
  active? The list MUST update immediately to no longer show the deleted task.
- What happens to a task's status when its title is edited? The status MUST remain
  unchanged; editing the title MUST NOT affect completion state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to create a new task by providing a title.
- **FR-002**: System MUST reject creation of a task whose title is empty or consists
  only of whitespace, and MUST inform the user that a title is required.
- **FR-003**: System MUST display the list of all created tasks, showing each task's
  title and current status (Pending or Completed), ordered with the most recently
  created task shown first.
- **FR-004**: A newly created task MUST start with Pending status.
- **FR-005**: Users MUST be able to edit the title of an existing task.
- **FR-006**: System MUST reject an edit that would leave a task's title empty or
  whitespace-only, preserving the task's original title in that case. An edit that
  resubmits the task's current (non-empty) title unchanged is not empty/whitespace and
  MUST succeed as a normal update.
- **FR-007**: Users MUST be able to change a task's status from Pending to Completed
  and from Completed back to Pending.
- **FR-008**: Users MUST be able to permanently delete an existing task.
- **FR-009**: System MUST ask the user to confirm before permanently deleting a task,
  and MUST NOT delete the task unless the user confirms.
- **FR-010**: Users MUST be able to filter the displayed task list to show: All tasks,
  only Pending tasks, or only Completed tasks.
- **FR-011**: System MUST reflect any create, edit, status change, or delete action in
  the displayed list immediately, without requiring a manual refresh.
- **FR-012**: System MUST persist tasks so that previously created tasks remain
  available after the application is closed and reopened.
- **FR-013**: System MUST NOT require users to sign in, register, or otherwise
  authenticate to create, view, edit, complete, or delete tasks.

### Key Entities

- **Task**: A single to-do item tracked by the user. Key attributes: a title (text
  describing what needs to be done) and a status (either Pending or Completed).
  Each task is independent of every other task — there are no sub-tasks, categories,
  due dates, or ownership beyond the single implied user of this application. Tasks
  are identified independently of their title; duplicate titles across different
  tasks are permitted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a new task and see it appear in the list in under 10
  seconds from opening the application.
- **SC-002**: A user can determine, at a glance, how many of their tasks are still
  outstanding by switching to the "Pending" filter, without manually reading through
  completed items.
- **SC-003**: 100% of tasks a user creates remain visible and correctly reflect their
  latest title and status after the application is reloaded.
- **SC-004**: A user can go from an empty task list to having created several tasks,
  completed one, edited one, and deleted one, in under 2 minutes, without confusion
  about what happened after each action.

## Assumptions

- This is a single-user application: there is no login, account system, or concept of
  multiple separate users' task lists, per the explicit instruction to avoid
  authentication.
- A task has only a title and a status (Pending/Completed) — no due dates, priorities,
  descriptions, categories, or attachments, per the instruction to keep the
  application simple.
- Deleting a task is immediate and permanent; there is no undo, trash, or archive
  feature.
- The task list is expected to stay small enough that no pagination or search is
  needed, and no user-selectable sort options are needed beyond the fixed
  newest-first display order (FR-003) and status filtering.
- The selected filter (All/Pending/Completed) is a view preference only; it does not
  need to be remembered across application restarts.
- Task titles have a reasonable maximum length to prevent unbounded input; the exact
  limit is left as an implementation detail rather than a user-facing requirement.
