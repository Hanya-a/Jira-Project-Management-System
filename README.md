# Jira Clone — Team Project Management Platform

A full-stack project management app inspired by Jira. Teams create projects, add members, and track work as cards on a board, with assignees, reporters, priorities, labels, comments, work logs, and an automatic activity history. Built as a group project during a Full-Stack Development Internship at **UniParticle**.

## Tech Stack

**Backend**
- Python, Django, Django REST Framework
- SimpleJWT (JWT authentication with token refresh)
- PyOTP and qrcode (TOTP two-factor authentication)
- django-filter (filtering, search, ordering)
- SQLite (default)

**Frontend**
- React 19, TypeScript, Vite
- Redux Toolkit, React Router
- React Hook Form and Zod (forms and validation)
- Axios API client with automatic token refresh
- npm workspaces monorepo with a shared package (`@jira-clone/shared`) holding types, hooks, services, stores, and design tokens

## Features

- **Authentication:** registration, login, logout, and token refresh with JWT.
- **Two-factor authentication (2FA):** users can enable TOTP 2FA (QR code setup, then confirm with a code). When enabled, login returns `requires_2fa` and the user completes sign-in with a 6-digit code.
- **Projects and membership:** each project has a unique key (e.g. `PRO-1`) and a member list. Users only see projects they belong to, and the creator is added as a member automatically.
- **Cards:** create and manage cards with a status (To Do, In Progress, In Review, Done), priority (Lowest to Highest), due date, assignee, reporter, and labels. Cards get an automatic key (e.g. `CARD-12`), and the creator becomes the reporter.
- **Role-based card rules:**
  - Only project members can create cards, and the assignee must be a project member.
  - The assignee can change a card's status, but cannot mark it Done.
  - The reporter can only mark a card as Done.
  - Only the assignee can delete a card or move it to another project.
- **Labels, comments, and work logs:** project-scoped labels, comments on cards, and time tracking (time spent, remaining, start date, description).
- **Activity history:** changes to a card's name, summary, status, assignee, priority, due date, and labels are logged automatically and shown in an activity log.
- **Move cards between projects:** each move is recorded with the source project, destination project, and who moved it.
- **Search, filter, and order:** search cards by name, summary, or key; filter by status, priority, assignee, reporter, project, and label; order by name, priority, status, due date, or created/updated time.

## Data Model

| Model | Purpose |
|---|---|
| `User` | Custom user (extends Django's `AbstractUser`) with 2FA flag and secret |
| `ProjectModel` | Name, key, description, status, members, creator |
| `CardModel` | Card details, status, priority, due date, assignee, reporter, labels, project |
| `Label` | Label belonging to a project |
| `Comment` | Comment on a card by an author |
| `WorkLog` | Time spent and remaining on a card |
| `HistoryModel` | Activity log entry for a card |
| `Move` | Record of a card moving between projects |

## API Endpoints

Base paths: `/authentication/` and `/card_manager/`. Everything except register, login, 2FA verification, and token refresh requires a JWT (`Authorization: Bearer <access_token>`).

| Endpoint | Description |
|---|---|
| `POST /authentication/register/` | Create an account |
| `POST /authentication/login/` | Log in (returns tokens, or `requires_2fa`) |
| `POST /authentication/logout/` | Blacklist a refresh token |
| `POST /authentication/token/refresh/` | Get a new access token |
| `POST /authentication/2fa/setup/` | Start 2FA setup (logged in) |
| `POST /authentication/2fa/setup/verify/` | Confirm 2FA setup with a code (logged in) |
| `POST /authentication/2fa/verify/` | Complete login with a 2FA code |
| `/card_manager/projects/` | Projects (CRUD) |
| `/card_manager/cards/` | Cards (CRUD, with search, filters, ordering) |
| `/card_manager/label/` | Project labels |
| `/card_manager/comment/` | Card comments |
| `/card_manager/worklog/` | Work logs |
| `/card_manager/move/` | Move a card to another project |
| `/card_manager/history/` | Card activity history (read-only) |

## Project Structure

```text
jira-clone/
├── apps/
│   └── web/                  # React + TypeScript frontend
├── packages/
│   └── shared/               # Shared types, hooks, services, stores, design tokens
├── backend/                  # Django REST Framework backend
│   ├── authentication/       # Register, login, logout, 2FA
│   ├── card_manager/         # Projects, cards, labels, comments, work logs, history, moves
│   └── config/               # Settings and root URLs
├── docker-compose.yml
└── package.json              # npm workspaces
```

## Getting Started

### Backend

1. Go to the backend folder:

   ```bash
   cd jira-clone/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate      # Windows: .venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and set your values:

   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ```

5. Apply migrations and start the server:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

The API runs at `http://127.0.0.1:8000`.

### Frontend

1. From the `jira-clone` folder, install dependencies (this installs all workspaces):

   ```bash
   npm install
   ```

2. Start the web app:

   ```bash
   npm run web
   ```

3. Open the URL shown in the terminal (usually `http://localhost:5173`).

The frontend calls the API at `http://127.0.0.1:8000` (set in `packages/shared/src/lib/apiClient.ts`). For the browser to reach the backend, allow the frontend origin in `backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

## My Contribution

I built the Django REST Framework backend (authentication with 2FA, project and membership management, cards, the role-based permission rules, labels, comments, work logs, move tracking, and the activity history) and contributed to the React + TypeScript frontend.

## Acknowledgements

Developed as a group project during my Full-Stack Development Internship at **UniParticle**.
