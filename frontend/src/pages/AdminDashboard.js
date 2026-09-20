import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";


export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, departments: 0 });
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { to: "/manage-publications", label: "Publications" },
    { to: "/manage-departments", label: "Departments" },
    { to: "/search-publications", label: "Search" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pubsRes, deptsRes] = await Promise.all([
          api.get("/publications"),
          api.get("/departments"),
        ]);
        setStats({
          total: pubsRes.data.length,
          pending: pubsRes.data.filter((p) => p.verificationStatus === "pending").length,
          departments: deptsRes.data.length,
        });
      } catch (err) {
        // Fallback silently to initial state
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
        {/* Admin Clean Hero */}
        <header className="hero-section">
          <span className="hero-tag">ADMINISTRATOR PORTAL</span>
          <h1 className="hero-title">
            Welcome back, {user?.name || "Admin"} <span className="wave">🛡️</span>
          </h1>
          <p className="hero-subtitle">
            Verify or reject faculty submissions, manage departmental records, and search across
            all publications.
          </p>
          <div className="hero-divider"></div>
        </header>

        {/* Dynamic Metric Counter Row */}
        {!loading && (
          <section className="stats-row">
            <div className="stat-card stat-purple">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Publications</span>
            </div>
            <div className="stat-card stat-amber">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Awaiting Review</span>
            </div>
            <div className="stat-card stat-blue">
              <span className="stat-value">{stats.departments}</span>
              <span className="stat-label">Departments</span>
            </div>
          </section>
        )}

        {/* Action Cards Grid */}
        <section className="action-grid">
          {/* Manage Publications */}
          <Link to="/manage-publications" className="action-card card-purple">
            <div className="action-card-header">
              <div className="icon-badge badge-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Manage Publications</h3>
              <p className="action-card-desc">Verify, reject, or delete submitted research papers.</p>
            </div>
            <div className="arrow-btn btn-purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>

          {/* Manage Departments */}
          <Link to="/manage-departments" className="action-card card-blue">
            <div className="action-card-header">
              <div className="icon-badge badge-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="9" y1="22" x2="9" y2="22.01"></line>
                  <line x1="15" y1="22" x2="15" y2="22.01"></line>
                  <line x1="9" y1="6" x2="9" y2="6.01"></line>
                  <line x1="15" y1="6" x2="15" y2="6.01"></line>
                  <line x1="9" y1="10" x2="9" y2="10.01"></line>
                  <line x1="15" y1="10" x2="15" y2="10.01"></line>
                  <line x1="9" y1="14" x2="9" y2="14.01"></line>
                  <line x1="15" y1="14" x2="15" y2="14.01"></line>
                </svg>
              </div>
            </div>
            <div className="action-card-content">
              <h3 className="action-card-title">Manage Departments</h3>
              <p className="action-card-desc">Add, edit, or configure department records and branches.</p>
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
              <p className="action-card-desc">Browse records across all departments.</p>
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