import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">

      <div className="logo">
        <h2>SMARTRENT-AI</h2>
      </div>

      <nav className="nav-links">
        <Link to="/tenant-dashboard">Dashboard</Link>
        <Link to="/properties">Properties</Link>
        <Link to="/tenant-wishlist">Wishlist</Link>
        <Link to="/my-appointments">Appointments</Link>
        <Link to="/tenant-messages">
    Messages
</Link>
      </nav>

      <div className="nav-right">
        <button className="notification-btn"
        onClick={() => navigate("/tenant-notifications")}>🔔</button>
        <button className="profile-btn"
        onClick={() => navigate("/tenant-profile")}>
          👤 Profile
        </button>
      </div>

    </header>
  );
}

export default Navbar;