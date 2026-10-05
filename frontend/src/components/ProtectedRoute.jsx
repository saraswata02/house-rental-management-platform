import { Navigate, useLocation, useNavigate } from "react-router-dom";

const isProfileIncomplete = (user) => {
  if (!user) return false;

  const requiredFields = ["phone", "dob", "gender"];
  const missingRequired = requiredFields.some((field) => !user[field] || String(user[field]).trim() === "");

  const hasRole = Boolean(user.role && ["tenant", "landlord"].includes(user.role));

  return missingRequired || !hasRole;
};

/**
 * ProtectedRoute — wraps a page and redirects to /login if the user is not logged in.
 * Optionally enforces a required role ('tenant' or 'landlord').
 */
function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Wrong role — redirect to their own dashboard
    return <Navigate to={user.role === "landlord" ? "/owner-dashboard" : "/tenant-dashboard"} replace />;
  }

  const isProfilePage = /\/tenant-profile$|\/owner-profile$/.test(location.pathname);
  const isRoleSelectionPage = location.pathname === "/role-selection";

  if (!isProfilePage && !isRoleSelectionPage && isProfileIncomplete(user)) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          width: "min(90vw, 420px)",
          padding: "28px 24px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          textAlign: "center",
          color: "#1f2937",
        }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "24px" }}>Complete your profile</h3>
          <p style={{ margin: "0 0 20px", lineHeight: 1.6 }}>
            Please complete your profile before using the app. Add your role details and personal information to continue.
          </p>
          <button
            onClick={() => navigate(user.role === "landlord" ? "/owner-profile" : "/tenant-profile")}
            style={{
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
