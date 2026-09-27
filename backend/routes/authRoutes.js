const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// =========================================================================
// 1. REGISTER (With Welcome Email Confirmation)
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

    // 📩 Send Welcome Confirmation Email to User's Inbox
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Research Portal" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: "Account Created Successfully - Research Portal",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 480px;">
            <h2 style="color: #6366f1;">Welcome to Research Portal!</h2>
            <p>Hello <b>${newUser.name}</b>,</p>
            <p>Your account has been created successfully as a <b>${newUser.role.toUpperCase()}</b> member.</p>
            <p>You can now sign in to record, verify, and view academic publications.</p>
            <p style="margin: 25px 0;">
              <a href="http://localhost:3000/login" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Sign In Now
              </a>
            </p>
            <p style="color: #64748b; font-size: 13px;">Registered Email: <b>${newUser.email}</b></p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">If you did not create this account, please contact portal administration immediately.</p>
          </div>
        `,
      });
      console.log("Account creation email sent to:", newUser.email);
    } catch (mailErr) {
      console.error("Account creation email failed:", mailErr);
    }

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
// 3. FORGOT PASSWORD
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

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portal Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - Research Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hello <b>${user.name}</b>,</p>
          <p>Click the button below to set a new password:</p>
          <p style="margin: 25px 0;">
            <a href="${resetLink}" style="background: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reset My Password
            </a>
          </p>
          <p style="color: #666; font-size: 13px;">This link will expire in 15 minutes.</p>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send reset email." });
  }
});

// =========================================================================
// 4. RESET PASSWORD
// =========================================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Invalid token or user not found" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

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
            <p>Your password was updated successfully.</p>
            <p style="margin: 20px 0;">
              <a href="http://localhost:3000/login" style="background: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Sign In to Portal
              </a>
            </p>
            <p style="color: #ef4444; font-size: 12px;">If you did not perform this action, contact portal admin immediately.</p>
          </div>
        `,
      });
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

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        role: "faculty",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send Welcome Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Research Portal" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Successfully Signed In via Google - Research Portal",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
            <h2 style="color: #6366f1;">Successfully Signed In!</h2>
            <p>Hello <b>${user.name}</b>,</p>
            <p>You have successfully signed in to the <b>Research Publication Portal</b> using your Google account.</p>
            <p>If this wasn't you, please reset your password immediately.</p>
            <p style="margin: 20px 0;">
              <a href="http://localhost:3000/faculty-dashboard" style="background: #6366f1; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Go to Dashboard
              </a>
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Google welcome mail error:", mailErr);
    }

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

// =========================================================================
// 6. SEND OTP (Email Verification for Registration)
// =========================================================================
const otpStore = {};

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered. Please login." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Research Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Email Verification Code - Research Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 480px;">
          <h2 style="color: #6366f1;">Email Verification Code</h2>
          <p>Use the following 6-digit code to verify your email:</p>
          <div style="font-size: 2.5rem; font-weight: 800; letter-spacing: 0.4rem; color: #6366f1; background: #eef2ff; padding: 16px 24px; border-radius: 12px; display: inline-block; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 13px;">This code expires in <b>10 minutes</b>.</p>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully to your email!" });
  } catch (error) {
    console.error("OTP send error:", error);
    res.status(500).json({ message: "Failed to send OTP. Check email configuration." });
  }
});

// =========================================================================
// 7. VERIFY OTP
// =========================================================================
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({ message: "No OTP found. Please request a new one." });
  }

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (stored.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
  }

  delete otpStore[email];
  res.status(200).json({ message: "Email verified successfully!" });
});

module.exports = router;