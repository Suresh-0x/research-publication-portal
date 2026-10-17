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

  const [filterStatus, setFilterStatus] = useState(
    currentTab.toUpperCase() === "ALL"
      ? "all"
      : currentTab.toUpperCase()
  );

  // Edit modal
  const [editingPub, setEditingPub] = useState(null);

  const [editFormData, setEditFormData] = useState({
    paperTitle: "",
    publicationType: "Journal",
    journalConference: "",
    publicationYear: "",
    DOI: "",
  });

  const [editSaving, setEditSaving] = useState(false);

  const navLinks = [
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/search-publications", label: "Search" },
  { to: "/manage-departments", label: "Departments" },
];
  // ============================================================
  // FETCH ALL PUBLICATIONS
  // ============================================================

  const fetchAllPublications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/publications");

      /*
        Backend response can be:

        {
          publications: [...],
          pagination: {...}
        }

        Therefore we must extract publications.
      */

      const data = response.data;

      const publicationsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.publications)
        ? data.publications
        : [];

      setPublications(publicationsData);
    } catch (err) {
      console.error("Fetch publications error:", err);

      setPublications([]);

      setError(
        err.response?.data?.message ||
          "Could not load publications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPublications();
  }, []);

  // ============================================================
  // UPDATE VERIFICATION STATUS
  // ============================================================

  const updateStatus = async (id, newStatus) => {
    setBusyId(id);
    setActionError("");

    try {
      const status = newStatus.toUpperCase();

      /*
        IMPORTANT:

        Verification uses:
        PUT /publications/:id/verify

        NOT:
        PUT /publications/:id
      */

      const response = await api.put(
        `/publications/${id}/verify`,
        {
          verificationStatus: status,
        }
      );

      const updatedPublication = response.data?.publication;

      if (!updatedPublication) {
        throw new Error(
          "Updated publication was not returned by server."
        );
      }

      setPublications((prev) =>
        prev.map((pub) =>
          pub._id === id
            ? updatedPublication
            : pub
        )
      );
    } catch (err) {
      console.error("Update status error:", err);

      setActionError(
        err.response?.data?.message ||
          "Could not update publication status."
      );
    } finally {
      setBusyId(null);
    }
  };

  // ============================================================
  // DELETE PUBLICATION
  // ============================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this publication permanently?"
    );

    if (!confirmed) return;

    setBusyId(id);
    setActionError("");

    try {
      await api.delete(`/publications/${id}`);

      setPublications((prev) =>
        prev.filter((pub) => pub._id !== id)
      );
    } catch (err) {
      console.error("Delete publication error:", err);

      setActionError(
        err.response?.data?.message ||
          "Could not delete publication."
      );
    } finally {
      setBusyId(null);
    }
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const handleOpenEdit = (pub) => {
    setEditingPub(pub);
    setActionError("");

    setEditFormData({
      paperTitle: pub.paperTitle || "",
      publicationType:
        pub.publicationType || "Journal",
      journalConference:
        pub.journalConference || "",
      publicationYear:
        pub.publicationYear || "",
      DOI: pub.DOI || "",
    });
  };

  // ============================================================
  // SAVE EDITED PUBLICATION
  // ============================================================

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingPub) return;

    setEditSaving(true);
    setActionError("");

    try {
      /*
        Normal update is ONLY for publication details.

        Verification is handled separately through:
        /publications/:id/verify
      */

      const response = await api.put(
        `/publications/${editingPub._id}`,
        {
          paperTitle: editFormData.paperTitle,
          publicationType:
            editFormData.publicationType,
          journalConference:
            editFormData.journalConference,
          publicationYear:
            Number(editFormData.publicationYear),
          DOI: editFormData.DOI,
        }
      );

      const updatedPublication =
        response.data?.publication;

      if (!updatedPublication) {
        throw new Error(
          "Updated publication was not returned by server."
        );
      }

      setPublications((prev) =>
        prev.map((pub) =>
          pub._id === editingPub._id
            ? updatedPublication
            : pub
        )
      );

      setEditingPub(null);
    } catch (err) {
      console.error("Edit publication error:", err);

      setActionError(
        err.response?.data?.message ||
          "Failed to save publication changes."
      );
    } finally {
      setEditSaving(false);
    }
  };

  // ============================================================
  // TAB CHANGE
  // ============================================================

  const handleTabChange = (tabId) => {
    setFilterStatus(tabId);

    if (tabId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({
        tab: tabId.toLowerCase(),
      });
    }
  };

  // ============================================================
  // NORMALIZE STATUS
  // ============================================================

  const getStatus = (publication) => {
    return String(
      publication?.verificationStatus || "PENDING"
    ).toUpperCase();
  };

  // ============================================================
  // FILTER PUBLICATIONS
  // ============================================================

  const filteredPubs = publications.filter((publication) => {
    if (filterStatus === "all") {
      return true;
    }

    return (
      getStatus(publication) === filterStatus
    );
  });

  // ============================================================
  // COUNTS
  // ============================================================

  const pendingCount = publications.filter(
    (publication) =>
      getStatus(publication) === "PENDING"
  ).length;

  const verifiedCount = publications.filter(
    (publication) =>
      getStatus(publication) === "VERIFIED"
  ).length;

  const rejectedCount = publications.filter(
    (publication) =>
      getStatus(publication) === "REJECTED"
  ).length;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 35%, #fbcfe8 75%, #e0e7ff 100%)",
      }}
    >
      <Navbar links={navLinks} />

      <div
        className="page"
        style={{
          maxWidth: "1020px",
          padding: "2.5rem 1.5rem 5rem",
          margin: "0 auto",
        }}
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          style={{
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            border:
              "1.5px solid rgba(255, 255, 255, 0.8)",
            padding: "2rem 2.2rem",
            boxShadow:
              "0 15px 35px -5px rgba(79, 70, 229, 0.15)",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          {/* Title */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "18px",
                background:
                  filterStatus === "PENDING"
                    ? "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
                    : "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow:
                  "0 10px 20px -5px rgba(79, 70, 229, 0.4)",
              }}
            >
              {filterStatus === "PENDING"
                ? "🛡️"
                : "📚"}
            </div>

            <div>
              <h2
                style={{
                  fontSize: "1.65rem",
                  fontWeight: 800,
                  margin: 0,
                  color: "#1e1b4b",
                  letterSpacing: "-0.02em",
                }}
              >
                {filterStatus === "PENDING"
                  ? "Verification Desk"
                  : "Manage Publications"}
              </h2>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: "0.25rem 0 0",
                }}
              >
                {filterStatus === "PENDING"
                  ? "Review submitted research papers awaiting administrative validation"
                  : "Complete directory of faculty publications with full administrative controls"}
              </p>
            </div>
          </div>

          {/* ====================================================
              FILTER TABS
          ==================================================== */}

          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              background: "#ffffff",
              padding: "0.4rem",
              borderRadius: "16px",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.05)",
              border: "1px solid #e2e8f0",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                id: "all",
                label: "All",
                count: publications.length,
              },
              {
                id: "PENDING",
                label: "Pending",
                count: pendingCount,
              },
              {
                id: "VERIFIED",
                label: "Verified",
                count: verifiedCount,
              },
              {
                id: "REJECTED",
                label: "Rejected",
                count: rejectedCount,
              },
            ].map((tab) => {
              const active =
                filterStatus === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    handleTabChange(tab.id)
                  }
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
                    color: active
                      ? "#ffffff"
                      : "#64748b",
                    boxShadow: active
                      ? "0 6px 16px -2px rgba(79, 70, 229, 0.45)"
                      : "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{tab.label}</span>

                  <span
                    style={{
                      background: active
                        ? "rgba(255, 255, 255, 0.25)"
                        : "#f1f5f9",
                      color: active
                        ? "#ffffff"
                        : "#475569",
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

        {/* ======================================================
            ERRORS
        ====================================================== */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {actionError && (
          <div
            style={{
              background: "#fff7ed",
              color: "#c2410c",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {actionError}
          </div>
        )}

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 0",
              color: "#4f46e5",
              fontWeight: 700,
            }}
          >
            Loading publications directory...
          </div>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!loading &&
          !error &&
          filteredPubs.length === 0 && (
            <div
              style={{
                background:
                  "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(16px)",
                borderRadius: "28px",
                border:
                  "1.5px solid rgba(255, 255, 255, 0.8)",
                padding: "4rem 2rem",
                textAlign: "center",
                boxShadow:
                  "0 20px 40px -10px rgba(79, 70, 229, 0.15)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "22px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.2rem",
                  margin: "0 auto 1.5rem",
                }}
              >
                {filterStatus === "PENDING"
                  ? "🎉"
                  : "📚"}
              </div>

              <h3
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "#1e1b4b",
                  margin: "0 0 0.5rem",
                }}
              >
                {filterStatus === "PENDING"
                  ? "No Pending Publications"
                  : "No Publications Found"}
              </h3>

              <p
                style={{
                  fontSize: "0.94rem",
                  color: "#64748b",
                  margin: "0 auto 2rem",
                  maxWidth: "480px",
                  lineHeight: 1.6,
                }}
              >
                {filterStatus === "PENDING"
                  ? "There are currently no research submissions awaiting review."
                  : "No research publications are available under this filter."}
              </p>

              {filterStatus !== "all" && (
                <button
                  type="button"
                  onClick={() =>
                    handleTabChange("all")
                  }
                  style={{
                    padding: "0.7rem 1.6rem",
                    borderRadius: "14px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                  }}
                >
                  View All Publications
                </button>
              )}
            </div>
          )}

        {/* ======================================================
            PUBLICATIONS
        ====================================================== */}

        {!loading && filteredPubs.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {filteredPubs.map((pub) => {
              const status = getStatus(pub);

              const isVerified =
                status === "VERIFIED";

              const isRejected =
                status === "REJECTED";

              const accentColor = isVerified
                ? "#10b981"
                : isRejected
                ? "#ef4444"
                : "#f59e0b";

              return (
                <div
                  key={pub._id}
                  style={{
                    background:
                      "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "22px",
                    border:
                      "1.5px solid rgba(255, 255, 255, 0.8)",
                    borderLeft: `5px solid ${accentColor}`,
                    padding: "1.8rem 2.2rem",
                    boxShadow:
                      "0 10px 25px -4px rgba(79, 70, 229, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        flex: "1 1 500px",
                      }}
                    >
                      {/* Type + Year */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform:
                              "uppercase",
                            padding:
                              "0.25rem 0.65rem",
                            borderRadius: "8px",
                            background: "#eff6ff",
                            color: "#2563eb",
                          }}
                        >
                          {pub.publicationType}
                        </span>

                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                          }}
                        >
                          •
                        </span>

                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#475569",
                          }}
                        >
                          {pub.publicationYear}
                        </span>
                      </div>

                      {/* Title */}

                      <h3
                        style={{
                          fontSize: "1.28rem",
                          fontWeight: 700,
                          color: "#0f172a",
                          margin:
                            "0 0 0.5rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {pub.paperTitle}
                      </h3>

                      {/* Journal */}

                      <p
                        style={{
                          margin:
                            "0 0 0.5rem",
                          fontSize: "0.92rem",
                          color: "#475569",
                        }}
                      >
                        <strong>
                          Venue:
                        </strong>{" "}
                        {pub.journalConference}
                      </p>

                      {/* DOI */}

                      {pub.DOI && (
                        <p
                          style={{
                            margin:
                              "0 0 0.6rem",
                            fontSize: "0.86rem",
                            color: "#64748b",
                          }}
                        >
                          <strong>
                            DOI:
                          </strong>{" "}
                          <a
                            href={
                              pub.DOI.startsWith(
                                "http"
                              )
                                ? pub.DOI
                                : `https://doi.org/${pub.DOI}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#6366f1",
                              fontWeight: 600,
                              textDecoration:
                                "underline",
                            }}
                          >
                            {pub.DOI}
                          </a>
                        </p>
                      )}

                      {/* Faculty */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.6rem",
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#e0e7ff",
                            color: "#4338ca",
                            display: "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {pub.facultyId?.name
                            ? pub.facultyId.name[0].toUpperCase()
                            : "F"}
                        </div>

                        <span
                          style={{
                            fontSize: "0.84rem",
                            color: "#475569",
                          }}
                        >
                          Submitted by{" "}
                          <strong>
                            {pub.facultyId?.name ||
                              "Unknown Faculty"}
                          </strong>

                          {pub.facultyId?.email && (
                            <>
                              {" "}
                              (
                              {
                                pub.facultyId
                                  .email
                              }
                              )
                            </>
                          )}
                        </span>
                      </div>

                      {/* Department */}

                      {pub.facultyId?.department
                        ?.departmentName && (
                        <p
                          style={{
                            margin:
                              "0.5rem 0 0",
                            fontSize:
                              "0.84rem",
                            color:
                              "#64748b",
                          }}
                        >
                          <strong>
                            Department:
                          </strong>{" "}
                          {
                            pub.facultyId
                              .department
                              .departmentName
                          }
                        </p>
                      )}
                    </div>

                    {/* STATUS */}

                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        padding:
                          "0.4rem 0.95rem",
                        borderRadius: "999px",
                        background: isVerified
                          ? "#dcfce7"
                          : isRejected
                          ? "#fee2e2"
                          : "#fef3c7",
                        color: isVerified
                          ? "#15803d"
                          : isRejected
                          ? "#b91c1c"
                          : "#b45309",
                        border: `1px solid ${accentColor}40`,
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "flex-end",
                      gap: "0.65rem",
                      marginTop: "1.4rem",
                      paddingTop: "1.1rem",
                      borderTop:
                        "1px solid #f1f5f9",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* VERIFY */}

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          pub._id,
                          "VERIFIED"
                        )
                      }
                      disabled={
                        busyId === pub._id ||
                        isVerified
                      }
                      style={{
                        padding:
                          "0.55rem 1.1rem",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        borderRadius: "12px",
                        border: "none",
                        background:
                          isVerified
                            ? "#f1f5f9"
                            : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: isVerified
                          ? "#94a3b8"
                          : "#ffffff",
                        cursor: isVerified
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {busyId === pub._id
                        ? "Processing..."
                        : isVerified
                        ? "✓ Verified"
                        : "Verify Paper"}
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          pub._id,
                          "REJECTED"
                        )
                      }
                      disabled={
                        busyId === pub._id ||
                        isRejected
                      }
                      style={{
                        padding:
                          "0.55rem 1.1rem",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        borderRadius: "12px",
                        border: "none",
                        background:
                          isRejected
                            ? "#f1f5f9"
                            : "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                        color: isRejected
                          ? "#94a3b8"
                          : "#ffffff",
                        cursor: isRejected
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {busyId === pub._id
                        ? "Processing..."
                        : isRejected
                        ? "✕ Rejected"
                        : "Reject Paper"}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenEdit(pub)
                      }
                      disabled={
                        busyId === pub._id
                      }
                      style={{
                        padding:
                          "0.55rem 1.1rem",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        borderRadius: "12px",
                        border:
                          "1.5px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit Details
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(pub._id)
                      }
                      disabled={
                        busyId === pub._id
                      }
                      style={{
                        padding:
                          "0.55rem 1.1rem",
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
        )}
      </div>

      {/* ==========================================================
          EDIT MODAL
      ========================================================== */}

      {editingPub && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.65)",
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
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "1.75rem",
                borderBottom:
                  "1px solid #f1f5f9",
                paddingBottom: "1.2rem",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Edit Publication Details
                </h3>

                <p
                  style={{
                    fontSize: "0.84rem",
                    color: "#64748b",
                    margin:
                      "0.25rem 0 0",
                  }}
                >
                  Update publication metadata
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingPub(null)
                }
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                ✕
              </button>
            </div>

            {/* ====================================================
                FORM
            ==================================================== */}

            <form
              onSubmit={handleSaveEdit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              {/* TITLE */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  Paper Title
                </label>

                <input
                  type="text"
                  value={
                    editFormData.paperTitle
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      paperTitle:
                        e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.75rem",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* TYPE + YEAR */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom:
                        "0.4rem",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Publication Type
                  </label>

                  <select
                    value={
                      editFormData.publicationType
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        publicationType:
                          e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: "10px",
                      background: "#ffffff",
                    }}
                  >
                    <option value="Journal">
                      Journal
                    </option>
                    <option value="Conference">
                      Conference
                    </option>
                    <option value="Book Chapter">
                      Book Chapter
                    </option>
                    <option value="Patent">
                      Patent
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom:
                        "0.4rem",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Publication Year
                  </label>

                  <input
                    type="number"
                    value={
                      editFormData.publicationYear
                    }
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        publicationYear:
                          e.target.value,
                      })
                    }
                    required
                    min="1900"
                    max="2100"
                    style={{
                      width: "100%",
                      boxSizing:
                        "border-box",
                      padding: "0.75rem",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              {/* JOURNAL / CONFERENCE */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  Journal / Conference Name
                </label>

                <input
                  type="text"
                  value={
                    editFormData.journalConference
                  }
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      journalConference:
                        e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.75rem",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* DOI */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  DOI Identifier
                </label>

                <input
                  type="text"
                  value={editFormData.DOI}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      DOI: e.target.value,
                    })
                  }
                  placeholder="e.g. 10.1109/..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "0.75rem",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "0.85rem",
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop:
                    "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setEditingPub(null)
                  }
                  style={{
                    padding:
                      "0.7rem 1.4rem",
                    borderRadius: "12px",
                    border:
                      "1.5px solid #cbd5e1",
                    background: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editSaving}
                  style={{
                    padding:
                      "0.7rem 1.8rem",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: editSaving
                      ? "not-allowed"
                      : "pointer",
                    opacity: editSaving
                      ? 0.7
                      : 1,
                  }}
                >
                  {editSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}