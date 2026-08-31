import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/propertyCard.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";

// Helper: prepend backend URL for uploaded images
function getImageSrc(img) {
    if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
    if (img.startsWith("/uploads")) return BACKEND_URL + img;
    return img;
}

// Sync wishlist IDs from DB to localStorage once per session
let wishlistSyncDone = false;
const syncWishlistFromDB = async () => {
    if (wishlistSyncDone) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) return;
    try {
        const { data } = await api.get("/users/profile");
        const ids = (data.wishlist || []).map((item) => String(item._id || item));
        localStorage.setItem("wishlistIds", JSON.stringify(ids));
        wishlistSyncDone = true;
    } catch {
        // Silently ignore — wishlist sync failure should not break the UI
    }
};

const getLocalWishlistIds = () => {
    try {
        return JSON.parse(localStorage.getItem("wishlistIds") || "[]");
    } catch {
        return [];
    }
};

function PropertyCard({ id, image, title, location, rent, bhk, rating }) {
    const navigate = useNavigate();

    const [saved, setSaved] = useState(() => getLocalWishlistIds().includes(String(id)));

    // Sync from DB on first mount so hearts are correct across devices / browsers
    useEffect(() => {
        syncWishlistFromDB().then(() => {
            setSaved(getLocalWishlistIds().includes(String(id)));
        });
    }, [id]);

    const handleWishlist = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
            navigate("/login");
            return;
        }
        try {
            if (saved) {
                await api.delete(`/users/wishlist/${id}`);
                const updated = getLocalWishlistIds().filter((wid) => wid !== String(id));
                localStorage.setItem("wishlistIds", JSON.stringify(updated));
                setSaved(false);
            } else {
                await api.post(`/users/wishlist/${id}`);
                const updated = [...getLocalWishlistIds(), String(id)];
                localStorage.setItem("wishlistIds", JSON.stringify(updated));
                setSaved(true);
            }
        } catch (err) {
            console.error("Wishlist error:", err);
        }
    };

    return (
        <div className="property-card">
            {/* Property Image */}
            <div className="property-image">
                <img
                    src={getImageSrc(image)}
                    alt={title}
                />

                <span
                    className={`wishlist ${saved ? "saved" : ""}`}
                    onClick={handleWishlist}
                >
                    <FaHeart />
                </span>
            </div>

            {/* Trending */}
            <div className="property-tags">
                <span className="trending-tag">
                    🔥 Trending
                </span>
            </div>

            <div className="property-content">
                <h3>{title}</h3>

                <p className="location">
                    📍 {location}
                </p>

                <div className="property-info-row">
                    <span className="bhk">
                        🛏 {bhk}
                    </span>

                    <span className="rating">
                        ⭐ {rating}
                    </span>
                </div>

                <h2 className="rent-price">
                    ₹ {rent}/month
                </h2>

                <div className="property-buttons">
                    <button
                        className="details"
                        onClick={() => navigate(`/property/${id}`)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;