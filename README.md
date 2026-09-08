# Research Publication Management Portal

A MERN stack mini-project for managing faculty research publications — inspired by SIH 2025's "Authenticity Validator for Academia" theme.

Faculty members can register, log in, and submit details of their research publications (journal articles, conference papers, book chapters, and patents). Administrators can review, verify, reject, or delete these submissions, and manage department records.

## Features

- **Faculty:** Register, log in, add publications, edit their own submissions, view publication history, search all publications.
- **Admin:** Log in, view and verify/reject/delete any publication, manage departments, search publications.
- **Authentication:** JWT-based login with role-based access control (faculty vs admin).

## Tech Stack

- **Frontend:** React (React Router, Axios, Context API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **API Testing:** Postman

## Project Structure

```
MERN PROJECT/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── middleware/      # JWT auth + role-based guards
│   ├── models/          # User, Publication, Department schemas
│   ├── routes/          # Auth, Publications, Departments REST APIs
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios instance with auto token attachment
        ├── components/   # Navbar, ProtectedRoute
        ├── context/      # AuthContext for session state
        └── pages/        # Home, Login, Register, Dashboards, CRUD pages
```

## Getting Started

### Backend
```bash
cd backend
npm install
# create a .env file with MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint              | Access        |
|--------|-----------------------|---------------|
| POST   | /register              | Public        |
| POST   | /login                 | Public        |
| GET    | /publications           | Logged-in users |
| POST   | /publications           | Faculty       |
| PUT    | /publications/:id       | Owner or Admin |
| DELETE | /publications/:id       | Admin only    |
| GET    | /departments            | Logged-in users |
| POST   | /departments            | Admin only    |
| PUT    | /departments/:id        | Admin only    |
| DELETE | /departments/:id        | Admin only    |

## Note

This is a mini academic project built for learning purposes — not a production-grade research information management system.
