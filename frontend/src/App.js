import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Eagerly loaded critical landing / auth pages for instant first paint
import Home from "./pages/Home";
import Login from "./pages/Login";

// Code-split secondary pages
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard"));
const AddPublication = lazy(() => import("./pages/AddPublication"));
const MyPublications = lazy(() => import("./pages/MyPublications"));
const SearchPublications = lazy(() => import("./pages/SearchPublications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ManagePublications = lazy(() => import("./pages/ManagePublications"));
const ManageDepartments = lazy(() => import("./pages/ManageDepartments"));

// Minimal lightweight loader for suspense fallback
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          border: "3.5px solid #e0e7ff",
          borderTop: "3.5px solid #6366f1",
          borderRadius: "50%",
          animation: "appSpin 0.75s linear infinite",
        }}
      />
      <style>{`@keyframes appSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;