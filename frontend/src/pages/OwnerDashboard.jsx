import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/ownerDashboard.css";
import OwnerSlider from "../components/OwnerSlider";
import api from "../utils/api";

const isProfileIncomplete = (user) => {
  if (!user) return true;
  const requiredFields = ["phone", "dob", "gender"];
  return requiredFields.some((field) => !user[field] || String(user[field]).trim() === "");
};

function OwnerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/analytics/owner");
        setStats({
          totalProperties: data.totalProperties || 0,
          totalViews: data.totalViews || 0,
          totalAppointments: data.totalAppointments || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleAction = (path) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (isProfileIncomplete(currentUser)) {
      setShowProfileModal(true);
      return;
    }
    navigate(path);
  };

  return (
    <div className="owner-dashboard">
      <OwnerNavbar />
      {showProfileModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            width: "min(90vw, 420px)",
            padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 24 }}>Complete your profile</h3>
            <p style={{ margin: "0 0 20px", lineHeight: 1.6 }}>
              Please complete your profile before listing properties or using owner actions.
            </p>
            <button
              onClick={() => {
                setShowProfileModal(false);
                navigate("/owner-profile");
              }}
              style={{
                background: "#1d4ed8",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}
      <OwnerSlider />

      <div className="owner-container">
        {/* Statistics */}
        <h2 className="section-title">Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <h3>{stats.totalProperties}</h3>
            <p>Total Properties</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <h3>{stats.totalViews}</h3>
            <p>Total Views</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>{stats.totalAppointments}</h3>
            <p>Appointments</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>₹{stats.monthlyRevenue.toLocaleString("en-IN")}</h3>
            <p>Monthly Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="section-title">Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card" onClick={() => handleAction("/add-property")}>
            <div className="action-icon">➕</div>
            <h3>Add Property</h3>
            <p>Post a new rental property.</p>
          </div>
          <div className="action-card" onClick={() => handleAction("/owner-properties")}>
            <div className="action-icon">🏠</div>
            <h3>My Properties</h3>
            <p>Manage all your listings.</p>
          </div>
          <div className="action-card" onClick={() => handleAction("/owner-appointments")}>
            <div className="action-icon">📅</div>
            <h3>Appointment Requests</h3>
            <p>Approve or reject bookings.</p>
          </div>
          <div className="action-card" onClick={() => handleAction("/owner-analytics")} style={{ cursor: "pointer" }}>
            <div className="action-icon">📊</div>
            <h3>Analytics</h3>
            <p>Track property performance.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OwnerDashboard;