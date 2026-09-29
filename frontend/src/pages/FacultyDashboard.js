import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  // Clean navbar with Dashboard link
  const navLinks = [
    { to: "/faculty-dashboard", label: "Dashboard" },
    { to: "/add-publication", label: "Add Publication" },
    { to: "/my-publications", label: "My Publications" },
    { to: "/search-publications", label: "Search" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/publications?mine=true");
        const pubs = response.data;
        setStats({
          total: pubs.length,
          pending: pubs.filter((p) => p.verificationStatus === "pending").length,
          verified: pubs.filter((p) => p.verificationStatus === "verified").length,
        });
      } catch (err) {
        // Fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)" }}>
      <Navbar links={navLinks} />

      <main style={{ maxWidth: "1140px", margin: "0 auto", padding: "2.5rem 1.5rem 4.5rem" }}>
        
        {/* Hero Header Section */}
        <div style={{ marginBottom: "2.2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
            <span>🎓</span>
            <span>Faculty Research Workspace</span>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", letterSpacing: "-0.03em" }}>
            Welcome back,{" "}
            <span style={{ background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {user?.name || "Faculty Member"}
            </span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0, maxWidth: "680px" }}>
            Submit new research papers, track your verification history in real-time, or explore institutional publications across departments.
          </p>
        </div>

        {/* Dynamic Metric Counter Row */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            
            {/* Stat 1: Total Submitted */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #e2e8f0", boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.08)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.4)" }}>
                📚
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#1e1b4b", lineHeight: 1 }}>{stats.total}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#64748b", marginTop: "0.25rem" }}>Total Submitted</span>
              </div>
            </div>

            {/* Stat 2: Pending Review */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #fed7aa", boxShadow: "0 8px 24px -4px rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(245, 158, 11, 0.4)" }}>
                ⏳
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#78350f", lineHeight: 1 }}>{stats.pending}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#b45309", marginTop: "0.25rem" }}>Pending Review</span>
              </div>
            </div>

            {/* Stat 3: Verified */}
            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "1.5rem 1.8rem", border: "1.5px solid #bbf7d0", boxShadow: "0 8px 24px -4px rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.4)" }}>
                ✅
              </div>
              <div>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#064e3b", lineHeight: 1 }}>{stats.verified}</span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#059669", marginTop: "0.25rem" }}>Verified Papers</span>
              </div>
            </div>

          </div>
        )}

        {/* 3 Large, Distinct Colorful Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          
          {/* Card 1: Add Publication (Royal Purple & Indigo Theme) */}
          <Link
            to="/add-publication"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2.2rem 2rem",
              border: "1.5px solid rgba(99, 102, 241, 0.3)",
              boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.12)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "200px",
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
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px -3px rgba(99, 102, 241, 0.4)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1e1b4b", margin: "0 0 0.4rem" }}>
                Add Publication
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Submit a new research paper, journal article, conference proceeding, or patent for admin verification.
              </p>
            </div>
            <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#6366f1", fontWeight: 700, fontSize: "0.9rem" }}>
              <span>Submit New Paper</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 2: My Publications (Ocean Cyan & Blue Theme) */}
          <Link
            to="/my-publications"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2.2rem 2rem",
              border: "1.5px solid rgba(6, 182, 212, 0.35)",
              boxShadow: "0 10px 30px -5px rgba(6, 182, 212, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "200px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 18px 35px -5px rgba(6, 182, 212, 0.28)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(6, 182, 212, 0.15)";
            }}
          >
            <div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px -3px rgba(6, 182, 212, 0.4)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0c4a6e", margin: "0 0 0.4rem" }}>
                My Publications & History
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                View your complete publication history, track verification progress, and edit or update submitted details.
              </p>
            </div>
            <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.9rem" }}>
              <span>View History & Status</span>
              <span>→</span>
            </div>
          </Link>

          {/* Card 3: Search Publications (Emerald Mint Green Theme) */}
          <Link
            to="/search-publications"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "2.2rem 2rem",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.14)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "200px",
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
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 8px 18px -3px rgba(16, 185, 129, 0.4)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#064e3b", margin: "0 0 0.4rem" }}>
                Search Directory
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Search and explore papers across the institution using title, conference venue, year, or DOI identifier.
              </p>
            </div>
            <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#059669", fontWeight: 700, fontSize: "0.9rem" }}>
              <span>Search Database</span>
              <span>→</span>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}