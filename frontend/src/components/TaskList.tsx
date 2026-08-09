import type { Task, TaskStatus } from '../api/tasks';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>;
  onTitleChange: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function TaskList({
  tasks,
  onStatusChange,
  onTitleChange,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">No tasks to show.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onTitleChange={onTitleChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
