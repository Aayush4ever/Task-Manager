// AI-generated, reviewed and modified
import { useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import './App.css';

export default function App() {
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
  } = useTasks();

  // Compute counts for filter badges (from full data when filter is 'all', else approximate)
  const counts = useMemo(() => {
    // When not filtered, we have all tasks to count from
    if (filter === 'all') {
      return {
        all: tasks.length,
        active: tasks.filter((t) => !t.completed).length,
        completed: tasks.filter((t) => t.completed).length,
      };
    }
    // When filtered, we only know the count of the current filter
    return {
      all: '—',
      active: filter === 'active' ? tasks.length : '—',
      completed: filter === 'completed' ? tasks.length : '—',
    };
  }, [tasks, filter]);

  const completedCount = filter === 'all' ? counts.completed : 0;
  const totalCount = filter === 'all' ? counts.all : tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="app">
      {/* Background grid */}
      <div className="app__bg" aria-hidden="true" />

      <div className="app__container">
        {/* Header */}
        <header className="app__header">
          <div className="app__logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--accent)" fillOpacity="0.15" stroke="var(--accent)" strokeWidth="1.5"/>
              <path d="M9 16.5l4.5 4.5 9-10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="app__title">TaskFlow</span>
          </div>

          {filter === 'all' && totalCount > 0 && (
            <div className="app__progress" aria-label={`${progress}% complete`}>
              <div className="app__progress-bar" style={{ width: `${progress}%` }} />
              <span className="app__progress-label">{progress}%</span>
            </div>
          )}
        </header>

        {/* Subheading */}
        <div className="app__intro">
          <h1 className="app__heading">Your Tasks</h1>
          {!loading && filter === 'all' && (
            <p className="app__subheading">
              {totalCount === 0
                ? 'Start by adding your first task'
                : `${counts.active} remaining · ${completedCount} done`}
            </p>
          )}
        </div>

        {/* Add Task Form */}
        <TaskForm onAdd={addTask} />

        {/* Filter Bar */}
        <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
          filter={filter}
        />
      </div>

      <footer className="app__footer">
        <span>TaskFlow · AI Assignment · MongoDB + Express + React</span>
      </footer>
    </div>
  );
}
