import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AddPublication() {
  const [formData, setFormData] = useState({
    paperTitle: "",
    publicationType: "Journal",
    journalConference: "",
    publicationYear: new Date().getFullYear(),
    DOI: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Navbar includes Dashboard, My Publications, and Search as requested
  const navLinks = [
    { to: "/faculty-dashboard", label: "Dashboard" },
    { to: "/my-publications", label: "My Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/publications", formData);
      setSuccess("Publication submitted successfully! It is now pending admin verification.");
      setFormData({
        paperTitle: "",
        publicationType: "Journal",
        journalConference: "",
        publicationYear: new Date().getFullYear(),
        DOI: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not add publication. Please verify all fields.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeMeta = (type) => {
    switch (type) {
      case "Conference":
        return {
          venueLabel: "Conference Name & Proceedings",
          venuePlaceholder: "e.g. IEEE International Conference on Computer Vision (ICCV 2025)",
          venueIcon: "🎤",
          idLabel: "DOI / Proceedings Link",
          idPlaceholder: "e.g. 10.1109/ICCV.2025.00123",
          idTip: "Adding a DOI or conference link allows instant verification.",
        };
      case "Book Chapter":
        return {
          venueLabel: "Book Title & Publisher",
          venuePlaceholder: "e.g. Advances in Deep Learning, Springer Nature",
          venueIcon: "📖",
          idLabel: "ISBN / Chapter DOI",
          idPlaceholder: "e.g. 978-3-030-98765-4 or 10.1007/978-3-...",
          idTip: "ISBN or Chapter DOI verifies publication with the publisher.",
        };
      case "Patent":
        return {
          venueLabel: "Issuing Patent Authority / Office",
          venuePlaceholder: "e.g. Indian Patent Office (IPO) / USPTO",
          venueIcon: "💡",
          idLabel: "Patent / Application Number",
          idPlaceholder: "e.g. IN 202541098765 A or US 11,234,567 B2",
          idTip: "Patent or application number verifies the official filing record.",
        };
      case "Journal":
      default:
        return {
          venueLabel: "Journal / Publisher Name",
          venuePlaceholder: "e.g. IEEE Transactions on Pattern Analysis and Machine Intelligence",
          venueIcon: "🏛️",
          idLabel: "Digital Object Identifier (DOI)",
          idPlaceholder: "e.g. 10.1038/nature14539",
          idTip: "Adding a valid DOI creates an instant publisher verification link (e.g. doi.org).",
        };
    }
  };

  const typeMeta = getTypeMeta(formData.publicationType);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)",
      }}
    >
      <Navbar links={navLinks} />

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.25rem 4.5rem" }}>
        
        {/* Header Badge & Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
              marginBottom: "0.85rem",
            }}
          >
            <span>📝</span>
            <span>Faculty Research Submission</span>
          </div>

          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.03em",
            }}
          >
            Add New Publication
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0, maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Submit your research work for institutional verification. Once reviewed, it will appear in the verified academic directory.
          </p>
        </div>

        {/* Main Form Card with soft-blue border and glassmorphic look */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(14px)",
            border: isHovered ? "2px solid #6366f1" : "2px solid #818cf8",
            borderRadius: "26px",
            padding: "2.5rem 2.5rem",
            transform: isHovered ? "translateY(-3px)" : "translateY(0)",
            boxShadow: isHovered
              ? "0 22px 48px -12px rgba(99, 102, 241, 0.22), 0 0 0 1px rgba(99, 102, 241, 0.15)"
              : "0 14px 34px -10px rgba(99, 102, 241, 0.12), 0 2px 6px rgba(0, 0, 0, 0.03)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Notification Messages */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.9rem 1.1rem",
                borderRadius: "14px",
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                color: "#991b1b",
                fontSize: "0.9rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                border: "1.5px solid #86efac",
                color: "#166534",
                fontSize: "0.92rem",
                marginBottom: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 700 }}>
                <span style={{ fontSize: "1.2rem" }}>🎉</span>
                <span>{success}</span>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <Link
                  to="/my-publications"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "10px",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  View My Publications ➔
                </Link>
                <Link
                  to="/faculty-dashboard"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1px solid #bbf7d0",
                    color: "#15803d",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
            
            {/* Paper Title */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "0.45rem",
                }}
              >
                <span>📄</span>
                <span>Paper Title <span style={{ color: "#ef4444" }}>*</span></span>
              </label>
              <input
                type="text"
                name="paperTitle"
                value={formData.paperTitle}
                onChange={handleChange}
                required
                placeholder="e.g. Deep Residual Learning for Image Recognition"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  outline: "none",
                  background: "#f8fafc",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Publication Type and Year (2 Column Grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span>🏷️</span>
                  <span>Publication Type <span style={{ color: "#ef4444" }}>*</span></span>
                </label>
                <select
                  name="publicationType"
                  value={formData.publicationType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    outline: "none",
                    background: "#f8fafc",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "#ffffff";
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "#f8fafc";
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="Journal">Journal</option>
                  <option value="Conference">Conference</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Patent">Patent</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span>📅</span>
                  <span>Publication Year <span style={{ color: "#ef4444" }}>*</span></span>
                </label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  required
                  min="1950"
                  max="2100"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    outline: "none",
                    background: "#f8fafc",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.background = "#ffffff";
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.background = "#f8fafc";
                    e.target.style.borderColor = "#cbd5e1";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

            </div>

            {/* Dynamic Venue: Journal / Conference / Book / Patent Office */}
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "0.45rem",
                }}
              >
                <span>{typeMeta.venueIcon}</span>
                <span>{typeMeta.venueLabel} <span style={{ color: "#ef4444" }}>*</span></span>
              </label>
              <input
                type="text"
                name="journalConference"
                value={formData.journalConference}
                onChange={handleChange}
                required
                placeholder={typeMeta.venuePlaceholder}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  outline: "none",
                  background: "#f8fafc",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Dynamic Identifier: DOI / ISBN / Patent Number */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  <span>🔗</span>
                  <span>{typeMeta.idLabel}</span>
                </label>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Optional</span>
              </div>
              <input
                type="text"
                name="DOI"
                value={formData.DOI}
                onChange={handleChange}
                placeholder={typeMeta.idPlaceholder}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  outline: "none",
                  background: "#f8fafc",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span>💡</span>
                <span>{typeMeta.idTip}</span>
              </p>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "1rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  borderRadius: "14px",
                  border: "none",
                  background: loading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading
                    ? "none"
                    : "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(79, 70, 229, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(79, 70, 229, 0.4)";
                  }
                }}
              >
                <span>{loading ? "⏳ Submitting..." : "🚀 Submit Publication"}</span>
              </button>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}