import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerAnalytics.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function OwnerAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/analytics/owner");
        setStats(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ padding: "40px" }}>Loading analytics...</div>;

  return (
    <div className="analytics-page">
      <OwnerNavbar />
      <div className="analytics-container">
        <h1>Analytics Dashboard</h1>

        <div className="analytics-cards">
          <div className="analytics-card">
            <h2>{stats?.totalProperties || 0}</h2>
            <p>Total Properties</p>
          </div>
          <div className="analytics-card">
            <h2>{stats?.totalViews || 0}</h2>
            <p>Total Views</p>
          </div>
          <div className="analytics-card">
            <h2>{stats?.totalAppointments || 0}</h2>
            <p>Appointments</p>
          </div>
          <div className="analytics-card">
            <h2>₹{(stats?.monthlyRevenue || 0).toLocaleString("en-IN")}</h2>
            <p>Monthly Revenue</p>
          </div>
        </div>

        <div className="chart-card">
          <h2>Monthly Property Views</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bottom-grid">
          {stats?.mostViewed && (
            <div className="top-property">
              <h2>Most Viewed Property</h2>
              <img src={getImageSrc(stats.mostViewed.images?.[0])} alt="House" />
              <h3>{stats.mostViewed.title}</h3>
              <p>👁 {stats.mostViewed.views} Views</p>
            </div>
          )}

          <div className="recent-activity">
            <h2>Recent Activities</h2>
            <ul>
              {(stats?.recentActivity || []).map((item, i) => (
                <li key={i}>✔ {item.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OwnerAnalytics;