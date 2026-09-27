import { useState } from "react";
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

  const navLinks = [
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
      setSuccess("Publication added. It is now pending admin verification.");
      setFormData({
        paperTitle: "",
        publicationType: "Journal",
        journalConference: "",
        publicationYear: new Date().getFullYear(),
        DOI: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not add publication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        /* Beautiful distinct soft-indigo & violet gradient background */
        background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 40%, #fae8ff 100%)",
      }}
    >
      <Navbar links={navLinks} />

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "2.5rem 1.25rem 4rem" }}>
        
        {/* Card with Zoom-in & Zoom-out effect */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: "#ffffff",
            border: isHovered ? "1.5px solid #a855f7" : "1.5px solid #cbd5e1",
            borderRadius: "24px",
            padding: "2.5rem 2.2rem",
            /* Zoom In on hover, Zoom Out on leave */
            transform: isHovered ? "scale(1.02) translateY(-4px)" : "scale(1) translateY(0)",
            boxShadow: isHovered
              ? "0 20px 40px -10px rgba(99, 102, 241, 0.22), 0 0 0 1px rgba(168, 85, 247, 0.2)"
              : "0 10px 30px -5px rgba(99, 102, 241, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            animation: "cardZoomIn 0.45s ease-out",
          }}
        >
          {/* Inline keyframes for initial load zoom */}
          <style>
            {`
              @keyframes cardZoomIn {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(12px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}
          </style>

          <div className="page-header" style={{ marginBottom: "1.5rem" }}>
            <h2>Add Publication</h2>
          </div>

          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <label className="field-label">Paper Title</label>
            <input
              type="text"
              name="paperTitle"
              value={formData.paperTitle}
              onChange={handleChange}
              required
              className="field-input"
              placeholder="e.g. AI in Education Systems"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <label className="field-label">Publication Type</label>
            <select
              name="publicationType"
              value={formData.publicationType}
              onChange={handleChange}
              className="field-input"
              style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
            >
              <option value="Journal">Journal</option>
              <option value="Conference">Conference</option>
              <option value="Book Chapter">Book Chapter</option>
              <option value="Patent">Patent</option>
            </select>

            <label className="field-label">Journal / Conference Name</label>
            <input
              type="text"
              name="journalConference"
              value={formData.journalConference}
              onChange={handleChange}
              required
              className="field-input"
              placeholder="e.g. International Journal of AI Research"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <label className="field-label">Publication Year</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              required
              min="1990"
              max="2100"
              className="field-input"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <label className="field-label">DOI (optional)</label>
            <input
              type="text"
              name="DOI"
              value={formData.DOI}
              onChange={handleChange}
              className="field-input"
              placeholder="e.g. 10.1234/ijair.2025.001"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "14px",
                fontWeight: 600,
                fontSize: "0.95rem",
                marginTop: "1.5rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {loading ? "Submitting..." : "Add Publication"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}