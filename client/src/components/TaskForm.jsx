// AI-generated, reviewed and modified
import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const trimmed = title.trim();
    if (!trimmed) {
      setFormError('Task title is required.');
      return;
    }

    setSubmitting(true);
    const result = await onAdd({ title: trimmed, priority });
    setSubmitting(false);

    if (result.success) {
      setTitle('');
      setPriority('medium');
    } else {
      setFormError(result.error || 'Failed to add task.');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__header">
        <span className="task-form__label">New Task</span>
      </div>

      <div className="task-form__row">
        <div className="task-form__input-wrap">
          <input
            className={`task-form__input ${formError ? 'task-form__input--error' : ''}`}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError('');
            }}
            placeholder="What needs to be done?"
            maxLength={200}
            disabled={submitting}
            aria-label="Task title"
          />
          {formError && (
            <span className="task-form__error" role="alert">
              {formError}
            </span>
          )}
        </div>

        <select
          className="task-form__select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={submitting}
          aria-label="Task priority"
        >
          <option value="low">↓ Low</option>
          <option value="medium">→ Medium</option>
          <option value="high">↑ High</option>
        </select>

        <button
          type="submit"
          className="task-form__btn"
          disabled={submitting || !title.trim()}
          aria-label="Add task"
        >
          {submitting ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
