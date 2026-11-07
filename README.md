# Jira Project Management System

A full-stack project management application inspired by Jira, developed as a group project during my Full-Stack Development Internship at **UniParticle**.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Axios

**Backend**
- Python
- Django
- Django REST Framework
- SimpleJWT
- django-filter

## Features

- User registration and authentication
- JWT-based authentication
- Two-factor authentication (2FA)
- Project and membership management
- Task/card creation and management
- Task assignment and reporter information
- Task priorities and labels
- Comments and activity tracking
- Filtering and project organization

## Project Structure

```text
Hanya_Ayman_Jira_clone/
├── jira-clone/
│   ├── apps/
│   │   └── web/          # React + TypeScript frontend
│   ├── backend/          # Django REST Framework backend
│   ├── packages/
│   ├── tokens/
│   ├── package.json
│   └── ...
├── README.md
└── .gitignore
```

## Getting Started

### Backend

1. Navigate to the backend directory:

```bash
cd jira-clone/backend
```

2. Create and activate a virtual environment.

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure your environment variables using `.env.example`.

5. Run database migrations:

```bash
python manage.py migrate
```

6. Start the development server:

```bash
python manage.py runserver
```

### Frontend

1. Open another terminal and navigate to the frontend:

```bash
cd jira-clone
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend using the appropriate script defined in `package.json`.

## My Experience

This project allowed me to apply full-stack development concepts, work with REST APIs, integrate a React frontend with a Django backend, and collaborate on a team-based software project.

## Acknowledgements

Developed as a group project during my Full-Stack Development Internship at **UniParticle**.