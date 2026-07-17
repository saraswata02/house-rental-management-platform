import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/myProperties.css";

function MyProperties() {

    const navigate = useNavigate();

    return (


        <div className="my-properties-page">

            <OwnerNavbar />

            <div className="my-properties-container">

                <div className="page-header">

                    <h1>My Properties</h1>

                    <button className="add-property-btn"
                        onClick={() => navigate("/add-property")}>
                        + Add Property
                    </button>

                </div>
                        
                <div className="property-list">

                    {/* Property Card */}

                    <div className="owner-property-card">

                        <img
                            src="/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg"
                            alt="House"
                        />

                        <div className="property-details">

                            <h2>Luxury Apartment</h2>

                            <p>📍 Bhubaneswar</p>

                            <h3>₹18,000 / month</h3>

                            <div className="property-stats">

                                <span className="active">
                                    ✅ Active
                                </span>

                            </div>

                        </div>

                        <div className="property-actions">

                            <button className="view-btn">
                                View
                            </button>

                            <button className="edit-btn"
                                onClick={() => navigate("/edit-property/1")}>
                                Edit
                            </button>

                            <button className="delete-btn">
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default MyProperties;