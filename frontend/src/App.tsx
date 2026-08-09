import { useEffect, useState } from 'react';
import type { Task, TaskStatus } from './api/tasks';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import type { TaskFilterValue } from './components/TaskFilter';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilterValue>('all');

  useEffect(() => {
    const status = filter === 'all' ? undefined : filter;
    getTasks(status)
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [filter]);

  async function handleCreate(title: string) {
    const task = await createTask(title);
    if (filter === 'all' || filter === 'pending') {
      setTasks((current) => [task, ...current]);
    }
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const updated = await updateTask(id, { status });
    setTasks((current) =>
      filter === 'all' || filter === status
        ? current.map((task) => (task.id === id ? updated : task))
        : current.filter((task) => task.id !== id),
    );
  }

  async function handleTitleChange(id: number, title: string) {
    const updated = await updateTask(id, { title });
    setTasks((current) =>
      current.map((task) => (task.id === id ? updated : task)),
    );
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main>
      <h1>Task Tracker</h1>
      <TaskForm onSubmit={handleCreate} />
      <TaskFilter value={filter} onChange={setFilter} />
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onTitleChange={handleTitleChange}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default App;
