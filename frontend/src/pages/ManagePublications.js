import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function ManagePublications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "all";

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(currentTab);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setFilterStatus(searchParams.get("tab"));
    }
  }, [searchParams]);

  // Modal State for Editing
  const [editingPub, setEditingPub] = useState(null);
  const [editFormData, setEditFormData] = useState({
    paperTitle: "",
    publicationType: "Journal",
    journalConference: "",
    publicationYear: "",
    DOI: "",
    verificationStatus: "pending",
  });
  const [editSaving, setEditSaving] = useState(false);

  const navLinks = [
    { to: "/admin-dashboard", label: "Dashboard" },
    { to: "/manage-publications", label: "Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  const fetchAllPublications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/publications");
      setPublications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPublications();
  }, []);

  const updateStatus = async (id, newStatus) => {
    setBusyId(id);
    setActionError("");
    try {
      const response = await api.put(`/publications/${id}`, { verificationStatus: newStatus });
      setPublications((prev) =>
        prev.map((pub) => (pub._id === id ? response.data.publication : pub))
      );
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this publication permanently?");
    if (!confirmed) return;

    setBusyId(id);
    setActionError("");
    try {
      await api.delete(`/publications/${id}`);
      setPublications((prev) => prev.filter((pub) => pub._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || "Could not delete publication.");
    } finally {
      setBusyId(null);
    }
  };

  const handleOpenEdit = (pub) => {
    setEditingPub(pub);
    setEditFormData({
      paperTitle: pub.paperTitle || "",
      publicationType: pub.publicationType || "Journal",
      journalConference: pub.journalConference || "",
      publicationYear: pub.publicationYear || "",
      DOI: pub.DOI || "",
      verificationStatus: pub.verificationStatus || "pending",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPub) return;
    setEditSaving(true);
    setActionError("");

    try {
      const response = await api.put(`/publications/${editingPub._id}`, editFormData);
      setPublications((prev) =>
        prev.map((pub) => (pub._id === editingPub._id ? response.data.publication : pub))
      );
      setEditingPub(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to save publication changes.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleTabChange = (tabId) => {
    setFilterStatus(tabId);
    setSearchParams({ tab: tabId });
  };

  const filteredPubs = publications.filter((p) => {
    if (filterStatus === "all") return true;
    return p.verificationStatus === filterStatus;
  });

  const pendingCount = publications.filter((p) => p.verificationStatus === "pending").length;
  const verifiedCount = publications.filter((p) => p.verificationStatus === "verified").length;
  const rejectedCount = publications.filter((p) => p.verificationStatus === "rejected").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        /* Rich, noticeable indigo & violet gradient — NOT pale white */
        background: "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 35%, #fbcfe8 75%, #e0e7ff 100%)",
      }}
    >
      <Navbar links={navLinks} />

      <div className="page" style={{ maxWidth: "1020px", padding: "2.5rem 1.5rem 5rem" }}>
        
        {/* Top Control Bar Card with Glass Effect */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            border: "1.5px solid rgba(255, 255, 255, 0.8)",
            padding: "2rem 2.2rem",
            boxShadow: "0 15px 35px -5px rgba(79, 70, 229, 0.15), 0 0 1px 1px rgba(255, 255, 255, 0.6) inset",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          {/* Header with Gradient Icon */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "18px",
                background:
                  filterStatus === "pending"
                    ? "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow: "0 10px 20px -5px rgba(79, 70, 229, 0.4)",
              }}
            >
              {filterStatus === "pending" ? "🛡️" : "📚"}
            </div>
            <div>
              <h2 style={{ fontSize: "1.65rem", fontWeight: 800, margin: 0, color: "#1e1b4b", letterSpacing: "-0.02em" }}>
                {filterStatus === "pending" ? "Verification Desk" : "Manage Publications"}
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: "0.25rem 0 0" }}>
                {filterStatus === "pending"
                  ? "Review submitted research papers awaiting administrative validation"
                  : "Complete directory of faculty publications with full administrative controls"}
              </p>
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              background: "#ffffff",
              padding: "0.4rem",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            {[
              { id: "all", label: "All", count: publications.length, color: "#4f46e5" },
              { id: "pending", label: "Pending", count: pendingCount, color: "#ea580c" },
              { id: "verified", label: "Verified", count: verifiedCount, color: "#059669" },
              { id: "rejected", label: "Rejected", count: rejectedCount, color: "#e11d48" },
            ].map((tab) => {
              const active = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    border: "none",
                    padding: "0.55rem 1.1rem",
                    fontSize: "0.84rem",
                    fontWeight: active ? 800 : 600,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: active
                      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                      : "transparent",
                    color: active ? "#ffffff" : "#64748b",
                    boxShadow: active ? "0 6px 16px -2px rgba(79, 70, 229, 0.45)" : "none",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      background: active ? "rgba(255, 255, 255, 0.25)" : "#f1f5f9",
                      color: active ? "#ffffff" : "#475569",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        {error && <p className="alert alert-error">{error}</p>}
        {actionError && <p className="alert alert-error">{actionError}</p>}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#4f46e5", fontWeight: 700 }}>
            <span>Loading publications directory...</span>
          </div>
        )}

        {/* Attractive Empty State (Not plain white box!) */}
        {!loading && !error && filteredPubs.length === 0 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(16px)",
              borderRadius: "28px",
              border: "1.5px solid rgba(255, 255, 255, 0.8)",
              padding: "4rem 2rem",
              textAlign: "center",
              boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.15)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "22px",
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                margin: "0 auto 1.5rem",
                boxShadow: "0 10px 25px -4px rgba(99, 102, 241, 0.4)",
              }}
            >
              {filterStatus === "pending" ? "🎉" : "📚"}
            </div>
            
            <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1e1b4b", margin: "0 0 0.5rem" }}>
              {filterStatus === "pending" ? "All Submissions Verified!" : "No Publications Found"}
            </h3>
            
            <p style={{ fontSize: "0.94rem", color: "#64748b", margin: "0 auto 2rem", maxWidth: "480px", lineHeight: 1.6 }}>
              {filterStatus === "pending"
                ? "There are currently no research submissions awaiting review. Great job maintaining the verification queue!"
                : "Faculty members have not submitted publications under this filter yet. When submissions arrive, manage them with full administrative controls."}
            </p>

            {/* 3 Visual Feature Highlights (Fills the empty space attractively!) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                maxWidth: "760px",
                margin: "0 auto 1.5rem",
              }}
            >
              <div style={{ background: "#f8faff", border: "1.5px solid #e0e7ff", borderRadius: "16px", padding: "1.2rem", textAlign: "left" }}>
                <span style={{ fontSize: "1.3rem" }}>⚡</span>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e1b4b", margin: "0.4rem 0 0.2rem" }}>Instant Verification</h4>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Review and verify faculty papers with 1-click approval.</p>
              </div>

              <div style={{ background: "#fffbf5", border: "1.5px solid #fed7aa", borderRadius: "16px", padding: "1.2rem", textAlign: "left" }}>
                <span style={{ fontSize: "1.3rem" }}>✏️</span>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#78350f", margin: "0.4rem 0 0.2rem" }}>Edit Paper Details</h4>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Update DOI, journal names, and publication metadata easily.</p>
              </div>

              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "16px", padding: "1.2rem", textAlign: "left" }}>
                <span style={{ fontSize: "1.3rem" }}>📊</span>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#064e3b", margin: "0.4rem 0 0.2rem" }}>Report Generation</h4>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>Export all verified research records to Excel/CSV anytime.</p>
              </div>
            </div>

            {filterStatus !== "all" && (
              <button
                onClick={() => handleTabChange("all")}
                style={{
                  padding: "0.7rem 1.6rem",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  boxShadow: "0 6px 16px -2px rgba(79, 70, 229, 0.4)",
                }}
              >
                View All Publications
              </button>
            )}
          </div>
        )}

        {/* Publications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredPubs.map((pub) => {
            const isVerified = pub.verificationStatus === "verified";
            const isRejected = pub.verificationStatus === "rejected";
            const accentColor = isVerified ? "#10b981" : isRejected ? "#ef4444" : "#f59e0b";

            return (
              <div
                key={pub._id}
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "22px",
                  border: "1.5px solid rgba(255, 255, 255, 0.8)",
                  borderLeft: `5px solid ${accentColor}`,
                  padding: "1.8rem 2.2rem",
                  boxShadow: "0 10px 25px -4px rgba(79, 70, 229, 0.08)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 16px 35px -5px rgba(79, 70, 229, 0.18)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 25px -4px rgba(79, 70, 229, 0.08)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 500px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "8px",
                          background: "#eff6ff",
                          color: "#2563eb",
                        }}
                      >
                        {pub.publicationType}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>•</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>{pub.publicationYear}</span>
                    </div>

                    <h3 style={{ fontSize: "1.28rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem", lineHeight: 1.4 }}>
                      {pub.paperTitle}
                    </h3>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.92rem", color: "#475569" }}>
                      <strong>Venue:</strong> {pub.journalConference}
                    </p>

                    {pub.DOI && (
                      <p style={{ margin: "0 0 0.6rem", fontSize: "0.86rem", color: "#64748b" }}>
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

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#e0e7ff", color: "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>
                        {pub.facultyId?.name ? pub.facultyId.name[0].toUpperCase() : "F"}
                      </div>
                      <span style={{ fontSize: "0.84rem", color: "#475569" }}>
                        Submitted by <strong>{pub.facultyId?.name}</strong> ({pub.facultyId?.email})
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      padding: "0.4rem 0.95rem",
                      borderRadius: "999px",
                      background: isVerified ? "#dcfce7" : isRejected ? "#fee2e2" : "#fef3c7",
                      color: isVerified ? "#15803d" : isRejected ? "#b91c1c" : "#b45309",
                      border: `1px solid ${accentColor}40`,
                    }}
                  >
                    {pub.verificationStatus}
                  </span>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.65rem",
                    marginTop: "1.4rem",
                    paddingTop: "1.1rem",
                    borderTop: "1px solid #f1f5f9",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => updateStatus(pub._id, "verified")}
                    disabled={busyId === pub._id || isVerified}
                    style={{
                      padding: "0.55rem 1.1rem",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      borderRadius: "12px",
                      border: "none",
                      background: isVerified ? "#f1f5f9" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: isVerified ? "#94a3b8" : "#ffffff",
                      cursor: isVerified ? "not-allowed" : "pointer",
                      boxShadow: isVerified ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    {isVerified ? "✓ Verified" : "Verify Paper"}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(pub._id, "rejected")}
                    disabled={busyId === pub._id || isRejected}
                    style={{
                      padding: "0.55rem 1.1rem",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      borderRadius: "12px",
                      border: "none",
                      background: isRejected ? "#f1f5f9" : "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                      color: isRejected ? "#94a3b8" : "#ffffff",
                      cursor: isRejected ? "not-allowed" : "pointer",
                      boxShadow: isRejected ? "none" : "0 4px 12px rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    {isRejected ? "✕ Rejected" : "Reject Paper"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(pub)}
                    disabled={busyId === pub._id}
                    style={{
                      padding: "0.55rem 1.1rem",
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      borderRadius: "12px",
                      border: "1.5px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#334155",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(pub._id)}
                    disabled={busyId === pub._id}
                    style={{
                      padding: "0.55rem 1.1rem",
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      borderRadius: "12px",
                      border: "none",
                      background: "#fee2e2",
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingPub && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "28px",
              padding: "2.4rem",
              width: "100%",
              maxWidth: "560px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.2rem" }}>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  Edit Publication Details
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0.25rem 0 0" }}>
                  Update metadata, fix typos, or override status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPub(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Paper Title
                </label>
                <input
                  type="text"
                  value={editFormData.paperTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, paperTitle: e.target.value })}
                  required
                  className="field-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                    Publication Type
                  </label>
                  <select
                    value={editFormData.publicationType}
                    onChange={(e) => setEditFormData({ ...editFormData, publicationType: e.target.value })}
                    className="field-input"
                    style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                  >
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Patent">Patent</option>
                  </select>
                </div>

                <div>
                  <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                    Publication Year
                  </label>
                  <input
                    type="number"
                    value={editFormData.publicationYear}
                    onChange={(e) => setEditFormData({ ...editFormData, publicationYear: e.target.value })}
                    required
                    className="field-input"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Journal / Conference Name
                </label>
                <input
                  type="text"
                  value={editFormData.journalConference}
                  onChange={(e) => setEditFormData({ ...editFormData, journalConference: e.target.value })}
                  required
                  className="field-input"
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  DOI Identifier
                </label>
                <input
                  type="text"
                  value={editFormData.DOI}
                  onChange={(e) => setEditFormData({ ...editFormData, DOI: e.target.value })}
                  className="field-input"
                  placeholder="e.g. 10.1109/..."
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label className="field-label" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.85rem" }}>
                  Verification Status
                </label>
                <select
                  value={editFormData.verificationStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, verificationStatus: e.target.value })}
                  className="field-input"
                  style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.85rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                <button
                  type="button"
                  onClick={() => setEditingPub(null)}
                  style={{
                    padding: "0.7rem 1.4rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    background: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editSaving}
                  className="btn btn-primary"
                  style={{ width: "auto", margin: 0, padding: "0.7rem 1.8rem", borderRadius: "12px", fontWeight: 700 }}
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}