// AI-generated, reviewed and modified
import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/tasks';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Fetch all tasks (with optional server-side filter)
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = filter !== 'all' ? `${API_BASE}?status=${filter}` : API_BASE;
      const res = await fetch(url);

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Failed to fetch tasks');
      }

      const { data } = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const addTask = useCallback(async ({ title, priority }) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create task');

      // Prepend to list (newest first)
      setTasks((prev) => [body.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Toggle complete/incomplete
  const toggleTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t._id === id);
      if (!task) return;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );

      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !task.completed }),
        });

        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to update task');

        // Sync with server response
        setTasks((prev) => prev.map((t) => (t._id === id ? body.data : t)));

        // If filtered view, re-fetch to remove item from list
        if (filter !== 'all') {
          fetchTasks();
        }
      } catch (err) {
        // Revert optimistic update on failure
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, completed: task.completed } : t))
        );
        setError(err.message);
      }
    },
    [tasks, filter, fetchTasks]
  );

  // Update task title and/or priority (inline edit)
  const updateTask = useCallback(async (id, { title, priority }) => {
    const original = tasks.find((t) => t._id === id);
    if (!original) return { success: false, error: 'Task not found' };

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, title, priority } : t))
    );

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to update task');

      // Sync with server truth
      setTasks((prev) => prev.map((t) => (t._id === id ? body.data : t)));
      return { success: true };
    } catch (err) {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t._id === id ? original : t)));
      return { success: false, error: err.message };
    }
  }, [tasks]);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to delete task');
      }
    } catch (err) {
      // Revert on failure by re-fetching
      fetchTasks();
      setError(err.message);
    }
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
