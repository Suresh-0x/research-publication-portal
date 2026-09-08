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

// Middleware
app.use(cors());
app.use(express.json());

// Health check route - useful to confirm the server is alive
app.get("/", (req, res) => {
  res.send("Research Publication Management Portal API is running");
});

// Routes
app.use("/", authRoutes); // exposes /register and /login
app.use("/publications", publicationRoutes);
app.use("/departments", departmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
