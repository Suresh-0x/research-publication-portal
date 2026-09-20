const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// =========================================================================
// 1. REGISTER
// =========================================================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "faculty",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =========================================================================
// 2. LOGIN
// =========================================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// =========================================================================
// 3. FORGOT PASSWORD (Sends Real Email)
// =========================================================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate a 15-minute reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Gmail Transporter Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email from .env
        pass: process.env.EMAIL_PASS, // your app password from .env
      },
    });

    const mailOptions = {
      from: `"Portal Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - Research Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello <b>${user.name}</b>,</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <p style="margin: 25px 0;">
            <a href="${resetLink}" style="background: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset My Password
            </a>
          </p>
          <p style="color: #666; font-size: 13px;">This link will expire in 15 minutes.</p>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send reset email. Please check email configuration." });
  }
});

// =========================================================================
// 4. RESET PASSWORD (Updates password with token)
// =========================================================================
// =========================================================================
// 4. RESET PASSWORD (Updates password & sends email notification)
// =========================================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Invalid token or user not found" });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 📩 Send Success Notification Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portal Security" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Security Alert: Your password has been updated",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">Password Updated Successfully</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>Your password for your <b>Research Portal</b> account was updated successfully.</p>
            <p>You can now sign in using your new password:</p>
            <p style="margin: 20px 0;">
              <a href="http://localhost:3000/login" style="background: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Sign In to Portal
              </a>
            </p>
            <p style="color: #ef4444; font-size: 12px;">If you did not perform this action, please contact portal admin immediately.</p>
          </div>
        `,
      });
      console.log("Confirmation email sent to:", user.email);
    } catch (mailError) {
      console.error("Confirmation mail error:", mailError);
    }

    res.status(200).json({ message: "Your password has been updated successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Reset link has expired or is invalid." });
  }
});
// =========================================================================
// 5. GOOGLE LOGIN
// =========================================================================
router.post("/google-login", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required for Google login" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // If user is signing in for the first time, automatically create an account
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role: "faculty", // Default role for Google users
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
});

module.exports = router;