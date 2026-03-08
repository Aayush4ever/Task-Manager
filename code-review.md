# Code Review — AI-Generated Code Issues

> As part of Task 4, I reviewed all AI-generated code and identified the following issues. Each entry includes the file, what was wrong, and how I fixed it.

---

## Issue 1 — Missing error handling in React fetch calls (useTasks.js)

**File:** `client/src/hooks/useTasks.js`  
**Lines:** Initial version of `addTask`, `toggleTask`, `deleteTask`

**What was wrong:**  
The AI initially generated fetch calls without any `try/catch` blocks. If the network request failed or returned a non-OK response, the component would silently fail with no user feedback. Example of what it generated:

```js
// ❌ AI-generated (original — no error handling)
const addTask = async ({ title, priority }) => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority }),
  });
  const data = await res.json();
  setTasks((prev) => [data, ...prev]);
};
```

**How I fixed it:**  
Wrapped all fetch calls in `try/catch`, checked `res.ok` explicitly, and returned `{ success, error }` objects so the UI can display errors to the user.

```js
// ✅ Fixed
const addTask = async ({ title, priority }) => {
  try {
    const res = await fetch('/api/tasks', { ... });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to create task');
    setTasks((prev) => [body.data, ...prev]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
```

---

## Issue 2 — State mutation instead of creating new objects (TaskList)

**File:** `client/src/hooks/useTasks.js`  
**Lines:** Initial `toggleTask` function

**What was wrong:**  
The AI's first version mutated the task object directly before setting state, which breaks React's immutability contract and can cause subtle re-render bugs:

```js
// ❌ AI-generated (original — direct mutation)
const toggleTask = (id) => {
  const task = tasks.find((t) => t._id === id);
  task.completed = !task.completed; // MUTATES existing object
  setTasks([...tasks]);             // Spread doesn't help — object is already mutated
};
```

**How I fixed it:**  
Used `.map()` to return a new array with a new task object (spread operator), preserving immutability:

```js
// ✅ Fixed — creates new object
setTasks((prev) =>
  prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
);
```

---

## Issue 3 — Missing `key` prop on React list items (TaskList)

**File:** `client/src/components/TaskList.jsx`  
**Lines:** Initial `ul` rendering

**What was wrong:**  
The AI's first draft used the array index as the `key` prop, which causes incorrect reconciliation when items are deleted or reordered:

```jsx
// ❌ AI-generated (original — index as key)
{tasks.map((task, index) => (
  <TaskItem key={index} task={task} ... />
))}
```

**How I fixed it:**  
Used the MongoDB `_id` field as the key, which is stable and unique:

```jsx
// ✅ Fixed — stable unique ID
{tasks.map((task) => (
  <TaskItem key={task._id} task={task} ... />
))}
```

---

## Issue 4 — Hardcoded API URL instead of using the Vite proxy (component files)

**File:** `client/src/hooks/useTasks.js`  
**Lines:** `API_BASE` constant

**What was wrong:**  
The AI initially hardcoded the full backend URL including hostname and port:

```js
// ❌ AI-generated (original — hardcoded)
const API_BASE = 'http://localhost:5000/api/tasks';
```

This breaks in any environment other than local development (staging, production, Docker) and bypasses the Vite dev proxy, causing CORS issues.

**How I fixed it:**  
Used a relative path, letting the Vite proxy (configured in `vite.config.js`) route the request:

```js
// ✅ Fixed — relative path, works in all environments
const API_BASE = '/api/tasks';
```

---

## Issue 5 — No CastError handling for invalid MongoDB ObjectIDs (routes/tasks.js)

**File:** `server/routes/tasks.js`  
**Lines:** GET `/api/tasks/:id`, PATCH `/:id`, DELETE `/:id`

**What was wrong:**  
The AI generated route handlers that only had a generic `catch` block. If the client sent a malformed ID (e.g., `GET /api/tasks/not-a-real-id`), Mongoose throws a `CastError` which the generic handler returned as a 500:

```js
// ❌ AI-generated (original — generic catch only)
} catch (error) {
  res.status(500).json({ error: 'Server error' });
}
```

**How I fixed it:**  
Added explicit `CastError` detection to return a meaningful 400 response:

```js
// ✅ Fixed
} catch (error) {
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid task ID format' });
  }
  res.status(500).json({ success: false, error: 'Server error' });
}
```

---

## Bonus — AI Self-Review

I pasted `useTasks.js` into Copilot Chat and asked: *"What bugs or issues does this code have?"*

The AI correctly identified:
- The missing `try/catch` on fetch calls ✅
- The index-as-key issue ✅

It did **not** identify:
- The state mutation issue ✗ (it said the spread looked fine)
- The hardcoded URL issue ✗ (it suggested keeping the full URL for "clarity")
- The `CastError` gap ✗ (it doesn't know Mongoose's error types from context alone)

**Takeaway:** AI self-review is useful as a first pass but cannot substitute for a developer who knows the framework's error modes and architectural constraints.
