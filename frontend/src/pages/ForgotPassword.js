import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/forgot-password", {
        email: email.trim(),
      });

      const resetLink = res.data.resetLink;

      if (!resetLink) {
        setError("Unable to generate reset link.");
        return;
      }

      // Get token from backend-generated reset link
      const url = new URL(resetLink);
      const token = url.searchParams.get("token");

      if (!token) {
        setError("Invalid reset token.");
        return;
      }

      // Directly open Reset Password page
      navigate(
        `/reset-password?token=${encodeURIComponent(token)}`
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to process request. Please check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Brand Icon */}
        <div style={styles.iconWrapper}>
          <div style={styles.iconBox}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-1.5 1.5L12 11a5.5 5.5 0 1 0-4 4l5.5-5.5m2.5-2.5l2-2" />
              <path d="M15.5 7.5L14 9l2 2 1.5-1.5" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            Forgot Password?
          </h2>

          <p style={styles.subtitle}>
            Enter your registered email to continue
            to reset your password.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorAlert}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>

            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label
              htmlFor="email"
              style={styles.label}
            >
              Email Address
            </label>

            <div style={styles.inputWrapper}>
              <svg
                style={styles.emailIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  width="20"
                  height="16"
                  x="2"
                  y="4"
                  rx="2"
                />

                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                disabled={loading}
                style={styles.input}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Opening Reset Password..."
              : "Continue"}

            {!loading && (
              <span style={styles.arrow}>
                →
              </span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div style={styles.backContainer}>
          <span style={styles.rememberText}>
            Remember your password?
          </span>{" "}

          <Link
            to="/login"
            style={styles.loginLink}
          >
            Back to Login
          </Link>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          Research Publication Management Portal
        </div>

      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "36px 38px 28px",
    boxSizing: "border-box",
    boxShadow:
      "0 15px 40px rgba(15, 23, 42, 0.07)",
  },

  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "13px",
    background: "#eff6ff",
    color: "#1e40af",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #dbeafe",
  },

  header: {
    textAlign: "center",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 750,
    color: "#0f172a",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: "9px auto 0",
    maxWidth: "330px",
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#64748b",
  },

  fieldGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 650,
    color: "#334155",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  emailIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    padding: "0 13px 0 43px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
  },

  submitButton: {
    width: "100%",
    height: "47px",
    border: "none",
    borderRadius: "9px",
    background: "#1e3a8a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 7px 18px rgba(30, 58, 138, 0.18)",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: 1,
  },

  errorAlert: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "9px",
    padding: "11px 12px",
    marginBottom: "18px",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  backContainer: {
    textAlign: "center",
    marginTop: "22px",
  },

  rememberText: {
    color: "#64748b",
    fontSize: "12px",
  },

  loginLink: {
    color: "#1e40af",
    fontSize: "12px",
    fontWeight: 700,
    textDecoration: "none",
  },

  footer: {
    borderTop: "1px solid #f1f5f9",
    marginTop: "25px",
    paddingTop: "17px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
  },
};