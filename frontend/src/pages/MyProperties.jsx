import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/myProperties.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/properties/owner/mine");
        setProperties(data);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div className="my-properties-page">
      <OwnerNavbar />
      <div className="my-properties-container">
        <div className="page-header">
          <h1>My Properties</h1>
          <button className="add-property-btn" onClick={() => navigate("/add-property")}>
            + Add Property
          </button>
        </div>

        <div className="property-list">
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p>No properties listed yet. <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/add-property")}>Add one now →</span></p>
          ) : (
            properties.map((p) => (
              <div className="owner-property-card" key={p._id}>
                <img
                  src={getImageSrc(p.images?.[0])}
                  alt="House"
                />
                <div className="property-details">
                  <h2>{p.title}</h2>
                  <p>📍 {p.location}</p>
                  <h3>₹{p.rent?.toLocaleString("en-IN")} / month</h3>
                  <div className="property-stats">
                    <span className={p.availabilityStatus === "available" ? "active" : ""}>
                      {p.availabilityStatus === "available" ? "✅ Active" : "🔴 Occupied"}
                    </span>
                  </div>
                </div>
                <div className="property-actions">
                  <button className="view-btn" onClick={() => navigate(`/property/${p._id}`)}>View</button>
                  <button className="edit-btn" onClick={() => navigate(`/edit-property/${p._id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProperties;