export type TaskFilterValue = 'all' | 'pending' | 'completed';

interface TaskFilterProps {
  value: TaskFilterValue;
  onChange: (value: TaskFilterValue) => void;
}

const OPTIONS: { value: TaskFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function TaskFilter({ value, onChange }: TaskFilterProps) {
  return (
    <div className="task-filter" role="group" aria-label="Filter tasks">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            option.value === value
              ? 'task-filter__option is-active'
              : 'task-filter__option'
          }
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
