import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import properties from "../data/propertiesData";
import { useState } from "react";
import BookVisitModal from "../components/BookVisitModal";
import PropertyMap from "../components/PropertyMap";
import "../styles/propertyDetails.css";

function PropertyDetails(){
    const { id } = useParams();
    const navigate = useNavigate();
    const property = properties.find(
        item => item.id === Number(id)
    );
    const [selectedImage, setSelectedImage] = useState(
    property.images[0]
    );
    const [showBookingModal, setShowBookingModal] = useState(false);
    return(
           
        <div className="property-details-page">

            <Navbar/>

             <div className="property-details-container">

    <button className="back1-btn"
     onClick={() => navigate("/properties")}>
        ← Back to Properties
    </button>

    <div className="property-hero">

    <div className="property-image-section">

        <img
            src={selectedImage}
            alt={property.title}
            className="property-main-image"
        />

        <div className="image-gallery">

            {property.images.map((img, index) => (

                <img
                    key={index}
                    src={img}
                    alt="Property"
                    className={`gallery-image ${
                        selectedImage === img ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                />

            ))}

        </div>

    </div>

        <div className="property-basic-info">

            <h1>{property.title}</h1>

            <div className="property-rating">

                ⭐⭐⭐⭐⭐ {property.rating}

            </div>

            <p className="property-location">

                📍 {property.location}

            </p>

            <h2 className="property-rent">

                ₹ {property.rent}/month

            </h2>

            <div className="property-short-info">

                <span>🛏 {property.bhk}</span>

                <span>✅ Available</span>

            </div>
            <section className="property-description">

    <h2>Description</h2>

    <p>

        {property.description}

    </p>

</section>

<section className="property-highlights">

    <h2>Property Highlights</h2>

    <div className="highlights-grid">

        <div className="highlight-box">
            🏠 <strong>Property Type</strong>
            <span>Apartment</span>
        </div>

        <div className="highlight-box">
            🛏 <strong>Bedrooms</strong>
            <span>{property.bhk}</span>
        </div>

        <div className="highlight-box">
            🛁 <strong>Bathrooms</strong>
            <span>2</span>
        </div>

        <div className="highlight-box">
            📅 <strong>Available</strong>
            <span>Immediately</span>
        </div>

    </div>

</section>

<section className="property-amenities">

    <h2>Amenities</h2>

    <div className="amenities-grid">

        <div className="amenity-card">
            🚗
            <span>Parking</span>
        </div>

        <div className="amenity-card">
            🛗
            <span>Lift</span>
        </div>

        <div className="amenity-card">
            📶
            <span>Wi-Fi</span>
        </div>

        <div className="amenity-card">
            ❄
            <span>Air Conditioning</span>
        </div>

        <div className="amenity-card">
            📹
            <span>CCTV Security</span>
        </div>

        <div className="amenity-card">
            ⚡
            <span>Power Backup</span>
        </div>

        <div className="amenity-card">
            🏋
            <span>Gym</span>
        </div>

        <div className="amenity-card">
            🌳
            <span>Garden</span>
        </div>

        <div className="amenity-card">
            🏊
            <span>Swimming Pool</span>
        </div>

        <div className="amenity-card">
            🧺
            <span>Laundry</span>
        </div>

        <div className="amenity-card">
            🚰
            <span>24×7 Water</span>
        </div>

        <div className="amenity-card">
            🔥
            <span>Gas Pipeline</span>
        </div>

    </div>

</section>
<section className="property-map">

    <h2>Location</h2>

    <PropertyMap
        lat={property.lat}
        lng={property.lng}
    />
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
            src="/owner.jpg"
            alt="Owner"
            className="owner-image"
        />

        <div className="owner-info">

            <h3>Rahul Kumar</h3>

            <p className="owner-badge">
                ✔ Verified Owner
            </p>

            <p>
                Member since 2024
            </p>

            <p>
                ⭐ 4.9 Owner Rating
            </p>

        </div>

        <div className="owner-actions">

            <button className="chat-btn">
                💬 Chat
            </button>

            <button className="visit-btn" 
            onClick={() => setShowBookingModal(true)}>
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
/>

            <Footer/>

        </div>

    );

}

export default PropertyDetails;