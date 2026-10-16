import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/reset-password", {
        token,
        newPassword,
      });

      setSuccessMessage(
        res.data.message ||
          "Your password has been updated successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset link is expired or invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          RP
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {successMessage
              ? "Password Updated"
              : "Reset Your Password"}
          </h1>

          <p style={styles.subtitle}>
            {successMessage
              ? "Your password has been successfully changed."
              : "Create a new password for your account."}
          </p>
        </div>

        {/* Success State */}
        {successMessage ? (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div style={styles.successMessage}>
              {successMessage}
            </div>

            <p style={styles.redirectText}>
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
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

            {/* New Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                New Password
              </label>

              <div style={styles.inputWrapper}>
                <input
                  type={
                    showNewPassword ? "text" : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  style={styles.eyeButton}
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </button>
              </div>

              <span style={styles.hint}>
                Use at least 6 characters.
              </span>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Confirm Password
              </label>

              <div style={styles.inputWrapper}>
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Re-enter your password"
                  minLength={6}
                  required
                  style={styles.input}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  style={styles.eyeButton}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff />
                  ) : (
                    <Eye />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
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
                ? "Updating Password..."
                : "Update Password"}

              {!loading && (
                <span style={styles.arrow}>
                  →
                </span>
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        {!successMessage && (
          <div style={styles.backContainer}>
            <Link
              to="/login"
              style={styles.backLink}
            >
              ← Back to Login
            </Link>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          Research Publication Management Portal
        </div>
      </div>
    </div>
  );
}

/* =========================
   Eye Icon
========================= */

function Eye() {
  return (
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* =========================
   Eye Off Icon
========================= */

function EyeOff() {
  return (
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
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

/* =========================
   Styles
========================= */

const styles = {
  page: {
    minHeight: "100vh",
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

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#1e3a8a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 22px",
    fontSize: "15px",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },

  header: {
    textAlign: "center",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "25px",
    fontWeight: 750,
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: "9px auto 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
    maxWidth: "320px",
  },

  fieldGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334155",
    fontSize: "13px",
    fontWeight: 650,
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  input: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    padding: "0 45px 0 13px",
    fontSize: "13px",
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
  },

  eyeButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  hint: {
    display: "block",
    marginTop: "6px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "8px",
    padding: "11px 12px",
    marginBottom: "20px",
    fontSize: "12px",
    lineHeight: 1.4,
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
  },

  successContainer: {
    textAlign: "center",
    padding: "5px 0 10px",
  },

  successIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#15803d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },

  successMessage: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    borderRadius: "9px",
    padding: "12px",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  redirectText: {
    margin: "15px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  backContainer: {
    textAlign: "center",
    marginTop: "22px",
  },

  backLink: {
    color: "#1e40af",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 650,
  },

  footer: {
    borderTop: "1px solid #f1f5f9",
    marginTop: "25px",
    paddingTop: "18px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "10px",
  },
};