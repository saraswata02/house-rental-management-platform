import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function OwnerNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("wishlistIds");
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="logo">
        <h2>SMARTRENT-AI</h2>
      </div>

      <nav className="nav-links">
        <Link to="/owner-dashboard">Dashboard</Link>
        <Link to="/owner-properties">Properties</Link>
        <Link to="/owner-appointments">Appointments</Link>
        <Link to="/owner-analytics">Analytics</Link>
        <Link to="/owner-messages">Messages</Link>
      </nav>

      <div className="nav-right">
        <button className="notification-btn" onClick={() => navigate("/owner-notifications")} style={{ cursor: "pointer" }}>🔔</button>
        <button className="profile-btn" onClick={() => navigate("/owner-profile")}>
          👤 Profile
        </button>
        <button className="logout-btn" onClick={handleLogout} style={{ background: "transparent", border: "1px solid #e53e3e", color: "#e53e3e", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", marginLeft: "8px" }}>
          Logout
        </button>
      </div>

    </header>
  );
}

export default OwnerNavbar;