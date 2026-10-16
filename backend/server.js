const dns = require("dns");

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // If your old frontend uses port 3000
  "http://localhost:3000",
  "http://127.0.0.1:3000",

  // Existing deployed frontend
  "https://research-publication-portal.vercel.app",
];

if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json());

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Research Publication Management Portal API is running",
    status: "success",
  });
});

/* =========================================================
   ROUTES
========================================================= */

// Authentication
app.use("/", authRoutes);

// Publications
app.use("/publications", publicationRoutes);

// Departments
app.use("/departments", departmentRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS policy blocked this request.",
    });
  }

  res.status(500).json({
    message: "Internal server error.",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});