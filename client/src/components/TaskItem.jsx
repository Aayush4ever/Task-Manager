// AI-generated, reviewed and modified
import { useState, useRef, useEffect } from 'react';

const PRIORITY_LABELS = { high: '↑ High', medium: '→ Med', low: '↓ Low' };

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editError, setEditError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const openEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError('');
  };

  const handleSave = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditError('Title cannot be empty.');
      inputRef.current?.focus();
      return;
    }
    if (trimmed === task.title && editPriority === task.priority) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await onUpdate(task._id, { title: trimmed, priority: editPriority });
    setSaving(false);
    if (result.success) {
      setEditing(false);
    } else {
      setEditError(result.error || 'Failed to save. Try again.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') cancelEdit();
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
  };

  // ── Edit mode ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <li className={`task-item task-item--editing task-item--${editPriority}`}>
        <div className="task-item__edit-body">
          <div className="task-item__edit-row">
            <input
              ref={inputRef}
              className={`task-item__edit-input ${editError ? 'task-item__edit-input--error' : ''}`}
              value={editTitle}
              onChange={(e) => { setEditTitle(e.target.value); setEditError(''); }}
              onKeyDown={handleKeyDown}
              maxLength={200}
              disabled={saving}
              aria-label="Edit task title"
            />
            <select
              className="task-item__edit-select"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              disabled={saving}
              aria-label="Edit task priority"
            >
              <option value="low">↓ Low</option>
              <option value="medium">→ Medium</option>
              <option value="high">↑ High</option>
            </select>
          </div>
          {editError && (
            <span className="task-item__edit-error" role="alert">{editError}</span>
          )}
          <div className="task-item__edit-actions">
            <button
              className="task-item__save-btn"
              onClick={handleSave}
              disabled={saving}
              aria-label="Save changes"
            >
              {saving ? (
                <span className="spinner spinner--sm" aria-hidden="true" />
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save
                </>
              )}
            </button>
            <button
              className="task-item__cancel-btn"
              onClick={cancelEdit}
              disabled={saving}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  // ── View mode ──────────────────────────────────────────────────────────────
  return (
    <li className={`task-item ${task.completed ? 'task-item--completed' : ''} task-item--${task.priority}`}>
      <button
        className="task-item__check"
        onClick={() => onToggle(task._id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={task.completed}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="task-item__content" onDoubleClick={openEdit} title="Double-click to edit">
        <span className="task-item__title">{task.title}</span>
        <span className="task-item__meta">
          <time className="task-item__date" dateTime={task.createdAt} title={new Date(task.createdAt).toLocaleString()}>
            {formatRelativeTime(task.createdAt)}
          </time>
        </span>
      </div>

      <span className={`task-item__priority task-item__priority--${task.priority}`} aria-label={`Priority: ${task.priority}`}>
        {PRIORITY_LABELS[task.priority]}
      </span>

      <button className="task-item__edit-btn" onClick={openEdit} aria-label={`Edit task: ${task.title}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      <button className="task-item__delete" onClick={handleDelete} disabled={deleting} aria-label={`Delete task: ${task.title}`}>
        {deleting ? (
          <span className="spinner spinner--sm" aria-hidden="true" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        )}
      </button>
    </li>
  );
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
