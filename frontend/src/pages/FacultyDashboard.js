import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";


export default function FacultyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  const navLinks = [
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
        // Fail silently and keep zeros
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar links={navLinks} />
      
      <main className="dashboard-page">
        {/* Clean, open hero header */}
        <header className="hero-section">
          <span className="hero-tag">FACULTY DASHBOARD</span>
          <h1 className="hero-title">
            Welcome back, {user?.name || "Faculty Member"} <span className="wave">👋</span>
          </h1>
          <p className="hero-subtitle">
            Submit new research publications, track their verification status, or search the department's records.
          </p>
          <div className="hero-divider"></div>
        </header>

        {/* Stats Row */}
        {!loading && (
          <section className="stats-row">
            <div className="stat-card stat-purple">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Submitted</span>
            </div>
            <div className="stat-card stat-blue">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending Review</span>
            </div>
            <div className="stat-card stat-green">
              <span className="stat-value">{stats.verified}</span>
              <span className="stat-label">Verified</span>
            </div>
          </section>
        )}

        {/* Action Cards Grid */}
        <section className="action-grid">
          {/* Add Publication */}
          <Link to="/add-publication" className="action-card card-purple">
            <div className="action-card-header">
              <div className="icon-badge badge-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Add Publication</h3>
              <p className="action-card-desc">Submit a new research publication for verification.</p>
            </div>
            <div className="arrow-btn btn-purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>

          {/* My Publications */}
          <Link to="/my-publications" className="action-card card-blue">
            <div className="action-card-header">
              <div className="icon-badge badge-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">My Publications</h3>
              <p className="action-card-desc">View and track the status of your submissions.</p>
            </div>
            <div className="arrow-btn btn-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>

          {/* Search Publications */}
          <Link to="/search-publications" className="action-card card-green">
            <div className="action-card-header">
              <div className="icon-badge badge-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Search Publications</h3>
              <p className="action-card-desc">Search publications across the department.</p>
            </div>
            <div className="arrow-btn btn-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}