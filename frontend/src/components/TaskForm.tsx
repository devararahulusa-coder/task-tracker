import { useState } from 'react';
import type { FormEvent } from 'react';

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>;
}

function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('Title is required.');
      return;
    }

    try {
      await onSubmit(title.trim());
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create task.');
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">New task</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
      />
      <button type="submit">Add task</button>
      {error && (
        <p className="task-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
