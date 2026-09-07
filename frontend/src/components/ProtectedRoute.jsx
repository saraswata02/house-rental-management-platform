import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps a page and redirects to /login if the user is not logged in.
 * Optionally enforces a required role ('tenant' or 'landlord').
 */
function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Wrong role — redirect to their own dashboard
    return <Navigate to={user.role === "landlord" ? "/owner-dashboard" : "/tenant-dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
