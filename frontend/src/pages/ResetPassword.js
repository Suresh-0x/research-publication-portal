import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function EyeIcon({ off = false }) {
  return off ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 4.24A9.75 9.75 0 0 1 12 4c5 0 8.5 5 8.5 5a15.5 15.5 0 0 1-3.16 3.94" />
      <path d="M6.71 6.71C4.68 8.07 3.5 10 3.5 10S7 16 12 16a9.7 9.7 0 0 0 3.29-.58" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    // Validation
    if (!cleanEmail || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Correct API request
      const response = await api.post("/reset-password", {
        email: cleanEmail,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      setSuccess(
        response.data?.message ||
          "Your password has been updated successfully!"
      );

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      // Go back to login
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>RP</div>

        {/* Heading */}
        <h1 style={styles.title}>Reset Your Password</h1>

        <p style={styles.subtitle}>
          Enter your registered email and create a new
          <br />
          password for your account.
        </p>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={styles.successBox}>
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword}>

          {/* Email */}
          <label style={styles.label}>Registered Email</label>

          <div style={styles.inputWrapper}>
            <span style={styles.leftIcon}>
              <MailIcon />
            </span>

            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* New Password */}
          <label style={styles.label}>New Password</label>

          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.passwordInput}
              autoComplete="new-password"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <EyeIcon off={!showPassword} />
            </button>
          </div>

          <p style={styles.hint}>Use at least 6 characters.</p>

          {/* Confirm Password */}
          <label style={styles.label}>Confirm Password</label>

          <div style={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.passwordInput}
              autoComplete="new-password"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={styles.eyeButton}
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <EyeIcon off={!showConfirmPassword} />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating Password..." : "Update Password →"}
          </button>
        </form>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={styles.backButton}
        >
          ← Back to Login
        </button>

        <div style={styles.divider}></div>

        <p style={styles.footer}>
          Research Publication Management Portal
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "38px 40px 28px",
    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5e7eb",
  },

  logo: {
    width: "48px",
    height: "48px",
    margin: "0 auto 24px",
    borderRadius: "12px",
    background: "#24439b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "17px",
  },

  title: {
    textAlign: "center",
    margin: "0",
    color: "#0f172a",
    fontSize: "27px",
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "12px 0 28px",
  },

  label: {
    display: "block",
    color: "#172033",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    outline: "none",
    padding: "0 14px 0 42px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#ffffff",
  },

  passwordInput: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    outline: "none",
    padding: "0 48px 0 14px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#ffffff",
  },

  leftIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    display: "flex",
    zIndex: 1,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
  },

  hint: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#dc2626",
    borderRadius: "9px",
    padding: "11px 13px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "18px",
  },

  successBox: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#047857",
    borderRadius: "9px",
    padding: "11px 13px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "18px",
  },

  submitButton: {
    width: "100%",
    height: "48px",
    marginTop: "25px",
    border: "none",
    borderRadius: "9px",
    background: "#24439b",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(36, 67, 155, 0.18)",
  },

  backButton: {
    display: "block",
    margin: "22px auto 0",
    border: "none",
    background: "transparent",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "26px 0 18px",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    margin: 0,
  },
};