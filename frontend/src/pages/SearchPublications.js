import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function SearchPublications() {
  const { user } = useAuth();

  // Search filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [journalConference, setJournalConference] = useState("");
  const [doi, setDoi] = useState("");
  const [year, setYear] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [status, setStatus] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Consistent navbar links with Dashboard and Search
  const navLinks =
    user?.role === "admin"
      ? [
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/manage-publications", label: "Publications" },
          { to: "/manage-departments", label: "Departments" },
          { to: "/search-publications", label: "Search" },
        ]
      : [
          { to: "/faculty-dashboard", label: "Dashboard" },
          { to: "/add-publication", label: "Add Publication" },
          { to: "/my-publications", label: "My Publications" },
          { to: "/search-publications", label: "Search" },
        ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (journalConference) params.append("journalConference", journalConference);
      if (doi) params.append("doi", doi);
      if (year) params.append("year", year);
      if (publicationType) params.append("type", publicationType);
      if (status) params.append("status", status);

      const response = await api.get(`/publications?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not search publications.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setJournalConference("");
    setDoi("");
    setYear("");
    setPublicationType("");
    setStatus("");
    setResults([]);
    setHasSearched(false);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 40%, #fae8ff 100%)" }}>
      <Navbar links={navLinks} />

      <div className="page" style={{ maxWidth: "860px", padding: "2.5rem 1.25rem 4rem" }}>
        
        {/* Outlined Filter Box */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #cbd5e1",
            borderRadius: "24px",
            padding: "2.5rem 2.2rem",
            boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)",
            marginBottom: "2rem",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.25rem" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.35)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "var(--text, #0f172a)" }}>
                Search Publications
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted, #64748b)", margin: "0.2rem 0 0" }}>
                Filter across papers, conferences, faculty submissions, and DOI identifiers
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            
            {/* Field 1: Paper Title / Keywords */}
            <div>
              <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                Paper Title or Keywords
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field-input"
                placeholder="e.g. Machine Learning, Deep Neural Networks, IoT..."
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {/* Field 2 & 3: Journal/Conference + DOI */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Journal / Conference Name
                </label>
                <input
                  type="text"
                  value={journalConference}
                  onChange={(e) => setJournalConference(e.target.value)}
                  className="field-input"
                  placeholder="e.g. IEEE, Springer, ACM, Elsevier..."
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  DOI Identifier
                </label>
                <input
                  type="text"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="field-input"
                  placeholder="e.g. 10.1109/..."
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Field 4, 5, 6: Year, Type, Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "1rem" }}>
              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="field-input"
                  placeholder="e.g. 2026"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Publication Type
                </label>
                <select
                  value={publicationType}
                  onChange={(e) => setPublicationType(e.target.value)}
                  className="field-input"
                  style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="">All Types</option>
                  <option value="Journal">Journal</option>
                  <option value="Conference">Conference</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Patent">Patent</option>
                </select>
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="field-input"
                  style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Action Buttons (Right-aligned, Not full width!) */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.85rem", marginTop: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "0.7rem 1.4rem",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#64748b",
                  background: "transparent",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#0f172a";
                  e.currentTarget.style.borderColor = "#94a3b8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
              >
                Clear Filters
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: "auto",
                  padding: "0.75rem 1.8rem",
                  margin: 0,
                  height: "44px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>{loading ? "Searching..." : "Search Publications"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Empty State Before Search */}
        {!hasSearched && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "1.5px dashed #cbd5e1",
              padding: "3.5rem 2rem",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#6366f1" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1e293b", margin: "0 0 0.4rem" }}>
              Ready to Search
            </h3>
            <p style={{ fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto" }}>
              Enter your desired filters above and click <strong>Search Publications</strong> to display matching entries.
            </p>
          </div>
        )}

        {/* Zero Results State */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.35rem" }}>
              No publications matched your search
            </p>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Try removing some filter conditions or searching with different keywords.
            </p>
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 0.5rem" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                Found {results.length} publication{results.length > 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map((pub) => (
                <div
                  key={pub._id}
                  className={`entry entry-status-${pub.verificationStatus}`}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "1.4rem 1.6rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="entry-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <span className="entry-title" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                      {pub.paperTitle}
                    </span>
                    <span className="entry-status">
                      {pub.verificationStatus}
                    </span>
                  </div>

                  <p className="entry-meta" style={{ marginTop: "0.4rem", color: "#64748b", fontSize: "0.88rem" }}>
                    <strong style={{ color: "#334155" }}>{pub.publicationType}</strong> · {pub.journalConference} · <strong>{pub.publicationYear}</strong>
                  </p>

                  {pub.DOI && (
                    <p className="entry-meta" style={{ marginTop: "0.3rem", fontSize: "0.84rem" }}>
                      DOI:{" "}
                      <a
                        href={pub.DOI.startsWith("http") ? pub.DOI : `https://doi.org/${pub.DOI}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#6366f1", fontWeight: 600, textDecoration: "underline" }}
                      >
                        {pub.DOI}
                      </a>
                    </p>
                  )}

                  <p className="entry-meta" style={{ marginTop: "0.4rem", fontSize: "0.82rem", color: "#94a3b8" }}>
                    Submitted by: <strong style={{ color: "#475569" }}>{pub.facultyId?.name}</strong> ({pub.facultyId?.email})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}