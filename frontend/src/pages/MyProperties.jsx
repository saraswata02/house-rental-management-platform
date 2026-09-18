import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/myProperties.css";
import api from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
function getImageSrc(img) {
  if (!img) return null;
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

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
      alert("You removed the property from your dashboard.");
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
            properties.map((p) => {
              const cardImg = getImageSrc(p.images?.[0]);
              return (
              <div className="owner-property-card" key={p._id} style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1 }}>
                  <button
                    type="button"
                    aria-label={`More options for ${p.title}`}
                    onClick={() => setOpenMenuId(openMenuId === p._id ? null : p._id)}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "50%",
                      width: "34px",
                      height: "34px",
                      fontSize: "20px",
                      lineHeight: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ⋯
                  </button>
                  {openMenuId === p._id && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        handleDelete(p._id);
                      }}
                      style={{
                        display: "block",
                        marginTop: "6px",
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        color: "#991b1b",
                        padding: "7px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {cardImg ? (
                  <img
                    src={cardImg}
                    alt={p.title}
                  />
                ) : (
                  <div style={{
                    width: "160px",
                    height: "120px",
                    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: "12px",
                    flexShrink: 0,
                    gap: "4px"
                  }}>
                    <span style={{ fontSize: "24px" }}>🏠</span>
                    <span>No photo</span>
                  </div>
                )}
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
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProperties;