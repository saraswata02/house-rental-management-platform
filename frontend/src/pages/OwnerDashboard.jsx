import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../styles/ownerDashboard.css";
import OwnerSlider from "../components/OwnerSlider";

function OwnerDashboard() {

    const navigate = useNavigate();

    return (

        <div className="owner-dashboard">

            <OwnerNavbar />

            <OwnerSlider />

            <div className="owner-container">

                {/* Statistics */}

                <div className="stats-grid">

                </div>

                {/* Quick Actions */}

                <h2 className="section-title">

                    Quick Actions

                </h2>

                <div className="action-grid">

                    <div
                        className="action-card"
                        onClick={() => navigate("/add-property")}
                    >

                        <div className="action-icon">

                            ➕

                        </div>

                        <h3>Add Property</h3>

                        <p>Post a new rental property.</p>

                    </div>

                    <div
                        className="action-card"
                        onClick={() => navigate("/owner-properties")}
                    >

                        <div className="action-icon">

                            🏠

                        </div>

                        <h3>My Properties</h3>

                        <p>Manage all your listings.</p>

                    </div>

                    <div
                        className="action-card"
                        onClick={() => navigate("/owner-appointments")}
                    >

                        <div className="action-icon">

                            📅

                        </div>

                        <h3>Appointment Requests</h3>

                        <p>Approve or reject bookings.</p>

                    </div>

                    <div className="action-card"
                    onClick={() => navigate("/owner-analytics")}
    style={{ cursor: "pointer" }}>

                        <div className="action-icon">

                            📊

                        </div>

                        <h3>Analytics</h3>

                        <p>Track property performance.</p>

                    </div>

                </div>

            </div>

            <Footer/>

        </div>

    );

}

export default OwnerDashboard;