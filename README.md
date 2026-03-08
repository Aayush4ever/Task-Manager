# TaskFlow — AI-Assisted Task Manager

> Full Stack Developer Assignment — Built with Node.js, Express, React (Vite), and MongoDB.

---

## Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React 18, Vite, CSS      |
| Backend   | Node.js, Express 4       |
| Database  | MongoDB (Mongoose ODM)   |
| Fonts     | Syne, DM Sans, DM Mono   |

---

## Project Structure

```
task-manager-ai-assignment/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx       # Add task form
│   │   │   ├── TaskItem.jsx       # Single task row
│   │   │   ├── TaskList.jsx       # List + empty/loading states
│   │   │   └── FilterBar.jsx      # All / Active / Completed filters
│   │   ├── hooks/
│   │   │   └── useTasks.js        # API hook (fetch, add, toggle, delete)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js             # Proxy: /api → http://localhost:5000
│   └── package.json
│
├── server/                   # Express backend
│   ├── models/
│   │   └── Task.js                # Mongoose schema (title, priority, completed)
│   ├── routes/
│   │   └── tasks.js               # GET / POST / PATCH / DELETE routes
│   ├── middleware/
│   │   └── auth.js                # Auth middleware (Task 2 Challenge — reviewed, not wired)
│   ├── server.js                  # Entry point, MongoDB connection
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── code-review.md            # 5 AI code issues found and fixed
├── reflection.md             # 1-page reflection on AI-assisted development
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** running locally OR a [MongoDB Atlas](https://cloud.mongodb.com) URI
- **npm** v9+

---

## Setup Instructions

### 1. Clone / unzip the project

```bash
cd task-manager-ai-assignment
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` if needed (default connects to local MongoDB):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
NODE_ENV=development
```

Start MongoDB locally (if not using Atlas):

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

Start the server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # production
```

> Server runs on **http://localhost:5000**

---

### 3. Set up the frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

> React app runs on **http://localhost:5173**

The Vite proxy forwards all `/api` requests to the Express server — no CORS issues in development.

---

## API Reference

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/tasks`       | Get all tasks                        |
| GET    | `/api/tasks?status=active` | Get active tasks only       |
| GET    | `/api/tasks?status=completed` | Get completed tasks only |
| GET    | `/api/tasks/:id`   | Get single task by ID                |
| POST   | `/api/tasks`       | Create task `{ title, priority? }`   |
| PATCH  | `/api/tasks/:id`   | Update task `{ title?, priority?, completed? }` |
| DELETE | `/api/tasks/:id`   | Delete task                          |
| GET    | `/api/health`      | Health check                         |

### POST /api/tasks — Request Body

```json
{
  "title": "Fix the login bug",
  "priority": "high"
}
```

`priority` is optional — defaults to `"medium"`. Valid values: `"low"`, `"medium"`, `"high"`.

---

## Features

- ✅ List all tasks sorted by newest first
- ✅ Add a task with title + priority (low / medium / high)
- ✅ Toggle task complete / incomplete (optimistic update)
- ✅ Delete a task (optimistic update)
- ✅ Filter tasks: All / Active / Completed
- ✅ Input validation (title required, max 200 chars)
- ✅ MongoDB persistence via Mongoose
- ✅ Proper error handling on all API routes and frontend
- ✅ Loading skeleton and error states in UI
- ✅ Responsive design (mobile-friendly)
- ✅ Accessible (ARIA labels, roles, keyboard nav)

---

## AI Usage Notes

Files where AI assistance was used are marked with `// AI-generated, reviewed and modified` comments at the top. All AI-generated code was reviewed, tested, and modified before submission. See `code-review.md` for documented issues found and fixed.
