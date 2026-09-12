import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import BookVisitModal from "../components/BookVisitModal";
import PropertyMap from "../components/PropertyMap";
import "../styles/propertyDetails.css";
import api from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
function getImageSrc(img) {
  if (!img) return null;
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userRole, setUserRole] = useState("tenant");
  const [hasBooked, setHasBooked] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role) setUserRole(user.role);

    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        
        // Fetch visits if user is tenant to check if they already booked
        if (user.role === "tenant") {
          try {
            const visitRes = await api.get("/visits/my-visits");
            const booked = visitRes.data.some(v => 
              (v.property?._id === id || v.property === id) && 
              v.status !== 'cancelled' && v.status !== 'rejected'
            );
            setHasBooked(booked);
          } catch (err) {
            console.error("Error fetching my visits:", err);
          }
        }

      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading property...</div>;
  if (!property) return <div style={{ padding: "40px", textAlign: "center" }}>Property not found.</div>;

  const resolvedMainImage = getImageSrc(selectedImage);

  return (
    <div className="property-details-page">
      {userRole === "landlord" ? <OwnerNavbar /> : <Navbar />}

      <div className="property-details-container">
        <button className="back1-btn" onClick={() => navigate(userRole === "landlord" ? "/owner-properties" : "/properties")}>
          ← Back to Properties
        </button>

        <div className="property-hero">
          <div className="property-image-section">
            {resolvedMainImage ? (
              <img src={resolvedMainImage} alt={property.title} className="property-main-image" />
            ) : (
              <div style={{
                width: "100%",
                height: "380px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#64748b"
              }}>
                <span style={{ fontSize: "52px" }}>🏠</span>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>No photos uploaded for this property</span>
              </div>
            )}
            {property.images && property.images.length > 1 && (
              <div className="image-gallery">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageSrc(img)}
                    alt="Property"
                    className={`gallery-image ${selectedImage === img ? "active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="property-basic-info">
            <h1>{property.title}</h1>
            <div className="property-rating">⭐⭐⭐⭐⭐ {property.rating}</div>
            <p className="property-location">📍 {property.location}</p>
            <h2 className="property-rent">₹ {property.rent?.toLocaleString("en-IN")}/month</h2>
            <div className="property-short-info">
              <span>🛏 {property.bhk}</span>
              <span>✅ {property.availabilityStatus === "available" ? "Available" : "Occupied"}</span>
            </div>

            <section className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </section>

            <section className="property-highlights">
              <h2>Property Highlights</h2>
              <div className="highlights-grid">
                <div className="highlight-box">🏠 <strong>Property Type</strong><span>{property.propertyType || "Apartment"}</span></div>
                <div className="highlight-box">🛏 <strong>Bedrooms</strong><span>{property.bhk}</span></div>
                <div className="highlight-box">🛁 <strong>Bathrooms</strong><span>{property.bathrooms || 1}</span></div>
                <div className="highlight-box">📅 <strong>Available</strong><span>{property.availabilityStatus === "available" ? "Immediately" : "Occupied"}</span></div>
              </div>
            </section>

            <section className="property-amenities">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                {(property.amenities || ["Parking", "Lift", "Wi-Fi", "Air Conditioning"]).map((a, i) => (
                  <div key={i} className="amenity-card">
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {userRole !== "landlord" && (
              <>
                <section className="property-map">
                  <h2>Location</h2>
                  <PropertyMap lat={property.lat} lng={property.lng} />
                  <div className="map-buttons">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="direction-btn"
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </section>

                <section className="owner-section">
                  <h2>Owner Information</h2>
                  <div className="owner-card">
                    <img
                      src={property.landlord?.profilePicture?.startsWith("/uploads") ? BACKEND_URL + property.landlord.profilePicture : property.landlord?.profilePicture || "/default-profile.png"}
                      alt="Owner"
                      className="owner-image"
                    />
                    <div className="owner-info">
                      <h3>{property.landlord?.firstName} {property.landlord?.lastName}</h3>
                      <p className="owner-badge">✔ Verified Owner</p>
                    </div>
                    <div className="owner-actions">
                      <button className="chat-btn" onClick={() => {
                        sessionStorage.setItem('chatPartnerId', property.landlord?._id);
                        navigate('/tenant-messages');
                      }}>💬 Chat</button>
                      
                      {hasBooked ? (
                        <button className="visit-btn" disabled style={{ background: "#94a3b8", cursor: "not-allowed", opacity: 0.8 }}>
                          ✅ Booked for Visit
                        </button>
                      ) : (
                        <button className="visit-btn" onClick={() => setShowBookingModal(true)}>
                          📅 Book Visit
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      <BookVisitModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        propertyId={id}
        availableDates={property.availableDates || []}
        propertyTitle={property.title}
      />
      <Footer />
    </div>
  );
}

export default PropertyDetails;