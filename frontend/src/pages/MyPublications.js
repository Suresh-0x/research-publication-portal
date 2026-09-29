import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function MyPublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  // Modal State for Editing
  const [editingPub, setEditingPub] = useState(null);
  const [editFormData, setEditFormData] = useState({
    paperTitle: "",
    publicationType: "Journal",
    journalConference: "",
    publicationYear: "",
    DOI: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [modalError, setModalError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const navLinks = [
    { to: "/faculty-dashboard", label: "Dashboard" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/search-publications", label: "Search" },
  ];

  const fetchMyPublications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/publications?mine=true");
      setPublications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPublications();
  }, []);

  const openEditModal = (pub) => {
    setEditingPub(pub);
    setModalError("");
    setEditFormData({
      paperTitle: pub.paperTitle || "",
      publicationType: pub.publicationType || "Journal",
      journalConference: pub.journalConference || "",
      publicationYear: pub.publicationYear || "",
      DOI: pub.DOI || "",
    });
  };

  const closeEditModal = () => {
    setEditingPub(null);
    setModalError("");
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPub) return;
    setSavingEdit(true);
    setModalError("");

    try {
      const response = await api.put(`/publications/${editingPub._id}`, editFormData);
      setPublications((prev) =>
        prev.map((pub) => (pub._id === editingPub._id ? response.data.publication : pub))
      );
      setEditingPub(null);
      setActionSuccess("Publication updated successfully!");
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to update publication.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter computations
  const pendingCount = publications.filter((p) => p.verificationStatus === "pending").length;
  const verifiedCount = publications.filter((p) => p.verificationStatus === "verified").length;
  const rejectedCount = publications.filter((p) => p.verificationStatus === "rejected").length;

  const filteredPublications = publications.filter((p) => {
    if (filterTab === "all") return true;
    return p.verificationStatus === filterTab;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)",
      }}
    >
      <Navbar links={navLinks} />

      <main style={{ maxWidth: "1080px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
        
        {/* Top Header Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: "26px",
            border: "2px solid #818cf8",
            padding: "2rem 2.2rem",
            boxShadow: "0 15px 35px -5px rgba(99, 102, 241, 0.12)",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.6rem",
              }}
            >
              <span>🎓</span>
              <span>Faculty Research Portfolio</span>
            </div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 0.35rem",
                letterSpacing: "-0.03em",
              }}
            >
              My Publications
            </h1>
            <p style={{ fontSize: "0.92rem", color: "#64748b", margin: 0 }}>
              Track your publication statuses, review administrative verification feedback, or update DOI information.
            </p>
          </div>

          <Link
            to="/add-publication"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.4rem",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.92rem",
              textDecoration: "none",
              boxShadow: "0 8px 20px -3px rgba(79, 70, 229, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            <span>➕</span>
            <span>Add New Paper</span>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              borderRadius: "16px",
              background: "#ecfdf5",
              border: "1.5px solid #86efac",
              color: "#166534",
              fontSize: "0.92rem",
              fontWeight: 600,
              marginBottom: "1.75rem",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.1)",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🎉</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Global Error Alert */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.9rem 1.25rem",
              borderRadius: "16px",
              background: "#fef2f2",
              border: "1.5px solid #fecaca",
              color: "#991b1b",
              fontSize: "0.92rem",
              fontWeight: 600,
              marginBottom: "1.75rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Metric Summary & Filter Tabs Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          {/* Tab Buttons */}
          <div
            style={{
              display: "inline-flex",
              gap: "0.4rem",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "0.4rem",
              borderRadius: "16px",
              border: "1.5px solid #cbd5e1",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            }}
          >
            {[
              { id: "all", label: "All Papers", count: publications.length },
              { id: "pending", label: "Pending", count: pendingCount },
              { id: "verified", label: "Verified", count: verifiedCount },
              { id: "rejected", label: "Rejected", count: rejectedCount },
            ].map((tab) => {
              const active = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  style={{
                    border: "none",
                    padding: "0.55rem 1.1rem",
                    fontSize: "0.85rem",
                    fontWeight: active ? 800 : 600,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: active
                      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                      : "transparent",
                    color: active ? "#ffffff" : "#64748b",
                    boxShadow: active ? "0 6px 16px -2px rgba(79, 70, 229, 0.4)" : "none",
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

          <div style={{ fontSize: "0.88rem", color: "#64748b", fontWeight: 600 }}>
            Showing <span style={{ color: "#0f172a", fontWeight: 700 }}>{filteredPublications.length}</span> of {publications.length} publications
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "22px",
              border: "1.5px solid #e2e8f0",
              padding: "4rem 2rem",
              textAlign: "center",
              color: "#64748b",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⏳</div>
            <h3 style={{ margin: "0 0 0.5rem", color: "#1e293b", fontSize: "1.15rem" }}>Loading Publications...</h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>Fetching your publication history from the secure server.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPublications.length === 0 && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "26px",
              border: "2px dashed #cbd5e1",
              padding: "4.5rem 2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.08)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1e293b", margin: "0 0 0.5rem" }}>
              {filterTab === "all"
                ? "No publications submitted yet"
                : `No ${filterTab} publications found`}
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.92rem", maxWidth: "480px", margin: "0 auto 1.75rem" }}>
              {filterTab === "all"
                ? "You haven't recorded any research publications yet. Start building your portfolio by submitting your first paper."
                : `There are currently no research papers marked as ${filterTab} in your record.`}
            </p>
            <Link
              to="/add-publication"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.4rem",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 8px 20px -3px rgba(79, 70, 229, 0.35)",
              }}
            >
              <span>🚀 Submit Publication</span>
            </Link>
          </div>
        )}

        {/* Publication Cards Grid/List */}
        {!loading && filteredPublications.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filteredPublications.map((pub) => {
              const isVerified = pub.verificationStatus === "verified";
              const isPending = pub.verificationStatus === "pending";
              const isRejected = pub.verificationStatus === "rejected";

              return (
                <div
                  key={pub._id}
                  style={{
                    background: "rgba(255, 255, 255, 0.96)",
                    backdropFilter: "blur(14px)",
                    borderRadius: "22px",
                    border: isVerified
                      ? "2px solid #86efac"
                      : isRejected
                      ? "2px solid #fca5a5"
                      : "2px solid #818cf8",
                    padding: "1.75rem 2rem",
                    boxShadow: "0 10px 30px -8px rgba(99, 102, 241, 0.12), 0 2px 6px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 18px 40px -10px rgba(99, 102, 241, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 30px -8px rgba(99, 102, 241, 0.12), 0 2px 6px rgba(0, 0, 0, 0.03)";
                  }}
                >
                  {/* Card Header Row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      marginBottom: "0.9rem",
                    }}
                  >
                    {/* Left Badges (Type & Year) */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          background: "#e0e7ff",
                          color: "#3730a3",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "10px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        <span>{pub.publicationType === "Conference" ? "🎤" : pub.publicationType === "Book Chapter" ? "📖" : pub.publicationType === "Patent" ? "💡" : "📄"}</span>
                        <span>{pub.publicationType}</span>
                      </span>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          background: "#f1f5f9",
                          color: "#475569",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "10px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        <span>📅</span>
                        <span>{pub.publicationYear}</span>
                      </span>
                    </div>

                    {/* Right Status Badge */}
                    <div>
                      {isVerified && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "#dcfce7",
                            color: "#15803d",
                            border: "1px solid #86efac",
                            padding: "0.35rem 0.85rem",
                            borderRadius: "999px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            boxShadow: "0 2px 6px rgba(34, 197, 94, 0.15)",
                          }}
                        >
                          <span>✅</span>
                          <span>Verified & Listed</span>
                        </span>
                      )}

                      {isPending && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "#fef3c7",
                            color: "#b45309",
                            border: "1px solid #fde68a",
                            padding: "0.35rem 0.85rem",
                            borderRadius: "999px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            boxShadow: "0 2px 6px rgba(245, 158, 11, 0.15)",
                          }}
                        >
                          <span>⏳</span>
                          <span>Pending Admin Review</span>
                        </span>
                      )}

                      {isRejected && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "#ffe4e6",
                            color: "#be123c",
                            border: "1px solid #fecdd3",
                            padding: "0.35rem 0.85rem",
                            borderRadius: "999px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            boxShadow: "0 2px 6px rgba(244, 63, 94, 0.15)",
                          }}
                        >
                          <span>❌</span>
                          <span>Rejected / Needs Revision</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Paper Title */}
                  <h2
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: "0 0 0.6rem",
                      lineHeight: 1.35,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {pub.paperTitle}
                  </h2>

                  {/* Journal / Conference Name */}
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#475569",
                      margin: "0 0 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>🏛️</span>
                    <span style={{ fontWeight: 600 }}>{pub.journalConference}</span>
                  </p>

                  {/* DOI & Action Section */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    {/* DOI Badge with Clickable Link */}
                    <div>
                      {pub.DOI ? (
                        <a
                          href={pub.DOI.startsWith("http") ? pub.DOI : `https://doi.org/${pub.DOI}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            border: "1px solid #bfdbfe",
                            padding: "0.4rem 0.85rem",
                            borderRadius: "10px",
                            fontSize: "0.84rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dbeafe";
                            e.currentTarget.style.borderColor = "#93c5fd";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#eff6ff";
                            e.currentTarget.style.borderColor = "#bfdbfe";
                          }}
                        >
                          <span>🔗</span>
                          <span>DOI: <strong>{pub.DOI}</strong></span>
                          <span style={{ fontSize: "0.75rem" }}>↗</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontStyle: "italic" }}>
                          No DOI recorded
                        </span>
                      )}
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(pub)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.55rem 1.1rem",
                        borderRadius: "12px",
                        background: "#ffffff",
                        border: "1.5px solid #cbd5e1",
                        color: "#334155",
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#6366f1";
                        e.currentTarget.style.color = "#4f46e5";
                        e.currentTarget.style.background = "#f5f3ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.color = "#334155";
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <span>✏️</span>
                      <span>Edit Publication</span>
                    </button>
                  </div>

                  {/* Helpful status hint */}
                  {isRejected && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        color: "#9f1239",
                        fontSize: "0.84rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>💡</span>
                      <span><strong>Admin Note:</strong> This paper was not approved. Click <strong>Edit Publication</strong> to fix the journal title or DOI and re-submit.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Edit Publication Modal */}
      {editingPub && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "26px",
              border: "2px solid #818cf8",
              maxWidth: "600px",
              width: "100%",
              padding: "2.2rem 2.2rem",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
              animation: "cardZoomIn 0.25s ease-out",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.25rem" }}>
                  ✏️ Edit Publication
                </h2>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                  Update your research paper information.
                </p>
              </div>
              <button
                onClick={closeEditModal}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "999px",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                ⚠️ {modalError}
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              
              {/* Paper Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>
                  Paper Title *
                </label>
                <input
                  type="text"
                  name="paperTitle"
                  value={editFormData.paperTitle}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.7rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Type and Year Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>
                    Publication Type *
                  </label>
                  <select
                    name="publicationType"
                    value={editFormData.publicationType}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.7rem 0.95rem",
                      borderRadius: "12px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "0.92rem",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Patent">Patent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>
                    Publication Year *
                  </label>
                  <input
                    type="number"
                    name="publicationYear"
                    value={editFormData.publicationYear}
                    onChange={handleEditChange}
                    required
                    min="1950"
                    max="2100"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.7rem 0.95rem",
                      borderRadius: "12px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Journal / Conference */}
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>
                  Journal / Conference Name *
                </label>
                <input
                  type="text"
                  name="journalConference"
                  value={editFormData.journalConference}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.7rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* DOI */}
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>
                  Digital Object Identifier (DOI)
                </label>
                <input
                  type="text"
                  name="DOI"
                  value={editFormData.DOI}
                  onChange={handleEditChange}
                  placeholder="e.g. 10.1038/nature14539"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.7rem 0.95rem",
                    borderRadius: "12px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: "0.7rem 1.3rem",
                    borderRadius: "12px",
                    background: "#f1f5f9",
                    border: "none",
                    color: "#475569",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{
                    padding: "0.7rem 1.5rem",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: savingEdit ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 16px -2px rgba(79, 70, 229, 0.4)",
                  }}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

