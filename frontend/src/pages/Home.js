import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin-dashboard" : "/faculty-dashboard";

  return (
    <div className="auth-shell" style={{ padding: "2rem 1.5rem" }}>
      <div
        className="home-card-enter"
        style={{
          width: "100%",
          maxWidth: "940px",
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          borderRadius: "28px",
          border: "1px solid rgba(226, 232, 240, 0.9)",
          boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25), 0 0 1px 1px rgba(255, 255, 255, 0.8) inset",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          minHeight: "480px",
        }}
      >
        {/* Left Side: Research Graphic */}
        <div
          style={{
            flex: "1 1 45%",
            position: "relative",
            minHeight: "360px",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            overflow: "hidden",
          }}
        >
          <img
            src="/research-hero.jpg"
            alt="Research Discovery & Knowledge"
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "420px",
              objectFit: "cover",
              borderRadius: "20px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.12)",
            }}
          />
          {/* Subtle Tag Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "2.2rem",
              left: "2.2rem",
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              fontSize: "0.76rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
            <span>Faculty Research & Publications</span>
          </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div
          style={{
            flex: "1 1 55%",
            padding: "3.2rem 2.8rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Institution Header Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#6366f1",
                textTransform: "uppercase",
                background: "#eef2ff",
                padding: "0.3rem 0.75rem",
                borderRadius: "8px",
              }}
            >
              Academic Portal
            </span>
          </div>

          {/* Single-Line Title */}
          <h1
            style={{
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              margin: "0 0 1rem",
              whiteSpace: "nowrap",
            }}
          >
            Welcome to the Research Portal
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "0.93rem",
              color: "#64748b",
              lineHeight: 1.6,
              margin: "0 0 1.6rem",
            }}
          >
            A centralized platform to record, verify, and showcase faculty research — covering journals, conferences, book chapters, and patents organized by department.
          </p>

          {/* Highlights */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.86rem", color: "#334155", fontWeight: 500 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>✓</div>
              <span>Peer-reviewed journals & conference papers tracking</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.86rem", color: "#334155", fontWeight: 500 }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>✓</div>
              <span>Department-wise verified research analytics</span>
            </div>
          </div>

          {/* Actions */}
          {user ? (
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>
                Signed in as <strong style={{ color: "#0f172a" }}>{user.name}</strong> ({user.role})
              </p>
              <Link
                to={dashboardPath}
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1.8rem",
                  fontSize: "0.95rem",
                  width: "auto",
                  margin: 0,
                }}
              >
                <span>Go to Dashboard</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Primary Login Button */}
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 2rem",
                  fontSize: "0.95rem",
                  width: "auto",
                  margin: 0,
                  borderRadius: "14px",
                  boxShadow: "0 8px 20px -4px rgba(99, 102, 241, 0.45)",
                }}
              >
                <span>Sign In</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
              </Link>

              {/* Secondary Register Button */}
              <Link
                to="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1.8rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#334155",
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "14px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.color = "#6366f1";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}