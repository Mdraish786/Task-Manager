# TaskFlow — Task Management Application

A full-stack task management web app with authentication, CRUD operations, filtering, and a responsive dark UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Storage | In-memory (easily swappable with MongoDB/PostgreSQL) |
| Styling | Custom CSS with CSS Variables |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   └── db.js            # In-memory data store + demo user
│   ├── routes/
│   │   ├── auth.js          # POST /register, POST /login, GET /me
│   │   └── tasks.js         # Full CRUD for tasks
│   ├── server.js            # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TaskCard.js + .css
│   │   │   └── TaskModal.js + .css
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state + API base
│   │   ├── hooks/
│   │   │   └── useTasks.js      # Task CRUD hook
│   │   ├── pages/
│   │   │   ├── Login.js + Auth.css
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js + .css
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn

### 1. Start the Backend

```bash
cd backend
npm install
npm start       # runs on http://localhost:5000
# or
npm run dev     # with auto-reload (nodemon)
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start       # runs on http://localhost:3000
```

The frontend proxies API calls to `http://localhost:5000` automatically (configured in package.json).

---

## Demo Account

A seeded demo account is available out of the box:

| Field | Value |
|-------|-------|
| Email | `demo@example.com` |
| Password | `password123` |

> Click **"Use demo account"** on the login page to auto-fill.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all user tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task (all fields) |
| PATCH | `/api/tasks/:id/status` | Update status only |
| DELETE | `/api/tasks/:id` | Delete task |

### Task Schema
```json
{
  "title": "string (required)",
  "description": "string",
  "priority": "low | medium | high",
  "status": "todo | in-progress | done",
  "category": "general | work | personal | health | learning | finance",
  "dueDate": "ISO date string"
}
```

---

## Features

- **Authentication**: Register/login with JWT stored in localStorage; protected routes
- **Task CRUD**: Create, view, edit, delete tasks
- **Status Management**: Inline status dropdown on each task card
- **Filtering**: Filter by status (All / To Do / In Progress / Done)
- **Sorting**: Sort by newest, oldest, priority, or due date
- **Search**: Real-time client-side search across title, description, category
- **Progress Tracker**: Completion percentage bar in sidebar
- **Responsive Design**: Mobile-friendly layout
- **Overdue Detection**: Tasks past their due date are visually flagged

---

## Replacing In-Memory Storage with a Real Database

The `backend/models/db.js` file is a plain JS object. To switch to MongoDB:

1. `npm install mongoose`
2. Create a `User` and `Task` model with Mongoose schemas
3. Replace the array operations in `routes/auth.js` and `routes/tasks.js` with Mongoose queries
4. Add `mongoose.connect(process.env.MONGO_URI)` in `server.js`

For PostgreSQL, use `pg` or an ORM like `Sequelize` / `Prisma` following the same pattern.

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
JWT_SECRET=your-very-long-random-secret-key
```

For the frontend, create `.env` in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```
