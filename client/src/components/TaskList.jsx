// AI-generated, reviewed and modified
import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, error, onToggle, onDelete, onUpdate, filter }) {
  if (loading) {
    return (
      <div className="task-list__state" aria-live="polite">
        <div className="skeleton-list">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-item" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list__state task-list__state--error" role="alert">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    const emptyMessages = {
      all: { icon: '✦', text: 'No tasks yet. Add one above to get started.' },
      active: { icon: '◎', text: 'No active tasks. All done!' },
      completed: { icon: '◉', text: 'No completed tasks yet.' },
    };
    const msg = emptyMessages[filter] || emptyMessages.all;

    return (
      <div className="task-list__empty" aria-live="polite">
        <span className="task-list__empty-icon">{msg.icon}</span>
        <p>{msg.text}</p>
      </div>
    );
  }

  return (
    <ul className="task-list" aria-label="Task list" aria-live="polite">
      {tasks.map((task, index) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </ul>
  );
}
