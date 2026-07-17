import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";

function OwnerNavbar() {
  const navigate = useNavigate();
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
        <button className="notification-btn"
        onClick={() => navigate("/owner-notifications")}
                     style={{cursor:"pointer"}}
        >🔔</button>
        <button className="profile-btn" onClick={() => navigate("/owner-profile")}>
          👤 Profile
        </button>
      </div>

    </header>
  );
}



export default OwnerNavbar;