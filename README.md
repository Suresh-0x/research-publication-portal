# 🎓 Research Publication Management Portal

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application designed to help academic institutions manage, track, search, and verify faculty research publications.

The portal provides separate workspaces for **Faculty** and **Administrators**, allowing faculty members to submit and monitor their publications while administrators manage verification, publication records, departments, and institutional reports.

---

## 🚀 Key Features

### 👨‍🏫 Faculty Portal

- **Faculty Registration & Login**
  - Secure faculty account registration.
  - Faculty ID and department-based registration.
  - JWT-based authentication.
  - Password-protected login.

- **Faculty Dashboard**
  - Overview of faculty publication activity.
  - Quick access to publication management features.

- **Add Publications**
  - Faculty can submit new research publications.
  - Publication categories:
    - Journal
    - Conference
    - Book Chapter
    - Patent
  - Publication details include:
    - Paper Title
    - Publication Type
    - Journal/Conference Name
    - Publication Year
    - DOI

- **My Publications**
  - View publications submitted by the logged-in faculty member.
  - Track verification status.
  - Update publication details where permitted.

- **Publication Status Tracking**
  - `PENDING`
  - `VERIFIED`
  - `REJECTED`

- **Search Publications**
  - Search and filter publications.
  - Faculty can access the common publication search functionality.

---

### 🛡️ Administrator Workspace

- **Admin Login**
  - Secure JWT-based authentication.
  - Role-based access control.

- **Admin Dashboard**
  - Total publications
  - Pending publications
  - Verified publications
  - Quick access to management modules.

- **Manage Publications**
  - View all publication records.
  - Review submitted publications.
  - Verify or reject publications.
  - Edit publication records.
  - Delete publication records.

- **Search Publications**
  - Search institutional publication records.
  - Filter publications based on available publication information.

- **Manage Departments**
  - View departments.
  - Add new departments.
  - Edit department details.
  - Delete departments where permitted.
  - Maintain faculty count associated with departments.

- **Reports**
  - Generate publication reports.
  - Export publication information as CSV.
  - Useful for institutional documentation and academic reporting.

---

## 📚 Publication Categories

The system supports four major publication types:

| Type | Description |
| :--- | :--- |
| **Journal** | Research papers published in academic journals |
| **Conference** | Research papers presented/published at conferences |
| **Book Chapter** | Research contributions published as book chapters |
| **Patent** | Registered or submitted research-related patents |

### Verification Status

| Status | Meaning |
| :--- | :--- |
| `PENDING` | Publication submitted and waiting for administrator review |
| `VERIFIED` | Publication approved by the administrator |
| `REJECTED` | Publication rejected by the administrator |

---

## ⚡ Performance & Backend Features

### 🔐 JWT Authentication

The application uses **JSON Web Tokens (JWT)** for secure user authentication.

Protected routes require a valid JWT token.

### 👥 Role-Based Authorization

The backend provides separate authorization levels for:

- Faculty
- Admin

Administrative operations such as publication verification, deletion, and department management are restricted to administrators.

### 🗄️ MongoDB Indexing

Indexes are implemented on frequently queried publication fields, including:

- `facultyId`
- `verificationStatus`
- `createdAt`
- `publicationYear`
- Compound indexes for frequently used query combinations

This improves database query performance as the publication collection grows.

### 📊 Aggregated Statistics API

The backend provides:

