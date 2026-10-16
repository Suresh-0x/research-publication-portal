import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
  });

  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Admin navigation
  const navLinks = [
    { to: "/admin-dashboard", label: "Dashboard" },
    { to: "/manage-publications", label: "Publications" },
    { to: "/search-publications", label: "Search Publications" },
    { to: "/manage-departments", label: "Departments" },
  ];

  // Normalize API response
  const getPublicationArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.publications)) {
      return data.publications;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  // Fetch dashboard statistics
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const statsRes = await api.get("/publications/stats");

        if (isMounted && statsRes.data) {
          setStats({
            total: Number(statsRes.data.total ?? 0),
            pending: Number(statsRes.data.pending ?? 0),
            verified: Number(statsRes.data.verified ?? 0),
          });
        }
      } catch (err) {
        console.error("Failed to fetch publication stats:", err);

        // Fallback
        try {
          const pubsRes = await api.get("/publications");

          const pubs = getPublicationArray(pubsRes.data);

          if (isMounted) {
            setStats({
              total: pubs.length,
              pending: pubs.filter(
                (p) => p.verificationStatus === "PENDING"
              ).length,
              verified: pubs.filter(
                (p) => p.verificationStatus === "VERIFIED"
              ).length,
            });
          }
        } catch (fallbackErr) {
          console.error("Failed to fetch publications:", fallbackErr);

          if (isMounted) {
            setStats({
              total: 0,
              pending: 0,
              verified: 0,
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate CSV Report
  const handleGenerateReport = async () => {
    setDownloadingReport(true);

    try {
      const res = await api.get("/publications");

      const pubs = getPublicationArray(res.data);

      if (pubs.length === 0) {
        alert("No publications found to generate report.");
        return;
      }

      const headers = [
        "Title",
        "Author Name",
        "Author Email",
        "Department",
        "Publication Type",
        "Journal / Conference",
        "Year",
        "DOI",
        "Verification Status",
      ];

      const rows = pubs.map((p) => [
        `"${String(p.paperTitle || "").replace(/"/g, '""')}"`,
        `"${String(p.facultyId?.name || "N/A").replace(/"/g, '""')}"`,
        `"${String(p.facultyId?.email || "N/A").replace(/"/g, '""')}"`,
        `"${String(
          p.facultyId?.department?.departmentName ||
            p.department?.departmentName ||
            "N/A"
        ).replace(/"/g, '""')}"`,
        `"${String(p.publicationType || "").replace(/"/g, '""')}"`,
        `"${String(p.journalConference || "").replace(/"/g, '""')}"`,
        `"${p.publicationYear || ""}"`,
        `"${String(p.DOI || "N/A").replace(/"/g, '""')}"`,
        `"${String(p.verificationStatus || "").replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);

      const link = document.createElement("a");

      link.setAttribute("href", encodedUri);

      link.setAttribute(
        "download",
        `Research_Publications_Report_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Report generation error:", err);
      alert("Failed to generate report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)",
      }}
    >
      {/* Navbar */}
      <Navbar links={navLinks} />

      <main
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 4.5rem",
        }}
      >
        {/* Header Hero Section */}
        <div style={{ marginBottom: "2.2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            <span>🛡️</span>
            <span>Administrator Control Center</span>
          </div>

          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 0.5rem",
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back,{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {user?.name || "Admin"}
            </span>
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#64748b",
              margin: 0,
              maxWidth: "680px",
            }}
          >
            Review faculty submissions, verify academic papers, edit or delete
            records, manage departments, search publications, and download
            institutional research reports.
          </p>
        </div>

        {/* Statistics */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            {/* Total */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.5rem 1.8rem",
                border: "1.5px solid #e2e8f0",
                boxShadow:
                  "0 8px 24px -4px rgba(99, 102, 241, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  boxShadow:
                    "0 8px 16px -4px rgba(99, 102, 241, 0.4)",
                }}
              >
                📚
              </div>

              <div>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#1e1b4b",
                    lineHeight: 1,
                  }}
                >
                  {stats.total}
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#64748b",
                    marginTop: "0.25rem",
                  }}
                >
                  Total Publications
                </span>
              </div>
            </div>

            {/* Pending */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.5rem 1.8rem",
                border: "1.5px solid #fed7aa",
                boxShadow:
                  "0 8px 24px -4px rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  boxShadow:
                    "0 8px 16px -4px rgba(245, 158, 11, 0.4)",
                }}
              >
                ⏳
              </div>

              <div>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#78350f",
                    lineHeight: 1,
                  }}
                >
                  {stats.pending}
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#b45309",
                    marginTop: "0.25rem",
                  }}
                >
                  Awaiting Verification
                </span>
              </div>
            </div>

            {/* Verified */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "1.5rem 1.8rem",
                border: "1.5px solid #bbf7d0",
                boxShadow:
                  "0 8px 24px -4px rgba(16, 185, 129, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  boxShadow:
                    "0 8px 16px -4px rgba(16, 185, 129, 0.4)",
                }}
              >
                ✅
              </div>

              <div>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#064e3b",
                    lineHeight: 1,
                  }}
                >
                  {stats.verified}
                </span>

                <span
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#059669",
                    marginTop: "0.25rem",
                  }}
                >
                  Verified Publications
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Card 1 - View Publications */}
          <Link
            to="/manage-publications?tab=all"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(99, 102, 241, 0.25)",
              boxShadow:
                "0 10px 30px -5px rgba(99, 102, 241, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(99, 102, 241, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(99, 102, 241, 0.12)";
            }}
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow:
                    "0 6px 16px -2px rgba(99, 102, 241, 0.4)",
                }}
              >
                📄
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1e1b4b",
                  margin: "0 0 0.4rem",
                }}
              >
                View Publications
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Browse the complete directory of faculty research, journals,
                conferences, and patents.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>Open Directory</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 2 - Verify Publications */}
          <Link
            to="/manage-publications?tab=pending"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(245, 158, 11, 0.35)",
              boxShadow:
                "0 10px 30px -5px rgba(245, 158, 11, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(245, 158, 11, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(245, 158, 11, 0.15)";
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 6px 16px -2px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  ✓
                </div>

                {stats.pending > 0 && (
                  <span
                    style={{
                      background: "#fef3c7",
                      color: "#b45309",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      border: "1px solid #fde68a",
                    }}
                  >
                    {stats.pending} Needs Action
                  </span>
                )}
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#78350f",
                  margin: "0 0 0.4rem",
                }}
              >
                Verify Publications
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Review incoming research papers awaiting validation. Mark
                submissions as Verified or Rejected.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#ea580c",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>Review Submissions</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 3 - Edit & Delete */}
          <Link
            to="/manage-publications?tab=all"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(244, 63, 94, 0.3)",
              boxShadow:
                "0 10px 30px -5px rgba(244, 63, 94, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(244, 63, 94, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(244, 63, 94, 0.12)";
            }}
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow:
                    "0 6px 16px -2px rgba(244, 63, 94, 0.4)",
                }}
              >
                ✎
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#881337",
                  margin: "0 0 0.4rem",
                }}
              >
                Edit & Delete Records
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Fix erroneous paper metadata, update DOI or journal names,
                and delete outdated entries permanently.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#e11d48",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>Manage Details</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 4 - Generate Reports */}
          <div
            onClick={handleGenerateReport}
            style={{
              cursor: "pointer",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              boxShadow:
                "0 10px 30px -5px rgba(16, 185, 129, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(16, 185, 129, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(16, 185, 129, 0.14)";
            }}
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow:
                    "0 6px 16px -2px rgba(16, 185, 129, 0.4)",
                }}
              >
                ↓
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#064e3b",
                  margin: "0 0 0.4rem",
                }}
              >
                Generate Reports
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {downloadingReport
                  ? "Exporting institutional data..."
                  : "Export institutional publication archive as CSV spreadsheet with 1-click."}
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#059669",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>
                {downloadingReport
                  ? "Downloading..."
                  : "Export CSV Report"}
              </span>

              <span>↓</span>
            </div>
          </div>

          {/* Card 5 - Search Publications */}
          <Link
            to="/search-publications"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(139, 92, 246, 0.35)",
              boxShadow:
                "0 10px 30px -5px rgba(139, 92, 246, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(139, 92, 246, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(139, 92, 246, 0.14)";
            }}
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow:
                    "0 6px 16px -2px rgba(139, 92, 246, 0.4)",
                }}
              >
                🔍
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#4c1d95",
                  margin: "0 0 0.4rem",
                }}
              >
                Search Publications
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Quickly search research publications by title, faculty,
                department, year, type, or other available filters.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#7c3aed",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>Search Publications</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 6 - Manage Departments */}
          <Link
            to="/manage-departments"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(59, 130, 246, 0.35)",
              boxShadow:
                "0 10px 30px -5px rgba(59, 130, 246, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 18px 35px -5px rgba(59, 130, 246, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px -5px rgba(59, 130, 246, 0.14)";
            }}
          >
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow:
                    "0 6px 16px -2px rgba(59, 130, 246, 0.4)",
                }}
              >
                🏢
              </div>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1e3a8a",
                  margin: "0 0 0.4rem",
                }}
              >
                Manage Departments
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                View departments, HOD details, faculty counts, and manage
                department information.
              </p>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: "0.88rem",
              }}
            >
              <span>Manage Departments</span>
              <span>→</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}