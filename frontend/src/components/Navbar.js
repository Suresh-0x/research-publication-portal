import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ links = [] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user?.role === "admin" ? "/admin-dashboard" : "/faculty-dashboard";

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
    <nav className="navbar">
      <Link to={dashboardPath} className="navbar-brand">
        🎓 Research Portal
      </Link>
      <div className="navbar-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="navbar-link">
            {link.label}
          </Link>
        ))}
        <div className="navbar-user-profile">
          <span className="user-avatar">{initials}</span>
          <span className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </span>
        </div>
        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
