import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Email+OTP, 2 = Full Register form

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 Added password show/hide state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!formData.email) return setError("Please enter your email first.");
    setLoading(true);
    setError("");
    try {
      await api.post("/send-otp", { email: formData.email });
      setOtpSent(true);
      setSuccess("OTP sent! Check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return setError("Please enter the OTP.");
    setLoading(true);
    setError("");
    try {
      await api.post("/verify-otp", { email: formData.email, otp });
      setOtpVerified(true);
      setStep(2);
      setSuccess("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/register", formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: "440px", padding: "2.5rem 2.2rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            color: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 1rem",
            boxShadow: "0 8px 20px -4px rgba(99,102,241,0.4)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.65rem", fontWeight: 700, margin: 0 }}>
            {step === 1 ? "Verify Your Email" : "Create Account"}
          </h2>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            {step === 1
              ? "We'll send a 6-digit code to confirm your email."
              : "Fill in your details to complete registration."}
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              width: s === step ? "2.5rem" : "0.75rem",
              height: "0.35rem",
              borderRadius: "999px",
              background: s <= step ? "var(--primary)" : "#e2e8f0",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* ==================== STEP 1: Email OTP ==================== */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email Input */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Email Address
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <svg style={{ position: "absolute", left: "1rem", color: "#94a3b8", pointerEvents: "none" }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="you@college.edu"
                  disabled={otpSent}
                  style={{ paddingLeft: "2.75rem", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            {/* Send OTP Button */}
            {!otpSent ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSendOtp}
                disabled={loading}
                style={{ width: "100%", height: "46px", borderRadius: "12px", fontWeight: 600, margin: 0 }}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            ) : (
              <>
                {/* OTP Input */}
                <div>
                  <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); if (error) setError(""); }}
                    className="field-input"
                    placeholder="_ _ _ _ _ _"
                    maxLength={6}
                    style={{
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      letterSpacing: "0.5rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  style={{ width: "100%", height: "46px", borderRadius: "12px", fontWeight: 600, margin: 0 }}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                {/* Resend OTP */}
                <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Didn't receive?{" "}
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); setSuccess(""); }}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem" }}
                  >
                    Resend OTP
                  </button>
                </p>
              </>
            )}
          </div>
        )}

        {/* ==================== STEP 2: Registration Form ==================== */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Name */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>Full Name</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} required className="field-input"
                placeholder="Dr. Suresh Kumar" style={{ boxSizing: "border-box" }} />
            </div>

            {/* Email (Read-only - verified) */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Email Address{" "}
                <span style={{ color: "#10b981", fontSize: "0.78rem", fontWeight: 600 }}>✓ Verified</span>
              </label>
              <input type="email" value={formData.email} readOnly className="field-input"
                style={{ background: "#f0fdf4", border: "1.5px solid #a7f3d0", boxSizing: "border-box", color: "#065f46" }} />
            </div>

            {/* Password with Show/Hide Toggle */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Password
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="field-input"
                  placeholder="At least 6 characters"
                  style={{ width: "100%", paddingRight: "2.8rem", boxSizing: "border-box" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? (
                    // Eye Off Icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    // Eye Open Icon
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.45rem", fontWeight: 600, fontSize: "0.85rem" }}>Register As</label>
              <select name="role" value={formData.role} onChange={handleChange}
                className="field-input" style={{ boxSizing: "border-box" }}>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: "100%", height: "46px", borderRadius: "12px", fontWeight: 600, margin: 0 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="footer-text" style={{ marginTop: "1.5rem", marginBottom: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}