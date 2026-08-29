import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import HeroSlider from "../components/HeroSlider";
import QuickStats from "../components/QuickStats";
import { useNavigate } from "react-router-dom";
import "../styles/tenantDashboard.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function TenantDashboard() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/properties");
        setFeatured(data.slice(0, 6));
        setRecent(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="tenant-dashboard">
      <Navbar />
      <HeroSlider />
      <QuickStats />

      <main className="dashboard-content">
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card" onClick={() => navigate("/properties")}>
              <div className="action-icon">🏠</div>
              <h3>Search Homes</h3>
              <p>Browse thousands of verified rentals.</p>
            </div>
            <div className="action-card">
              <div className="action-icon">🤖</div>
              <h3>AI Recommendation</h3>
              <p>Smart suggestions based on your needs.</p>
            </div>
            <div className="action-card" onClick={() => navigate("/tenant-wishlist")}>
              <div className="action-icon">❤️</div>
              <h3>Wishlist</h3>
              <p>Save your favourite properties.</p>
            </div>
            <div className="action-card" onClick={() => navigate("/my-appointments")}>
              <div className="action-icon">📅</div>
              <h3>Appointments</h3>
              <p>Book property visits instantly.</p>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <button className="view-all-btn" onClick={() => navigate("/properties")}>View All →</button>
          </div>
          <p className="section-subtitle">Hand-picked premium rental properties for you</p>
          <div className="property-grid">
            {loading ? (
              <p>Loading...</p>
            ) : featured.length === 0 ? (
              <p>No properties yet. <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/properties")}>Browse →</span></p>
            ) : (
              featured.map((p) => (
                <PropertyCard
                  key={p._id}
                  id={p._id}
                  image={getImageSrc(p.images?.[0])}
                  title={p.title}
                  location={p.location}
                  rent={p.rent.toLocaleString("en-IN")}
                  bhk={p.bhk}
                  rating={p.rating}
                />
              ))
            )}
          </div>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <h2>🔥 Recently Added</h2>
            <button className="view-all-btn" onClick={() => navigate("/properties")}>View All →</button>
          </div>
          <p className="section-subtitle">Fresh rental properties added by verified owners.</p>
          <div className="property-grid">
            {loading ? (
              <p>Loading...</p>
            ) : (
              recent.map((p) => (
                <PropertyCard
                  key={p._id}
                  id={p._id}
                  image={getImageSrc(p.images?.[0])}
                  title={p.title}
                  location={p.location}
                  rent={p.rent.toLocaleString("en-IN")}
                  bhk={p.bhk}
                  rating={p.rating}
                />
              ))
            )}
          </div>
        </section>

        <section className="why-section">
          <h2>Why Choose SmartRent-AI?</h2>
          <p className="why-subtitle">Experience a smarter and safer way to find your perfect rental home.</p>
          <div className="why-grid">
            <div className="why-card"><div className="why-icon">🤖</div><h3>AI Recommendations</h3><p>Get personalized rental suggestions based on your preferences.</p></div>
            <div className="why-card"><div className="why-icon">✔️</div><h3>Verified Owners</h3><p>Every property owner is verified for a secure rental experience.</p></div>
            <div className="why-card"><div className="why-icon">📅</div><h3>Easy Appointment</h3><p>Schedule property visits instantly with just one click.</p></div>
            <div className="why-card"><div className="why-icon">🔒</div><h3>Secure Platform</h3><p>Your personal information is protected with secure authentication.</p></div>
            <div className="why-card"><div className="why-icon">📍</div><h3>Smart Location</h3><p>Explore nearby schools, hospitals, markets and transport.</p></div>
            <div className="why-card"><div className="why-icon">⚡</div><h3>Fast Search</h3><p>Find your ideal rental quickly using powerful search filters.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TenantDashboard;