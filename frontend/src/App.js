import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import FacultyDashboard from "./pages/FacultyDashboard";
import AddPublication from "./pages/AddPublication";
import MyPublications from "./pages/MyPublications";
import SearchPublications from "./pages/SearchPublications";
import AdminDashboard from "./pages/AdminDashboard";
import ManagePublications from "./pages/ManagePublications";
import ManageDepartments from "./pages/ManageDepartments";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Faculty-only pages */}
          <Route
            path="/faculty-dashboard"
            element={
              <ProtectedRoute allowedRole="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-publication"
            element={
              <ProtectedRoute allowedRole="faculty">
                <AddPublication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-publications"
            element={
              <ProtectedRoute allowedRole="faculty">
                <MyPublications />
              </ProtectedRoute>
            }
          />

          {/* Available to any logged-in user */}
          <Route
            path="/search-publications"
            element={
              <ProtectedRoute>
                <SearchPublications />
              </ProtectedRoute>
            }
          />

          {/* Admin-only pages */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-publications"
            element={
              <ProtectedRoute allowedRole="admin">
                <ManagePublications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-departments"
            element={
              <ProtectedRoute allowedRole="admin">
                <ManageDepartments />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;