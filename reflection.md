# Reflection — AI-Assisted Development

> 1-page reflection on using Cursor/GitHub Copilot to build this task manager.
> Word count: ~520 words

---

## Two moments where AI saved significant time

**1. Scaffolding the Express server and MongoDB model (Task 1 & 2)**

The biggest time save came right at the start. I opened a blank folder, gave Cursor a single prompt describing the stack (Express, Mongoose, REST API for tasks), and within seconds I had a working `server.js` with CORS configured, a Mongoose schema with the right field types, and the full folder structure. What would have taken me 20–30 minutes of boilerplate setup and documentation-checking was done in under 2 minutes. What made this prompt work was being *specific about the inputs and outputs*: I didn't just say "make an API", I described the exact shape of the data (`{ title: string, priority: "low"|"medium"|"high", completed: boolean }`), which gave the AI enough context to generate something immediately usable rather than something I'd have to completely rewrite.

**2. Generating the React component structure with Hooks (Task 3)**

When I asked the AI to "create a custom hook that fetches tasks and exposes addTask, toggleTask, deleteTask," it gave me a clean separation of concerns I might have arrived at eventually, but not on the first pass. The pattern of returning `{ success, error }` from mutation functions — rather than throwing — was actually the AI's suggestion, and it was a better design for the UI layer. This prompt worked because I specified *what the hook should expose*, not how to build it internally.

---

## Two moments where AI generated wrong or incomplete code

**1. No error handling on fetch calls**

Every single fetch call in the initial hook came back without `try/catch`. The AI assumed a perfect network and a always-OK response. I detected this by mentally tracing what happens when the server is down or returns a 400 — the code would silently fail with a runtime exception and the user would see nothing. This is a pattern I now watch for immediately in any AI-generated async code.

**2. State mutation in `toggleTask`**

The AI wrote `task.completed = !task.completed` and then spread the array. This looks plausible at a glance — you're "updating" the array — but it breaks React's immutability model and can prevent re-renders from firing correctly. I caught it because I noticed the object was being mutated before `setTasks` was called, which is a red flag I've learned to spot from experience with React.

---

## How AI changed my workflow

AI-assisted development shifted my role from *writer* to *reviewer*. Instead of writing code line by line, I found myself evaluating generated blocks, testing them mentally, and asking follow-up prompts to fix edge cases. This is faster for scaffolding and repetitive patterns, but it demands more active critical thinking, not less — you have to know enough to spot what's wrong.

On a real project, yes, I'd use it. But I'd treat AI output the same way I'd treat code written by a very fast junior developer: useful, often correct, but requiring a careful review before it merges.

---

## What juniors should be careful about

The biggest risk for junior developers is **trusting AI-generated code they don't fully understand**. AI can generate code that *looks* idiomatic and passes a quick read, but contains subtle bugs (like the state mutation above) that only surface under specific conditions. If you can't explain every line, you can't debug it when it breaks in production — and it will break. AI editors are productivity tools, not a substitute for understanding the fundamentals.