```text
GET /publications/stats
This endpoint provides publication statistics used by the Admin Dashboard.
🔒 Secure Environment Variables
Sensitive configuration values such as:
- MongoDB connection string
- JWT secret
- Email credentials
are stored in environment variables and are excluded from Git tracking.
📧 Password Reset
The application provides a password-reset workflow using email-based reset links.
🛠️ Tech Stack
Layer	Technologies
Frontend	React, React Router, Axios, Context API, CSS3
Backend	Node.js, Express.js, JWT, Nodemailer, Bcrypt.js, CORS
Database	MongoDB Atlas, Mongoose ODM
Authentication	JWT, bcryptjs
API Testing	Postman
Development	Vite / React development environment
Version Control	Git, GitHub


📁 Project Structure
MERN PROJECT/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   └── publicationController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Publication.js
│   │   └── Department.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── publicationRoutes.js
│   │   └── departmentRoutes.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │
    └── src/
        ├── api/
        │   └── api.js
        │
        ├── components/
        │   ├── Navbar.js
        │   └── ProtectedRoute.js
        │
        ├── context/
        │   └── AuthContext.js
        │
        ├── pages/
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── ForgotPassword.js
        │   ├── ResetPassword.js
        │   ├── FacultyDashboard.js
        │   ├── AddPublication.js
        │   ├── MyPublications.js
        │   ├── SearchPublications.js
        │   ├── AdminDashboard.js
        │   ├── ManagePublications.js
        │   └── ManageDepartments.js
        │
        ├── App.js
        └── index.js

📡 REST API Documentation
🔐 Authentication
Method	Endpoint	Description	Access
POST	/register	Register a faculty or admin account	Public
POST	/login	Authenticate user and return JWT	Public
POST	/forgot-password	Request a password reset link	Public
POST	/reset-password	Reset password using reset token	Public


📚 Publications
Method	Endpoint	Description	Access
GET	/publications/stats	Get publication statistics	Logged-in
GET	/publications	Get/search/filter publications	Logged-in
GET	/publications/:id	Get a specific publication	Logged-in
POST	/publications	Add a new publication	Faculty
PUT	/publications/:id	Update publication	Owner/Admin
PUT	/publications/:id/verify	Verify or reject publication	Admin
DELETE	/publications/:id	Delete publication	Admin


Publication Search
The publication listing API supports filtering/search functionality such as:
GET /publications?search=machine

Additional filters can include publication type, year, verification status, journal/conference, and DOI.
🏛️ Departments
Method	Endpoint	Description	Access
GET	/departments	Get all departments	Logged-in
GET	/departments/:id	Get department details	Logged-in
POST	/departments	Create department	Admin
PUT	/departments/:id	Update department	Admin
DELETE	/departments/:id	Delete department	Admin


💻 Local Setup & Installation
1. Clone the Repository
git clone https://github.com/Suresh-0x/research-publication-portal.git
cd research-publication-portal

2. Backend Setup
Navigate to the backend:
cd backend

Install dependencies:
npm install

Create a .env file inside the backend/ folder:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000

Start the backend development server:
npm run dev

Backend will run at:
http://localhost:5000

You can also check the API health endpoint:
GET http://localhost:5000/

Expected response:
{
  "message": "Research Publication Management Portal API is running",
  "status": "success"
}

3. Frontend Setup
Open another terminal and navigate to the frontend:
cd frontend

Install dependencies:
npm install

Create the frontend environment file:
REACT_APP_API_URL=http://localhost:5000

Start the React application:
npm start

The frontend will run at:
http://localhost:3000

🔑 User Roles
Faculty
Faculty users can:
- Register
- Login
- Logout
- Add publications
- View their publications
- Update their publications
- Search publications
- Track publication verification status
Faculty Navigation
Dashboard
Add Publication
My Publications
Search
Logout

Admin
Administrators can:
- Login
- View dashboard statistics
- View all publications
- Verify publications
- Reject publications
- Edit publication records
- Delete publication records
- Search publications
- Manage departments
- Generate CSV reports
- Logout
Admin Navigation
Dashboard
Publications
Search Publications
Departments
Logout

🔒 Security Features
The application implements several security mechanisms:
- Password hashing using bcryptjs.
- JWT-based stateless authentication.
- Protected frontend routes.
- Protected backend API routes.
- Role-based authorization.
- Admin-only publication verification.
- Admin-only publication deletion.
- Admin-only department management.
- CORS origin restrictions.
- Environment variables for sensitive credentials.
- .env files excluded from Git tracking.
- Password reset using secure reset tokens.
📊 Dashboard & Reporting
The Admin Dashboard provides an overview of institutional publication activity.
Dashboard Statistics
- Total Publications
- Pending Publications
- Verified Publications
Reports
Administrators can generate CSV reports containing publication information for institutional analysis and documentation.
These reports can support academic activities such as:
- NAAC documentation
- NIRF-related reporting
- NBA documentation
- Institutional research analysis
🔄 Application Workflow
                    ┌─────────────────┐
                    │      Home       │
                    └────────┬────────┘
                             │
                     ┌───────▼────────┐
                     │ Register/Login  │
                     └───────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Authentication  │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌────────▼───────┐
        │     Faculty    │       │      Admin     │
        └───────┬────────┘       └────────┬───────┘
                │                         │
        ┌───────▼────────┐       ┌────────▼────────┐
        │ Add Publication│       │ Manage Records  │
        └───────┬────────┘       └────────┬────────┘
                │                         │
        ┌───────▼────────┐       ┌────────▼────────┐
        │ PENDING Status │──────►│ Verify / Reject │
        └────────────────┘       └────────┬────────┘
                                          │
                                  ┌───────▼────────┐
                                  │ Reports / Stats│
                                  └────────────────┘

🌐 Deployment
The project can be deployed using:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Source Code: GitHub
For production deployment, update the environment variables and configure the backend CORS settings with the deployed frontend URL.
🧪 API Testing
The REST APIs can be tested using Postman.
Recommended testing sequence:
1. Register
       ↓
2. Login
       ↓
3. Copy JWT token
       ↓
4. Add Publication
       ↓
5. Get Publications
       ↓
6. Login as Admin
       ↓
7. View Publications
       ↓
8. Verify / Reject Publication
       ↓
9. Generate Reports

Protected API requests require:
Authorization: Bearer <JWT_TOKEN>

🎯 Project Objective
The main objective of the Research Publication Management Portal is to provide a centralized platform for academic institutions to:
- Maintain faculty publication records.
- Reduce manual publication management.
- Simplify publication submission.
- Enable administrator verification.
- Provide publication search functionality.
- Maintain department information.
- Generate institutional reports.
- Improve transparency and organization of academic research records.
👥 User Roles & Responsibilities
Role	Responsibilities
Faculty	Register, login, submit publications, manage own publications, search publications, track verification status
Admin	Manage publications, verify/reject publications, edit/delete records, manage departments, search publications, generate reports


📌 Future Enhancements
Possible future improvements include:
- Advanced publication analytics.
- Department-wise publication dashboards.
- More detailed reporting and visualization.
- DOI validation.
- Automated publication authenticity verification.
- ORCID integration.
- Institutional publication ranking.
- Cloud-based document storage.
- Notification system for publication status changes.
⭐ Conclusion
The Research Publication Management Portal provides a centralized MERN-based solution for managing academic research publications.
By combining faculty publication submission, administrator verification, publication search, department management, authentication, and reporting capabilities, the system helps institutions maintain organized and reliable research publication records.
