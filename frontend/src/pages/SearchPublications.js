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

  // Role-based navbar
  const navLinks =
    user?.role === "admin"
      ? [
          { to: "/admin-dashboard", label: "Dashboard" },
          { to: "/manage-publications", label: "Publications" },
          { to: "/search-publications", label: "Search" },
          { to: "/manage-departments", label: "Departments" },
        ]
      : [
          { to: "/faculty-dashboard", label: "Dashboard" },
          { to: "/add-publication", label: "Add Publication" },
          { to: "/my-publications", label: "My Publications" },
          { to: "/search-publications", label: "Search" },
        ];

  // ---------------------------------------------------------
  // SEARCH PUBLICATIONS
  // ---------------------------------------------------------
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams();

      // Paper title / keywords
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      // Journal / Conference
      if (journalConference.trim()) {
        params.append(
          "journalConference",
          journalConference.trim()
        );
      }

      // DOI
      if (doi.trim()) {
        params.append("DOI", doi.trim());
      }

      // Publication year
      if (year) {
        params.append("year", year);
      }

      // Publication type
      if (publicationType) {
        params.append("type", publicationType);
      }

      // Verification status
      if (status) {
        params.append("status", status.toUpperCase());
      }

      const queryString = params.toString();

      const response = await api.get(
        queryString
          ? `/publications?${queryString}`
          : "/publications"
      );

      const data = response.data;

      // Backend normally returns:
      // {
      //   publications: [],
      //   pagination: {}
      // }
      //
      // This also safely supports an array response.
      const publications = Array.isArray(data)
        ? data
        : Array.isArray(data?.publications)
        ? data.publications
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setResults(publications);
    } catch (err) {
      console.error("Search publications error:", err);

      setResults([]);

      setError(
        err.response?.data?.message ||
          "Could not search publications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------------
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
          maxWidth: "920px",
          padding: "2.5rem 1.5rem 5rem",
        }}
      >
        {/* =====================================================
            SEARCH FILTER BOX
        ====================================================== */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: "26px",
            border: "2px solid #818cf8",
            padding: "2.2rem 2.4rem",
            boxShadow:
              "0 15px 35px -5px rgba(79, 70, 229, 0.15), 0 0 1px 1px rgba(255, 255, 255, 0.6) inset",
            marginBottom: "2rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.2rem",
              marginBottom: "1.8rem",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "1.25rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                boxShadow:
                  "0 8px 18px -4px rgba(37, 99, 235, 0.4)",
              }}
            >
              🔍
            </div>

            <div>
              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  margin: 0,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Search Publications
              </h2>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: "0.25rem 0 0",
                }}
              >
                Filter across research papers, conferences,
                faculty submissions, and DOI identifiers
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            {/* Paper Title */}
            <div>
              <label
                className="field-label"
                style={{
                  display: "block",
                  marginBottom: "0.45rem",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#334155",
                }}
              >
                Paper Title or Keywords
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="field-input"
                placeholder="e.g. Machine Learning, Deep Neural Networks, IoT..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#ffffff",
                }}
              />
            </div>

            {/* Journal + DOI */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  className="field-label"
                  style={{
                    display: "block",
                    marginBottom: "0.45rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#334155",
                  }}
                >
                  Journal / Conference Name
                </label>

                <input
                  type="text"
                  value={journalConference}
                  onChange={(e) =>
                    setJournalConference(e.target.value)
                  }
                  className="field-input"
                  placeholder="e.g. IEEE, Springer, ACM, Elsevier..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                />
              </div>

              <div>
                <label
                  className="field-label"
                  style={{
                    display: "block",
                    marginBottom: "0.45rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#334155",
                  }}
                >
                  DOI Identifier
                </label>

                <input
                  type="text"
                  value={doi}
                  onChange={(e) =>
                    setDoi(e.target.value)
                  }
                  className="field-input"
                  placeholder="e.g. 10.1109/..."
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                />
              </div>
            </div>

            {/* Year + Type + Status */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1fr",
                gap: "1rem",
              }}
            >
              {/* Year */}
              <div>
                <label
                  className="field-label"
                  style={{
                    display: "block",
                    marginBottom: "0.45rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#334155",
                  }}
                >
                  Year
                </label>

                <input
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value)
                  }
                  className="field-input"
                  placeholder="e.g. 2026"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#ffffff",
                  }}
                />
              </div>

              {/* Publication Type */}
              <div>
                <label
                  className="field-label"
                  style={{
                    display: "block",
                    marginBottom: "0.45rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#334155",
                  }}
                >
                  Publication Type
                </label>

                <select
                  value={publicationType}
                  onChange={(e) =>
                    setPublicationType(e.target.value)
                  }
                  className="field-input"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    background: "#ffffff",
                  }}
                >
                  <option value="">All Types</option>
                  <option value="Journal">Journal</option>
                  <option value="Conference">Conference</option>
                  <option value="Book Chapter">
                    Book Chapter
                  </option>
                  <option value="Patent">Patent</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  className="field-label"
                  style={{
                    display: "block",
                    marginBottom: "0.45rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#334155",
                  }}
                >
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="field-input"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    background: "#ffffff",
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="VERIFIED">
                    Verified
                  </option>
                  <option value="PENDING">
                    Pending
                  </option>
                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0.85rem",
                marginTop: "0.75rem",
                paddingTop: "1.2rem",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "0.75rem 1.4rem",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#64748b",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color =
                    "#0f172a";
                  e.currentTarget.style.borderColor =
                    "#94a3b8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color =
                    "#64748b";
                  e.currentTarget.style.borderColor =
                    "#cbd5e1";
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
                  padding: "0.75rem 2rem",
                  margin: 0,
                  height: "46px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "0.94rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                  boxShadow:
                    "0 8px 20px -4px rgba(99, 102, 241, 0.45)",
                }}
              >
                <span>
                  {loading
                    ? "Searching..."
                    : "Search Publications"}
                </span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <p className="alert alert-error">
            {error}
          </p>
        )}

        {/* =====================================================
            BEFORE SEARCH
        ====================================================== */}
        {!hasSearched && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(16px)",
              borderRadius: "26px",
              border: "2px solid #818cf8",
              padding: "3.5rem 2rem",
              textAlign: "center",
              boxShadow:
                "0 15px 35px -5px rgba(79, 70, 229, 0.12)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                margin: "0 auto 1.25rem",
                boxShadow:
                  "0 8px 20px -4px rgba(6, 182, 212, 0.4)",
              }}
            >
              🔎
            </div>

            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#1e1b4b",
                margin: "0 0 0.4rem",
              }}
            >
              Ready to Search Directory
            </h3>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                maxWidth: "460px",
                margin: "0 auto 1.5rem",
                lineHeight: 1.6,
              }}
            >
              Enter paper title, conference venue, or DOI
              identifier above and click{" "}
              <strong>Search Publications</strong>.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#f8faff",
                  border: "1px solid #e0e7ff",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#4338ca",
                }}
              >
                💡 Tip: Paste a DOI for exact paper lookup
              </span>

              <span
                style={{
                  background: "#fdf4ff",
                  border: "1px solid #f5d0fe",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#86198f",
                }}
              >
                💡 Filter by Journal or Conference type
              </span>
            </div>
          </div>
        )}

        {/* =====================================================
            NO RESULTS
        ====================================================== */}
        {hasSearched &&
          !loading &&
          !error &&
          results.length === 0 && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(16px)",
                borderRadius: "26px",
                border:
                  "1.5px solid rgba(255, 255, 255, 0.8)",
                padding: "3.5rem 2rem",
                textAlign: "center",
                boxShadow:
                  "0 15px 35px -5px rgba(79, 70, 229, 0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.75rem",
                }}
              >
                📄
              </div>

              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#1e1b4b",
                  margin: "0 0 0.35rem",
                }}
              >
                No Publications Matched Your Search
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                }}
              >
                Try adjusting your keywords, selecting "All
                Types", or removing some filters.
              </p>
            </div>
          )}

        {/* =====================================================
            RESULTS
        ====================================================== */}
        {results.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.2rem",
                padding: "0 0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#1e1b4b",
                }}
              >
                Found {results.length} publication
                {results.length > 1 ? "s" : ""}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              {results.map((pub) => {
                // Backend uses uppercase statuses.
                const normalizedStatus = String(
                  pub.verificationStatus || ""
                ).toUpperCase();

                const isVerified =
                  normalizedStatus === "VERIFIED";

                const isRejected =
                  normalizedStatus === "REJECTED";

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
                      transition:
                        "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-2px)";

                      e.currentTarget.style.boxShadow =
                        "0 16px 35px -5px rgba(79, 70, 229, 0.18)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";

                      e.currentTarget.style.boxShadow =
                        "0 10px 25px -4px rgba(79, 70, 229, 0.08)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <div>
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
                              textTransform: "uppercase",
                              padding: "0.25rem 0.65rem",
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
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "0 0 0.4rem",
                          }}
                        >
                          {pub.paperTitle}
                        </h3>

                        {/* Venue */}
                        <p
                          style={{
                            margin: "0 0 0.4rem",
                            fontSize: "0.9rem",
                            color: "#475569",
                          }}
                        >
                          <strong>Venue:</strong>{" "}
                          {pub.journalConference}
                        </p>

                        {/* DOI */}
                        {pub.DOI && (
                          <p
                            style={{
                              margin: "0 0 0.5rem",
                              fontSize: "0.86rem",
                              color: "#64748b",
                            }}
                          >
                            DOI:{" "}
                            <a
                              href={
                                pub.DOI.startsWith("http")
                                  ? pub.DOI
                                  : `https://doi.org/${pub.DOI}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: "#6366f1",
                                fontWeight: 700,
                                textDecoration: "underline",
                              }}
                            >
                              {pub.DOI}
                            </a>
                          </p>
                        )}

                        {/* Faculty */}
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.84rem",
                            color: "#64748b",
                          }}
                        >
                          Submitted by:{" "}
                          <strong
                            style={{
                              color: "#334155",
                            }}
                          >
                            {pub.facultyId?.name ||
                              "Unknown Faculty"}
                          </strong>{" "}
                          {pub.facultyId?.email && (
                            <>({pub.facultyId.email})</>
                          )}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          padding: "0.4rem 0.9rem",
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        {normalizedStatus || "PENDING"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}