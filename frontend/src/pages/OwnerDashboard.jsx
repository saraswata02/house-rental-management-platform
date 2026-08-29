import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/ownerDashboard.css";
import OwnerSlider from "../components/OwnerSlider";
import api from "../utils/api";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
  });

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

  return (
    <div className="owner-dashboard">
      <OwnerNavbar />
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
          <div className="action-card" onClick={() => navigate("/add-property")}>
            <div className="action-icon">➕</div>
            <h3>Add Property</h3>
            <p>Post a new rental property.</p>
          </div>
          <div className="action-card" onClick={() => navigate("/owner-properties")}>
            <div className="action-icon">🏠</div>
            <h3>My Properties</h3>
            <p>Manage all your listings.</p>
          </div>
          <div className="action-card" onClick={() => navigate("/owner-appointments")}>
            <div className="action-icon">📅</div>
            <h3>Appointment Requests</h3>
            <p>Approve or reject bookings.</p>
          </div>
          <div className="action-card" onClick={() => navigate("/owner-analytics")} style={{ cursor: "pointer" }}>
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