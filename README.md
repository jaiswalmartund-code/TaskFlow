# TaskFlow 

A modern, high-performance full-stack project management application designed for seamless team collaboration, task tracking, and personal productivity. Built with a sleek index card & glassmorphism visual design system.

---

##  Features

- **Dynamic Dashboards & Kanban Boards**:
  - Interactive Kanban board (To Do, In Progress, Done) with smooth status updates.
  - List view toggle for compact task management.
  - **Color-coded progress bars**: Auto-calculated project completion status (<34% Red, 34%–66% Yellow/Amber, ≥67% Green).
  - **Clickable Upcoming Deadlines**: Direct navigation to projects with highlighted overdue badges.

- **Role-Based Permissions & Invitation System**:
  - **Product Manager**: Full project management, task creation/deletion/assignment, inviting teammates, and project settings.
  - **Contributor**: Restricted access — can only view tasks assigned to them and update their status.
  - **Invitation Request Workflow**: Send role-based invitation requests to user profiles. Teammates receive instant bell notifications to **Accept** or **Decline**.

- **Dual Sticky Notes System**:
  - **Project Task Sticky Notes**: Pin feedback, remarks, and reminders directly onto project tasks with custom pastel paper colors (`Yellow`, `Green`, `Blue`, `Pink`, `Amber`) and paper tape overlays.
  - **Personal Sticky Notes To-Do List**: Dedicated personal scratchpad and to-do list on the home dashboard for quick personal task tracking.

- **Floating Liquid Glass Navbar & GitHub Integration**:
  - Seamless sticky top navigation bar featuring **Home** and **Code** pill tabs.
  - **GitHub Integration**: Connect GitHub repositories, track commit streams, review pull requests, and monitor CI/CD pipeline statuses.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, TanStack React Query, React Router DOM, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), JWT Authentication, bcryptjs.
- **Database**: Local MongoDB (`mongodb://127.0.0.1:27017/taskflow`) or MongoDB Atlas.

---

## Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.x or higher installed.
- **MongoDB**: Local MongoDB instance running at `mongodb://127.0.0.1:27017` OR a MongoDB Atlas cluster URI.

---

### Step 1: Backend Setup (`server`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating `.env` in `server/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=super_secret_jwt_key_taskflow_2026
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API server will run at `http://localhost:5000`. You can verify health status at `http://localhost:5000/api/health`.*

---

### Step 2: Frontend Setup (`client`)

1. In a new terminal window, navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating `.env` in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client app will launch at `http://localhost:5173`.*

---

## Project Architecture

```
taskflow/
├── server/                    # Node.js + Express backend API
│   ├── src/
│   │   ├── config/            # DB connection (MongoDB)
│   │   ├── controllers/       # Route logic (Auth, Projects, Tasks, Invitations, Notes)
│   │   ├── middleware/        # JWT Authentication, Error handling
│   │   ├── models/            # Mongoose Schemas (User, Project, Task, Invitation, PersonalNote)
│   │   ├── routes/            # Express endpoint routers
│   │   └── server.js          # Main server entry point
│   └── .env                   # Server environment variables
│
└── client/                    # React + Vite frontend SPA
    ├── src/
    │   ├── api/               # Axios API client modules
    │   ├── components/        # UI Components (Navbar, ProjectCard, MemberPanel, StickyNotes, Modals)
    │   ├── context/           # Global AuthContext & state management
    │   ├── pages/             # Login, Signup, Dashboard, ProjectDetail, GitHubIntegration
    │   ├── App.jsx            # React Router routes
    │   └── main.jsx           # React app entry point
    └── .env                   # Client environment variables
```

---

## Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token |
| `GET` | `/api/projects` | List all projects for logged-in user |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Fetch project details & member roles |
| `DELETE`| `/api/projects/:id` | Delete project and associated tasks/invitations |
| `POST` | `/api/projects/:id/members` | Send project invitation request |
| `GET` | `/api/tasks?project=:id` | Fetch tasks filtered by project & user permissions |
| `POST` | `/api/tasks/:id/remarks` | Pin sticky note remark to a project task |
| `GET` | `/api/invitations` | Get pending invitation requests for user profile |
| `POST` | `/api/invitations/:id/respond` | Accept or decline project invitation |
| `GET` | `/api/personal-notes` | Fetch personal sticky notes for home dashboard |
| `POST` | `/api/personal-notes` | Create a new personal sticky note |

---
