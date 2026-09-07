import { useEffect, useState } from "react";
import "../styles/quickStats.css";
import api from "../utils/api";

function QuickStats() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalCities: 0,
    totalTenants: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/analytics/system-stats");
        setStats({
          totalProperties: data.totalProperties || 0,
          totalCities: data.totalCities || 0,
          totalTenants: data.totalTenants || 0,
        });
      } catch (err) {
        // Silently fail — the component will show 0s
        console.error("QuickStats fetch error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="quick-stats">
      <h2>Platform Highlights</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <h3>{stats.totalProperties}+</h3>
          <p>Verified Properties</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <h3>{stats.totalCities}+</h3>
          <p>Cities Covered</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍👩‍👧</div>
          <h3>{stats.totalTenants}+</h3>
          <p>Happy Tenants</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <h3>AI Powered</h3>
          <p>Smart Recommendations</p>
        </div>
      </div>
    </section>
  );
}

export default QuickStats;