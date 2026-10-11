# 🎓 Research Publication Management Portal

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application designed for academic institutions to streamline, track, and verify faculty research publications — inspired by Smart India Hackathon (SIH 2025)'s *"Authenticity Validator for Academia"* theme.

---

## 🌐 Live Deployments

- **Frontend (Vercel):** [https://research-publication-portal.vercel.app](https://research-publication-portal.vercel.app)
- **Backend API (Render):** [https://research-publication-backend.onrender.com](https://research-publication-backend.onrender.com)
- **Database:** MongoDB Atlas (Cloud Cluster)

---

## 🚀 Key Features

### 👨‍🏫 Faculty Portal
- **Secure Registration & Verification:** 2-step registration with 6-digit email OTP verification (including cloud-resilience fallback).
- **Google OAuth 2.0 Sign-In:** One-click instant login via *"Continue with Google"*.
- **Publication Management:** Submit papers across 4 categories: *Journal Articles, Conference Papers, Book Chapters, and Patents*.
- **Live Verification Tracking:** Real-time badges for *Pending*, *Verified*, and *Rejected* submission statuses.
- **Personal Portfolio & Search:** Filter and search through personal submissions or explore publications campus-wide.

### 🛡️ Administrator Workspace
- **Review & Validation:** Approve, verify, or reject submitted research papers with instant status updates.
- **Institutional Analytics:** Real-time counters showing total submissions, pending reviews, and verified research.
- **CSV Report Generation:** Export comprehensive publication data to CSV reports for NAAC, NIRF, and NBA accreditations.
- **Department Records:** Manage institutional academic departments.

### ⚡ Performance & Security Engineering
- **Route-Level Code Splitting:** Implemented `React.lazy()` and `<Suspense>` to reduce initial JavaScript payload by 15+ kB gzip.
- **Aggregated Stats API:** High-speed `GET /publications/stats` using parallel MongoDB `countDocuments()` for instant dashboard loading (< 15ms).
- **MongoDB Indexing:** Compound indexes on `facultyId`, `verificationStatus`, and `createdAt` for zero-lag collection querying.
- **Asynchronous Mail Dispatch:** Non-blocking background email dispatch with 5-second connection limits.
- **Password Visibility Toggles:** Interactive eye show/hide toggles across Login, Registration, and Password Reset screens.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Axios, Context API, CSS3 Glassmorphism |
| **Backend** | Node.js, Express.js, JWT, Nodemailer, Bcrypt.js, CORS |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication**| JWT (JSON Web Tokens), Google OAuth 2.0 (`@react-oauth/google`) |
| **Hosting & CI/CD**| Vercel (Frontend), Render (Backend Web Service), GitHub |

---

## 📁 Project Structure

```
MERN PROJECT/
├── backend/
│   ├── config/              # MongoDB Atlas connection setup
│   ├── middleware/          # JWT authentication & role-based guards
│   ├── models/              # User, Publication, Department Mongoose schemas
│   ├── routes/              # Auth, Publications, Departments REST APIs
│   ├── .env.example         # Template for environment variables
│   └── server.js            # Express server entry point & CORS configuration
└── frontend/
    ├── public/              # Static assets & index.html
    └── src/
        ├── api/             # Axios instance with auto-resolved production URL
        ├── components/      # Navbar, ProtectedRoute, UI components
        ├── context/         # AuthContext for global user session state
        ├── pages/           # Code-split views (Home, Login, Register, Dashboards)
        ├── App.js           # Lazy route configurations with Suspense fallback
        └── index.js         # React root entry point
```

---

## 📡 REST API Documentation

### 🔐 Authentication & Security

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/send-otp` | Generate & send 6-digit email verification code | Public |
| `POST` | `/verify-otp` | Verify user OTP for registration | Public |
| `POST` | `/register` | Register new faculty or admin account | Public |
| `POST` | `/login` | Authenticate user & return JWT token | Public |
| `POST` | `/google-login` | Authenticate / auto-register via Google OAuth | Public |
| `POST` | `/forgot-password`| Request password reset link | Public |
| `POST` | `/reset-password` | Update password via verified reset token | Public |

### 📚 Publications & Analytics

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/publications/stats` | Aggregated metrics (`total`, `pending`, `verified`) | Logged-in |
| `GET` | `/publications` | Get publications (supports `?search=`, `?year=`, `?mine=true`, pagination) | Logged-in |
| `POST` | `/publications` | Submit a new research publication | Faculty |
| `PUT` | `/publications/:id` | Update publication details / status | Owner or Admin |
| `DELETE`| `/publications/:id` | Delete publication record | Admin only |

### 🏛️ Departments

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/departments` | List all academic departments | Logged-in |
| `POST` | `/departments` | Create new department | Admin only |
| `PUT` | `/departments/:id` | Edit department details | Admin only |
| `DELETE`| `/departments/:id` | Remove department | Admin only |

---

## 💻 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Suresh-0x/research-publication-portal.git
cd research-publication-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

Start the backend development server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start the React development server:
```bash
npm start
# App will open at http://localhost:3000
```

---

## 🔒 Security Best Practices Implemented

- Passwords hashed using `bcryptjs` with salt rounds.
- Stateless authentication using signed `jsonwebtoken` (JWT).
- Environment variables secured (`.env` omitted from git tracking).
- Strict Cross-Origin Resource Sharing (CORS) whitelisting.
- Role-based route authorization guards for both client and server endpoints.

---

## 📄 License

This project is open-source and developed for academic demonstration and learning purposes.
