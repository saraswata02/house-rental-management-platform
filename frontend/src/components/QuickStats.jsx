import "../styles/quickStats.css";

function QuickStats() {
  return (
    <section className="quick-stats">

      <h2>Platform Highlights</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <h3>2,500+</h3>
          <p>Verified Properties</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <h3>30+</h3>
          <p>Cities Covered</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍👩‍👧</div>
          <h3>8,000+</h3>
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