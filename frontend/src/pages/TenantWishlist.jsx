import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/tenantWishlist.css";

import {
    getWishlist,
    removeFromWishlist
} from "../utils/wishlist";

function TenantWishlist() {
    const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(() => getWishlist());

    const handleRemove = (id) => {

        removeFromWishlist(id);

        setWishlist(getWishlist());

    };

    return (

        <div className="tenant-wishlist-page">

            <Navbar />

            <div className="wishlist-container">

                <h1>My Wishlist</h1>

                {

                    wishlist.length === 0 ?

                    (

                        <div className="empty-wishlist">

                            ❤️ No properties saved yet.

                        </div>

                    )

                    :

                    (

                        <div className="wishlist-grid">

                            {

                                wishlist.map(property => (

                                    <div
                                        key={property.id}
                                        className="wishlist-card"
                                    >

                                        <img
                                            src={property.image}
                                            alt={property.title}
                                        />

                                        <div className="wishlist-info">

                                            <h3>{property.title}</h3>

                                            <p>📍 {property.location}</p>

                                            <p>🛏 {property.bhk}</p>

                                            <h2>₹ {property.rent}/month</h2>

                                            <div className="wishlist-buttons">

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        navigate(`/property/${property.id}`)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="visit-btn"
                                                    onClick={() =>
                                                        navigate(`/property/${property.id}`)
                                                    }
                                                >
                                                    Schedule Visit
                                                </button>

                                                <button
                                                    className="remove-btn"
                                                    onClick={() =>
                                                        handleRemove(property.id)
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

            <Footer />

        </div>

    );

}

export default TenantWishlist;