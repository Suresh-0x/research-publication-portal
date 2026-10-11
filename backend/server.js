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

// Connect to MongoDB Atlas
connectDB();

// Allowed origins for CORS (Vercel Production + Localhost Development)
const allowedOrigins = [
  "https://research-publication-portal.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Research Publication Management Portal API is running");
});

// Routes
app.use("/", authRoutes);
app.use("/publications", publicationRoutes);
app.use("/departments", departmentRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});