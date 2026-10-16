const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Department = require("../models/Department");

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

/* =========================================================
   REGISTER USER
========================================================= */

const registerUser = async (req, res) => {
  try {
    const {
      name,
      facultyId,
      adminId,
      email,
      password,
      role,
      department,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    if (!["faculty", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists with this email.",
      });
    }

    let departmentDocument = null;

    /* ================= FACULTY ================= */

    if (role === "faculty") {
      if (!facultyId) {
        return res.status(400).json({
          message: "Faculty ID is required.",
        });
      }

      if (!department) {
        return res.status(400).json({
          message: "Department is required.",
        });
      }

      const existingFaculty = await User.findOne({
        facultyId: facultyId.trim(),
      });

      if (existingFaculty) {
        return res.status(400).json({
          message: "Faculty ID already exists.",
        });
      }

      departmentDocument =
        await Department.findOne({
          departmentName: department.trim(),
        });

      if (!departmentDocument) {
        return res.status(400).json({
          message:
            `Department "${department}" not found.`,
        });
      }
    }

    /* ================= ADMIN ================= */

    if (role === "admin") {
      if (!adminId) {
        return res.status(400).json({
          message: "Admin ID is required.",
        });
      }

      const existingAdmin = await User.findOne({
        adminId: adminId.trim(),
      });

      if (existingAdmin) {
        return res.status(400).json({
          message: "Admin ID already exists.",
        });
      }
    }

    /* ================= PASSWORD ================= */

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    };

    if (role === "faculty") {
      userData.facultyId =
        facultyId.trim();

      userData.department =
        departmentDocument._id;
    }

    if (role === "admin") {
      userData.adminId =
        adminId.trim();
    }

    /* ================= CREATE USER ================= */

    const newUser =
      await User.create(userData);

    /* ================= UPDATE FACULTY COUNT ================= */

    if (
      role === "faculty" &&
      departmentDocument
    ) {
      departmentDocument.totalFaculty += 1;

      await departmentDocument.save();
    }

    return res.status(201).json({
      message:
        "Registration successful! You can now login.",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        facultyId:
          newUser.facultyId || null,
        adminId:
          newUser.adminId || null,
        department:
          newUser.department || null,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Email, Faculty ID, or Admin ID already exists.",
      });
    }

    return res.status(500).json({
      message:
        "Server error during registration.",
    });
  }
};

/* =========================================================
   LOGIN USER
========================================================= */

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).populate(
      "department",
      "departmentName"
    );

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        facultyId:
          user.facultyId || null,
        adminId:
          user.adminId || null,
        department:
          user.department || null,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login.",
    });
  }
};

/* =========================================================
   FORGOT PASSWORD
========================================================= */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Please provide an email address.",
      });
    }

    const normalizedEmail =
      normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message:
          "No account found with this email.",
      });
    }

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink =
      `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(
        resetToken
      )}`;

    await transporter.sendMail({
      from:
        `"Research Publication Portal" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject:
        "Password Reset - Research Publication Portal",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
          color: #1e293b;
        ">
          <h2 style="color: #1e3a8a;">
            Password Reset
          </h2>

          <p>
            Hello <b>${user.name}</b>,
          </p>

          <p>
            We received a request to reset your
            Research Publication Portal password.
          </p>

          <p style="margin: 25px 0;">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                background: #1e3a8a;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p style="
            font-size: 13px;
            color: #64748b;
          ">
            This link will expire in 15 minutes.
          </p>

          <p style="
            font-size: 13px;
            color: #64748b;
          ">
            If you did not request this password reset,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      message:
        "Password reset link sent to your email!",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send password reset email.",
    });
  }
};

/* =========================================================
   RESET PASSWORD
========================================================= */

const resetPassword = async (req, res) => {
  try {
    const {
      token,
      newPassword,
    } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message:
          "Token and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (
      decoded.purpose !==
      "password-reset"
    ) {
      return res.status(400).json({
        message:
          "Invalid password reset token.",
      });
    }

    const user =
      await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    return res.status(200).json({
      message:
        "Your password has been updated successfully!",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(400).json({
      message:
        "Reset link has expired or is invalid.",
    });
  }
};

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};