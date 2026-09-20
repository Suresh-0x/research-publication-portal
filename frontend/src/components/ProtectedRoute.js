import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page with this to require login.
// Pass allowedRole="admin" or allowedRole="faculty" to restrict by role too.
export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
