import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import BookVisitModal from "../components/BookVisitModal";
import PropertyMap from "../components/PropertyMap";
import "../styles/propertyDetails.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
        setSelectedImage(getImageSrc(data.images?.[0]));
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

  return (
    <div className="property-details-page">
      <Navbar />

      <div className="property-details-container">
        <button className="back1-btn" onClick={() => navigate("/properties")}>
          ← Back to Properties
        </button>

        <div className="property-hero">
          <div className="property-image-section">
            <img src={getImageSrc(selectedImage)} alt={property.title} className="property-main-image" />
            <div className="image-gallery">
              {(property.images || []).map((img, index) => (
                <img
                  key={index}
                  src={getImageSrc(img)}
                  alt="Property"
                  className={`gallery-image ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(getImageSrc(img))}
                />
              ))}
            </div>
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
                  <p>📞 {property.landlord?.phone || "Not available"}</p>
                </div>
                <div className="owner-actions">
                  <button className="chat-btn" onClick={() => {
                    sessionStorage.setItem('chatPartnerId', property.landlord?._id);
                    navigate('/tenant-messages');
                  }}>💬 Chat</button>
                  <button className="visit-btn" onClick={() => setShowBookingModal(true)}>
                    📅 Book Visit
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <BookVisitModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        propertyId={id}
      />
      <Footer />
    </div>
  );
}

export default PropertyDetails;