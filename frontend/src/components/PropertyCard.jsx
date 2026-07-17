import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/propertyCard.css";
import {

    addToWishlist,

    removeFromWishlist,

    isWishlisted

} from "../utils/wishlist";
function PropertyCard({
    id,
    image,
    title,
    location,
    rent,
    bhk,
    rating,
}) {

    

    const navigate = useNavigate();
    const [saved, setSaved] = useState(isWishlisted(id));

    return (

        <div className="property-card">

            {/* Property Image */}

            <div className="property-image">

                <img
                    src={image}
                    alt={title}
                />

               <span

className={`wishlist ${saved ? "saved" : ""}`}

onClick={() => {

    const property = {

        id,

        image,

        title,

        location,

        rent,

        bhk,

        rating

    };

    if(saved){

        removeFromWishlist(id);

        setSaved(false);

    }

    else{

        addToWishlist(property);

        setSaved(true);

    }

}}

>

<FaHeart/>

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