import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin-dashboard" : "/faculty-dashboard";

  return (
    <div className="auth-shell">
      <div className="home-card home-card-enter">
        <h1>Welcome to the Research Portal</h1>
        <p>
          A record of faculty research — journals, conferences, book chapters, and
          patents — organized by department and verified by administrators.
        </p>

        {user ? (
          <Link to={dashboardPath} className="btn btn-secondary">
            Go to Dashboard
          </Link>
        ) : (
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
