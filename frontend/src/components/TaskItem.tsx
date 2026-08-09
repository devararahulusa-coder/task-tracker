import { useState } from 'react';
import type { Task, TaskStatus } from '../api/tasks';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onTitleChange: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function TaskItem({
  task,
  onStatusChange,
  onTitleChange,
  onDelete,
}: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    void onStatusChange(task.id, isCompleted ? 'pending' : 'completed');
  }

  function startEditing() {
    setDraftTitle(task.title);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError(null);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"?`)) {
      void onDelete(task.id);
    }
  }

  async function saveTitle() {
    if (draftTitle.trim().length === 0) {
      setError('Title is required.');
      return;
    }

    try {
      await onTitleChange(task.id, draftTitle.trim());
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update task.');
    }
  }

  if (isEditing) {
    return (
      <li className="task-item">
        <input
          type="text"
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          aria-label="Edit task title"
        />
        <button type="button" onClick={() => void saveTitle()}>
          Save
        </button>
        <button type="button" onClick={cancelEditing}>
          Cancel
        </button>
        {error && (
          <p className="task-item__error" role="alert">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="task-item">
      <label className="task-item__status-toggle">
        <input type="checkbox" checked={isCompleted} onChange={handleToggle} />
        <span className="task-item__title">{task.title}</span>
      </label>
      <span className="task-item__status">
        {isCompleted ? 'Completed' : 'Pending'}
      </span>
      <button type="button" onClick={startEditing}>
        Edit
      </button>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
