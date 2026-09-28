import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const navLinks = [
    { to: "/admin-dashboard", label: "Dashboard" },
    { to: "/manage-publications", label: "Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pubsRes = await api.get("/publications");
        const pubs = pubsRes.data;
        setStats({
          total: pubs.length,
          pending: pubs.filter((p) => p.verificationStatus === "pending").length,
          verified: pubs.filter((p) => p.verificationStatus === "verified").length,
        });
      } catch (err) {
        // Fallback silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 📊 Generate CSV Report
  const handleGenerateReport = async () => {
    setDownloadingReport(true);
    try {
      const res = await api.get("/publications");
      const pubs = res.data;

      if (!pubs || pubs.length === 0) {
        alert("No publications found to generate report.");
        return;
      }

      const headers = [
        "Title",
        "Author Name",
        "Author Email",
        "Publication Type",
        "Journal / Conference",
        "Year",
        "DOI",
        "Verification Status",
      ];

      const rows = pubs.map((p) => [
        `"${(p.paperTitle || "").replace(/"/g, '""')}"`,
        `"${(p.facultyId?.name || "N/A").replace(/"/g, '""')}"`,
        `"${(p.facultyId?.email || "N/A").replace(/"/g, '""')}"`,
        `"${(p.publicationType || "").replace(/"/g, '""')}"`,
        `"${(p.journalConference || "").replace(/"/g, '""')}"`,
        `"${p.publicationYear || ""}"`,
        `"${(p.DOI || "N/A").replace(/"/g, '""')}"`,
        `"${p.verificationStatus || ""}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `Research_Publications_Report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to generate report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)" }}>
      <Navbar links={navLinks} />

      <main style={{ maxWidth: "1140px", margin: "0 auto", padding: "2.5rem 1.5rem 4.5rem" }}>
        
        {/* Header Hero Section */}
        <div style={{ marginBottom: "2.2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#ffffff", padding: "0.35rem 0.85rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <span>🛡️</span>
            <span>Administrator Control Center</span>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", letterSpacing: "-0.03em" }}>
            Welcome back, <span style={{ background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.name || "Admin"}</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0, maxWidth: "680px" }}>
            Review faculty submissions, verify academic papers, edit or delete records, and download institutional research reports.
          </p>
        </div>

        {/* Dynamic Metric Counter Row */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            
            {/* Stat 1: Total */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #e2e8f0", boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.08)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)" }}>
                📚
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", lineHeight: 1 }}>{stats.total}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginTop: "0.25rem" }}>Total Publications</span>
              </div>
            </div>

            {/* Stat 2: Awaiting */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #fed7aa", boxShadow: "0 8px 24px -4px rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(245, 158, 11, 0.4)" }}>
                ⏳
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#78350f", lineHeight: 1 }}>{stats.pending}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#b45309", marginTop: "0.25rem" }}>Awaiting Verification</span>
              </div>
            </div>

            {/* Stat 3: Verified */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #bbf7d0", boxShadow: "0 8px 24px -4px rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.4)" }}>
                ✅
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#064e3b", lineHeight: 1 }}>{stats.verified}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#059669", marginTop: "0.25rem" }}>Verified Publications</span>
              </div>
            </div>

          </div>
        )}

        {/* 5 Distinct Colorful Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          
          {/* Card 1: View Publications (Royal Purple Theme) */}
          <Link
            to="/manage-publications?tab=all"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(99, 102, 241, 0.25)",
              boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(99, 102, 241, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(99, 102, 241, 0.12)";
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 6px 16px -2px rgba(99, 102, 241, 0.4)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1e1b4b", margin: "0 0 0.4rem" }}>
                View Publications
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Browse the complete directory of faculty research, journals, conferences, and patents.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#6366f1", fontWeight: 700, fontSize: "0.88rem" }}>
              <span>Open Directory</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 2: Verify Publications (Sunset Amber/Orange Theme) */}
          <Link
            to="/manage-publications?tab=pending"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(245, 158, 11, 0.35)",
              boxShadow: "0 10px 30px -5px rgba(245, 158, 11, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(245, 158, 11, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(245, 158, 11, 0.15)";
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px -2px rgba(245, 158, 11, 0.4)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                {stats.pending > 0 && (
                  <span style={{ background: "#fef3c7", color: "#b45309", padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 700, border: "1px solid #fde68a" }}>
                    {stats.pending} Needs Action
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#78350f", margin: "0 0 0.4rem" }}>
                Verify Publications
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Review incoming research papers awaiting validation. Mark as Verified or Rejected with 1-click.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#ea580c", fontWeight: 700, fontSize: "0.88rem" }}>
              <span>Review Submissions</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 3: Edit & Delete Records (Crimson Rose Theme) */}
          <Link
            to="/manage-publications?tab=all"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(244, 63, 94, 0.3)",
              boxShadow: "0 10px 30px -5px rgba(244, 63, 94, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(244, 63, 94, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(244, 63, 94, 0.12)";
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 6px 16px -2px rgba(244, 63, 94, 0.4)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#881337", margin: "0 0 0.4rem" }}>
                Edit & Delete Records
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Fix erroneous paper metadata, update DOI or journal names, and delete outdated entries permanently.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#e11d48", fontWeight: 700, fontSize: "0.88rem" }}>
              <span>Manage Details</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 4: Generate Reports (Emerald Mint Green Theme) */}
          <div
            onClick={handleGenerateReport}
            style={{
              cursor: "pointer",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(16, 185, 129, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(16, 185, 129, 0.14)";
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 6px 16px -2px rgba(16, 185, 129, 0.4)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#064e3b", margin: "0 0 0.4rem" }}>
                Generate Reports
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                {downloadingReport
                  ? "Exporting institutional data..."
                  : "Export institutional publication archive as Excel / CSV spreadsheet with 1-click."}
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#059669", fontWeight: 700, fontSize: "0.88rem" }}>
              <span>{downloadingReport ? "Downloading..." : "Export CSV Report"}</span>
              <span>↓</span>
            </div>
          </div>

          {/* Card 5: Search Publications (Ocean Cyan Blue Theme) */}
          <Link
            to="/search-publications"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2rem",
              border: "1.5px solid rgba(6, 182, 212, 0.35)",
              boxShadow: "0 10px 30px -5px rgba(6, 182, 212, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(6, 182, 212, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(6, 182, 212, 0.14)";
            }}
          >
            <div>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", boxShadow: "0 6px 16px -2px rgba(6, 182, 212, 0.4)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0c4a6e", margin: "0 0 0.4rem" }}>
                Search Publications
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Advanced multi-field search by Paper Title, Journal, Conference, DOI identifier, and Year.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.88rem" }}>
              <span>Search Database</span>
              <span>→</span>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}