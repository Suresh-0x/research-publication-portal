const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Department = require("../models/Department");

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
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
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

      departmentDocument = await Department.findOne({
        departmentName: department.trim(),
      });

      if (!departmentDocument) {
        return res.status(400).json({
          message: `Department "${department}" not found.`,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    };

    if (role === "faculty") {
      userData.facultyId = facultyId.trim();
      userData.department = departmentDocument._id;
    }

    if (role === "admin") {
      userData.adminId = adminId.trim();
    }

    /* ================= CREATE USER ================= */

    const newUser = await User.create(userData);

    /* ================= UPDATE FACULTY COUNT ================= */

    if (role === "faculty" && departmentDocument) {
      departmentDocument.totalFaculty += 1;
      await departmentDocument.save();
    }

    return res.status(201).json({
      message: "Registration successful! You can now login.",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        facultyId: newUser.facultyId || null,
        adminId: newUser.adminId || null,
        department: newUser.department || null,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email, Faculty ID, or Admin ID already exists.",
      });
    }

    return res.status(500).json({
      message: "Server error during registration.",
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
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).populate(
      "department",
      "departmentName"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
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
        facultyId: user.facultyId || null,
        adminId: user.adminId || null,
        department: user.department || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
};

/* =========================================================
   FORGOT PASSWORD
   DIRECT RESET PAGE FLOW
========================================================= */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide your registered email.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    return res.status(200).json({
      message: "Email verified. You can reset your password.",
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Unable to verify email.",
    });
  }
};

/* =========================================================
   RESET PASSWORD
   EMAIL + NEW PASSWORD
========================================================= */

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "Email, new password and confirm password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    /* ================= FIND USER ================= */

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    /* ================= HASH NEW PASSWORD ================= */

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    /* ================= SUCCESS ================= */

    return res.status(200).json({
      message:
        "Password updated successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error while resetting password.",
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