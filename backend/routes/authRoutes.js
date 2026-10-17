const express = require("express");

const {
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

/*
=========================================================
AUTH ROUTES
=========================================================
*/

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;