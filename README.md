# TaskFlow - Advanced Task Management System

A full-stack task management application with Redis caching, audit trails, secure authentication, and role-based access control.

---

## Features

### Authentication & Authorization

- JWT stored in HttpOnly cookies for secure session handling
- Next.js Middleware used to protect private routes
- Public routes: `/login`, `/register`
- Protected routes: `/tasks`, `/profile`, `/dashboard`
- Role-based access control (Admin vs Standard User)

---

## Task Management (Full CRUD)

- Create, update, and delete tasks
- Optimistic UI updates for responsive interactions
- Task reordering (move up/down)
- Real-time progress indicator
- Support for both Server Actions and API Routes

---

## Redis Caching (Per-User Cache)

- High-speed task loading using Redis
- Cache stored per user using `cache:tasks:userId`
- Cache TTL: 30 seconds
- Cache automatically cleared whenever a task is created, updated, or deleted
- UI badge shows whether data is from cache or live API
- Manual cache clear button available

### Caching Flow

1. User opens `/tasks`
2. Server checks Redis

   - If cache exists → return cached tasks
   - If not → fetch from backend API → store in Redis

3. Any task modification clears that user’s cache
4. Next request retrieves fresh data

---

## Audit Trail System

A complete monitoring layer that records all significant system actions.

### Logged Actions

#### Authentication

- Login success
- Login failure
- Logout

#### Task Operations

- Task created
- Task updated
- Task deleted

#### Redis Events

- Cache hit
- Cache write
- Cache invalidation

### Log Entry Structure

- User ID
- Action name
- Metadata (task ID, cache key, email, etc.)
- Timestamp (ISO)

---

## Admin Audit Dashboard

Accessible at: `/admin/audit-logs`

### Dashboard Features

- View detailed audit logs
- Filter by user
- Filter by action type
- Pagination support
- Efficient handling of large log datasets

---

## User Experience

- Built with Next.js 14 (App Router)
- TailwindCSS for styling
- Zod and React Hook Form for form validation
- Toast notifications
- Loading indicators and responsive layout
- Supports dark/light mode

---

## Tech Stack

**Frontend:** Next.js, TailwindCSS, React Hook Form, Zod
**Backend:** Node.js, Express, PostgreSQL, Redis, JWT, bcrypt

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL
- Redis

### Running the Application

You must run both frontend and backend using two separate terminals.

#### Terminal 1 — Frontend (Next.js)

```bash
npm install
npm run dev
```

#### Terminal 2 — Backend (Node.js)

```bash
cd task_management_server
npm install
node server.js
```

---

## Application URLs

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001](http://localhost:3001)

---

## Environment Configuration

### Backend (`task_management_server/.env`)

```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=task_management
DB_PASSWORD=your_db_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret_key

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Frontend (`task_app/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Project Structure

```
task_app/
├── app/
│   ├── tasks/          # Task CRUD + caching
│   ├── admin/          # Audit log dashboard
│   ├── api/            # API routes (if used)
│   └── lib/            # Redis and audit helpers
├── middleware.js        # Protected route logic
└── components/          # Shared UI components

task_management_server/
├── server.js            # Express backend
└── routes/              # API endpoint definitions
```

---

## API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

### Tasks

- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`

### Admin

- GET `/api/admin/audit-logs`

---

## Troubleshooting

### Redis Not Connecting

- Ensure Redis server is running

  ```bash
  redis-server
  ```

- Verify Redis credentials in `.env`

### PostgreSQL Issues

- Ensure PostgreSQL service is running
- Check database name, username, and password

### Middleware Blocking Pages

- Ensure JWT cookie exists
- Confirm that login and register pages are marked as public

TaskFlow — a secure, efficient, and production-ready task management system.
