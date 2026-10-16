import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin-dashboard"
      : "/faculty-dashboard";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      style={{
        width: "100%",
        minHeight: "68px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
      }}
    >
      {/* Brand */}
      <Link
        to={dashboardPath}
        className="navbar-brand"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#1e3a8a",
          fontSize: "20px",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#1e3a8a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          RP
        </span>

        <span>Research Portal</span>
      </Link>

      {/* Navigation + User */}
      <div
        className="navbar-links"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "22px",
        }}
      >
        {/* Page Links */}
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="navbar-link"
            style={{
              textDecoration: "none",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "500",
              padding: "8px 4px",
              transition: "color 0.2s ease",
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* User Profile */}
        <div
          className="navbar-user-profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "18px",
            borderLeft: "1px solid #e5e7eb",
          }}
        >
          <span
            className="user-avatar"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#dbeafe",
              color: "#1e3a8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            {initials}
          </span>

          <span
            className="user-details"
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: "1.3",
            }}
          >
            <span
              className="user-name"
              style={{
                color: "#1e293b",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {user?.name}
            </span>

            <span
              className="user-role"
              style={{
                color: "#64748b",
                fontSize: "11px",
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </span>
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="navbar-logout"
          style={{
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#334155",
            borderRadius: "8px",
            padding: "9px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}