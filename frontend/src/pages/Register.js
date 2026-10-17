import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    adminId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "faculty",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setFormData((prev) => ({
      ...prev,
      role,
      facultyId: "",
      adminId: "",
      department: "",
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Password validation
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Faculty validation
    if (
      formData.role === "faculty" &&
      !formData.facultyId.trim()
    ) {
      setError("Please enter your Faculty ID.");
      return;
    }

    // Department validation
    if (
      formData.role === "faculty" &&
      !formData.department
    ) {
      setError("Please select your department.");
      return;
    }

    // Admin validation
    if (
      formData.role === "admin" &&
      !formData.adminId.trim()
    ) {
      setError("Please enter your Admin ID.");
      return;
    }

    setLoading(true);

    try {
      const data = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "faculty") {
        data.facultyId = formData.facultyId.trim();
        data.department = formData.department;
      }

      if (formData.role === "admin") {
        data.adminId = formData.adminId.trim();
      }

     const response = await api.post(
  "/register",
  data
);

      setMessage(
        response.data.message ||
          "Registration successful!"
      );

      setFormData({
        name: "",
        facultyId: "",
        adminId: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "faculty",
        department: "",
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.registerContainer}>

        {/* =========================
            LEFT BRAND SECTION
        ========================== */}

        <div style={styles.brandSection}>
          <div style={styles.brandIcon}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              <path d="M8 6h8" />
              <path d="M8 10h8" />
            </svg>
          </div>

          <h1 style={styles.brandTitle}>
            Join the Research
            <br />
            Publication Portal
          </h1>

          <p style={styles.brandDescription}>
            Create your account to manage and track
            academic research publications efficiently.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Faculty publication management</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Publication verification tracking</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Department-wise research analytics</span>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT FORM SECTION
        ========================== */}

        <div style={styles.formSection}>

          <div style={styles.formHeader}>
            <p style={styles.smallHeading}>
              CREATE ACCOUNT
            </p>

            <h2 style={styles.title}>
              Register your account
            </h2>

            <p style={styles.subtitle}>
              Enter your details to get started.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div style={styles.successBox}>
              <span style={styles.successIcon}>✓</span>
              <span>{message}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div style={styles.inputGroup}>
              <label
                htmlFor="name"
                style={styles.label}
              >
                Full Name
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* ROLE */}
            <div style={styles.inputGroup}>
              <label
                htmlFor="role"
                style={styles.label}
              >
                Register As
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
                style={styles.select}
              >
                <option value="faculty">
                  Faculty
                </option>

                <option value="admin">
                  Administrator
                </option>
              </select>
            </div>

            {/* FACULTY FIELDS */}
            {formData.role === "faculty" && (
              <>
                {/* FACULTY ID */}
                <div style={styles.inputGroup}>
                  <label
                    htmlFor="facultyId"
                    style={styles.label}
                  >
                    Faculty ID
                  </label>

                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="16"
                          rx="2"
                        />
                        <path d="M7 8h10" />
                        <path d="M7 12h6" />
                        <path d="M7 16h4" />
                      </svg>
                    </span>

                    <input
                      id="facultyId"
                      name="facultyId"
                      type="text"
                      placeholder="Example: F101"
                      value={formData.facultyId}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* DEPARTMENT */}
                <div style={styles.inputGroup}>
                  <label
                    htmlFor="department"
                    style={styles.label}
                  >
                    Department
                  </label>

                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    style={styles.select}
                  >
                    <option value="">
                      Select your department
                    </option>

                    <option value="CSE">
                      Computer Science & Engineering
                    </option>

                    <option value="ECE">
                      Electronics & Communication Engineering
                    </option>

                    <option value="EEE">
                      Electrical & Electronics Engineering
                    </option>

                    <option value="MECH">
                      Mechanical Engineering
                    </option>

                    <option value="CIVIL">
                      Civil Engineering
                    </option>

                    <option value="IT">
                      Information Technology
                    </option>
                  </select>
                </div>
              </>
            )}

            {/* ADMIN ID */}
            {formData.role === "admin" && (
              <div style={styles.inputGroup}>
                <label
                  htmlFor="adminId"
                  style={styles.label}
                >
                  Admin ID
                </label>

                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>

                  <input
                    id="adminId"
                    name="adminId"
                    type="text"
                    placeholder="Example: A101"
                    value={formData.adminId}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div style={styles.inputGroup}>
              <label
                htmlFor="email"
                style={styles.label}
              >
                Email Address
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div style={styles.inputGroup}>
              <label
                htmlFor="password"
                style={styles.label}
              >
                Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  style={{
                    ...styles.input,
                    paddingRight: "48px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p style={styles.hint}>
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={styles.inputGroup}>
              <label
                htmlFor="confirmPassword"
                style={styles.label}
              >
                Confirm Password
              </label>

              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  style={{
                    ...styles.input,
                    paddingRight: "48px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  style={styles.eyeButton}
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.registerButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <span style={styles.arrow}>
                  →
                </span>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div style={styles.loginText}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={styles.loginLink}
            >
              Sign in
            </Link>
          </div>

          <div style={styles.bottomText}>
            Research Publication Management Portal
          </div>
        </div>
      </div>
    </div>
  );
};


/* =================================
   STYLES
================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  registerContainer: {
    width: "100%",
    maxWidth: "1050px",
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "38% 62%",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.10)",
  },

  brandSection: {
    background: "#1e3a8a",
    color: "#ffffff",
    padding: "50px 42px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  brandIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.13)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "27px",
  },

  brandTitle: {
    fontSize: "29px",
    lineHeight: "1.25",
    fontWeight: 700,
    margin: "0 0 17px",
    letterSpacing: "-0.5px",
  },

  brandDescription: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#dbeafe",
    margin: "0 0 32px",
    maxWidth: "330px",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    fontSize: "13px",
    color: "#eff6ff",
  },

  featureIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },

  formSection: {
    padding: "45px 55px",
  },

  formHeader: {
    marginBottom: "22px",
  },

  smallHeading: {
    margin: "0 0 7px",
    color: "#2563eb",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1.2px",
  },

  title: {
    margin: "0 0 7px",
    color: "#172033",
    fontSize: "26px",
    fontWeight: 700,
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  inputGroup: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 600,
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "43px",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    outline: "none",
    padding: "0 14px 0 43px",
    fontSize: "13px",
    color: "#1e293b",
    background: "#ffffff",
  },

  select: {
    width: "100%",
    height: "43px",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "8px",
    outline: "none",
    padding: "0 13px",
    fontSize: "13px",
    color: "#1e293b",
    background: "#ffffff",
    cursor: "pointer",
  },

  eyeButton: {
    position: "absolute",
    right: "11px",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    padding: "5px",
  },

  hint: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "10px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    marginBottom: "17px",
    borderRadius: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "12px",
  },

  errorIcon: {
    width: "19px",
    height: "19px",
    borderRadius: "50%",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "11px",
    flexShrink: 0,
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    marginBottom: "17px",
    borderRadius: "8px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "12px",
  },

  successIcon: {
    width: "19px",
    height: "19px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "11px",
    flexShrink: 0,
  },

  registerButton: {
    width: "100%",
    height: "46px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    marginTop: "5px",
  },

  arrow: {
    fontSize: "17px",
  },

  loginText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#64748b",
    fontSize: "12px",
  },

  loginLink: {
    color: "#2563eb",
    fontWeight: 600,
    textDecoration: "none",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "25px",
    paddingTop: "15px",
    borderTop: "1px solid #eef2f7",
    color: "#94a3b8",
    fontSize: "10px",
  },
};

export default Register;