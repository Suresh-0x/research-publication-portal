import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      login(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "faculty") {
        navigate("/faculty-dashboard");
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginContainer}>

        {/* LEFT BRAND SECTION */}
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
            Research Publication
            <br />
            Management Portal
          </h1>

          <p style={styles.brandDescription}>
            Manage, track and verify academic research
            publications in one centralized platform.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Manage research publications</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Track publication verification</span>
            </div>

            <div style={styles.feature}>
              <span style={styles.featureIcon}>✓</span>
              <span>Department-wise research reports</span>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div style={styles.formSection}>

          <div style={styles.formHeader}>
            <p style={styles.smallHeading}>WELCOME BACK</p>

            <h2 style={styles.title}>
              Sign in to your account
            </h2>

            <p style={styles.subtitle}>
              Enter your credentials to continue.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
                  placeholder="Enter your email"
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
              <div style={styles.passwordHeader}>
                <label
                  htmlFor="password"
                  style={styles.label}
                >
                  Password
                </label>

                {/* DIRECT RESET PASSWORD */}
                <Link
                  to="/reset-password"
                  style={styles.forgotLink}
                >
                  Forgot password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A10.7 10.7 0 0 1 12 5c7 0 10 7 10 7a16.7 16.7 0 0 1-3 3.8" />
                      <path d="M6.2 6.2C3.5 8.1 2 12 2 12s3 7 10 7a10.8 10.8 0 0 0 3.4-.6" />
                    </svg>
                  ) : (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME */}
            <label style={styles.remember}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={styles.checkbox}
              />

              <span>
                Remember me for 30 days
              </span>
            </label>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* REGISTER */}
          <div style={styles.registerText}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create an account
            </Link>
          </div>

          <div style={styles.bottomText}>
            Research Publication Management Portal
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

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

  loginContainer: {
    width: "100%",
    maxWidth: "1000px",
    minHeight: "610px",
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "42% 58%",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.10)",
  },

  brandSection: {
    background: "#1e3a8a",
    color: "#ffffff",
    padding: "55px 45px",
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
    marginBottom: "28px",
  },

  brandTitle: {
    fontSize: "30px",
    lineHeight: "1.25",
    fontWeight: 700,
    margin: "0 0 18px",
    letterSpacing: "-0.5px",
  },

  brandDescription: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#dbeafe",
    margin: "0 0 35px",
    maxWidth: "340px",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "17px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#eff6ff",
  },

  featureIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },

  formSection: {
    padding: "55px 65px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  formHeader: {
    marginBottom: "28px",
  },

  smallHeading: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.2px",
  },

  title: {
    margin: "0 0 8px",
    color: "#172033",
    fontSize: "27px",
    fontWeight: 700,
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 13px",
    marginBottom: "20px",
    borderRadius: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#dc2626",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "12px",
    flexShrink: 0,
  },

  inputGroup: {
    marginBottom: "20px",
  },

  passwordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  label: {
    display: "block",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 600,
  },

  forgotLink: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 600,
    textDecoration: "none",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "15px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    border: "1px solid #dbe2ea",
    borderRadius: "9px",
    outline: "none",
    padding: "0 15px 0 45px",
    fontSize: "14px",
    color: "#1e293b",
    background: "#ffffff",
  },

  eyeButton: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },

  remember: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#64748b",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "25px",
  },

  checkbox: {
    width: "15px",
    height: "15px",
    accentColor: "#2563eb",
    cursor: "pointer",
  },

  loginButton: {
    width: "100%",
    height: "49px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: 1,
  },

  registerText: {
    textAlign: "center",
    marginTop: "25px",
    color: "#64748b",
    fontSize: "13px",
  },

  registerLink: {
    color: "#2563eb",
    fontWeight: 600,
    textDecoration: "none",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "35px",
    paddingTop: "18px",
    borderTop: "1px solid #eef2f7",
    color: "#94a3b8",
    fontSize: "11px",
  },
};