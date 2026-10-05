import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import HeroSlider from "../components/HeroSlider";
import QuickStats from "../components/QuickStats";
import { useNavigate } from "react-router-dom";
import "../styles/tenantDashboard.css";
import api from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
function getImageSrc(img) {
  if (!img) return null;
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

const isProfileIncomplete = (user) => {
  return !user?.profileCompleted;
};

function TenantDashboard() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/properties");
        setFeatured(data.slice(0, 6));
        setRecent(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAction = async (path) => {
    try {
      const { data: currentUser } = await api.get("/users/profile");
      const cachedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (cachedUser) {
        localStorage.setItem("user", JSON.stringify({ ...cachedUser, ...currentUser }));
      }
      if (isProfileIncomplete(currentUser)) {
        setShowProfileModal(true);
        return;
      }
      navigate(path);
    } catch (error) {
      console.error("Unable to verify tenant profile:", error);
      window.alert("Unable to verify your profile. Please check your connection and try again.");
    }
  };

  return (
    <div className="tenant-dashboard">
      <Navbar />
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
              Please complete your profile before searching homes or using tenant actions.
            </p>
            <button
              onClick={() => {
                setShowProfileModal(false);
                navigate("/tenant-profile");
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
      <HeroSlider />
      <QuickStats />

      <main className="dashboard-content">
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card" onClick={() => handleAction("/properties")}>
              <div className="action-icon">🏠</div>
              <h3>Search Homes</h3>
              <p>Browse thousands of verified rentals.</p>
            </div>
            <div className="action-card" onClick={() => handleAction("/properties")}>
              <div className="action-icon">🤖</div>
              <h3>AI Recommendation</h3>
              <p>Smart suggestions based on your needs.</p>
            </div>
            <div className="action-card" onClick={() => handleAction("/tenant-wishlist")}>
              <div className="action-icon">❤️</div>
              <h3>Wishlist</h3>
              <p>Save your favourite properties.</p>
            </div>
            <div className="action-card" onClick={() => handleAction("/my-appointments")}>
              <div className="action-icon">📅</div>
              <h3>Appointments</h3>
              <p>Book property visits instantly.</p>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <button className="view-all-btn" onClick={() => handleAction("/properties")}>View All →</button>
          </div>
          <p className="section-subtitle">Hand-picked premium rental properties for you</p>
          <div className="property-grid">
            {loading ? (
              <p>Loading...</p>
            ) : featured.length === 0 ? (
              <p>No properties yet. <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => handleAction("/properties")}>Browse →</span></p>
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
            <button className="view-all-btn" onClick={() => handleAction("/properties")}>View All →</button>
          </div>
          <p className="section-subtitle">Fresh rental properties added by verified owners.</p>
          <div className="property-grid">
            {loading ? (
              <p>Loading...</p>
            ) : recent.length === 0 ? (
              <p>No properties added recently.</p>
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
            <div className="why-card"><div className="why-icon">⚡</div><h3>Fast Search</h3><p>Find your ideal rental quickly using powerful search filters.</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TenantDashboard;