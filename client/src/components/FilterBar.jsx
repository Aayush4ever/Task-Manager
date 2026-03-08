// AI-generated, reviewed and modified
export default function FilterBar({ filter, setFilter, counts }) {
  const filters = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          className={`filter-bar__btn ${filter === key ? 'filter-bar__btn--active' : ''}`}
          onClick={() => setFilter(key)}
          aria-pressed={filter === key}
        >
          {label}
          <span className="filter-bar__count">{count}</span>
        </button>
      ))}
    </div>
  );
}
