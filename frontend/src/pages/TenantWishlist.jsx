import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantWishlist.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";

function getImageSrc(img) {
    if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
    if (img.startsWith("/uploads")) return BACKEND_URL + img;
    return img;
}

function TenantWishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await api.get("/users/profile");
                // 'wishlist' is an array of populated property objects
                setWishlist(data.wishlist || []);
            } catch (err) {
                console.error("Error loading wishlist:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (propertyId) => {
        try {
            await api.delete(`/users/wishlist/${propertyId}`);
            setWishlist(wishlist.filter((p) => p._id !== propertyId));
        } catch {
            alert("Failed to remove. Please try again.");
        }
    };

    return (
        <div className="tenant-wishlist-page">
            <Navbar />

            <div className="wishlist-container">
                <h1>My Wishlist</h1>

                {loading ? (
                    <p>Loading wishlist...</p>
                ) : wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        ❤️ No properties saved yet.{" "}
                        <span
                            style={{ color: "#2563eb", cursor: "pointer" }}
                            onClick={() => navigate("/properties")}
                        >
                            Browse Properties →
                        </span>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((property) => (
                            <div key={property._id} className="wishlist-card">
                                <img
                                    src={getImageSrc(property.images?.[0])}
                                    alt={property.title}
                                />

                                <div className="wishlist-info">
                                    <h3>{property.title}</h3>
                                    <p>📍 {property.location}</p>
                                    <p>🛏 {property.bhk}</p>
                                    <h2>₹ {property.rent?.toLocaleString("en-IN")}/month</h2>

                                    <div className="wishlist-buttons">
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/property/${property._id}`)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="visit-btn"
                                            onClick={() => navigate(`/property/${property._id}`)}
                                        >
                                            Schedule Visit
                                        </button>

                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(property._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default TenantWishlist;