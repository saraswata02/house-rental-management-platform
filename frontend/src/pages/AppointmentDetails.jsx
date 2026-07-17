import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/appointmentDetails.css";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import RescheduleModal from "../components/RescheduleModal";

function AppointmentDetails() {

    const [modalOpen, setModalOpen] = useState(false);
    const [action, setAction] = useState("");
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

    return (

        <div className="appointment-details-page">

            <OwnerNavbar />

            <div className="appointment-details-container">

                <h1>Appointment Details</h1>

                <div className="details-card">

                    {/* Tenant Details */}

                    <div className="tenant-section">

                        <img
                            src="/default-profile.png"
                            alt="Tenant"
                            className="tenant-image"
                        />

                        <div>

                            <h2>Rahul Sharma</h2>

                            <p>✔ Verified Tenant</p>

                            <p>📞 +91 9876543210</p>

                            <p>✉ rahul@gmail.com</p>

                        </div>

                    </div>

                    <hr />

                    {/* Property Details */}

                    <div className="property-section">

                        <h2>Property</h2>

                        <p>🏠 Luxury Apartment</p>

                        <p>1 BHK • ₹8,000 / month</p>

                    </div>

                    <hr />

                    {/* Visit Details */}

                    <div className="visit-section">

                        <h2>Visit Information</h2>

                        <p>📅 18 July 2026</p>

                        <p>🕒 11:00 AM</p>

                        <p><strong>Purpose :</strong> House Inspection</p>

                        <p>

                            <strong>Additional Note :</strong><br />

                            I will come with my parents.

                        </p>

                    </div>

                    <hr />

                    {/* Action Buttons */}

                    <div className="appointment-buttons">

                        <button
                            className="approve-btn"
                            onClick={() => {
                                setAction("Approve");
                                setModalOpen(true);
                            }}
                        >
                            Approve
                        </button>

                        <button
                            className="reject-btn"
                            onClick={() => {
                                setAction("Reject");
                                setModalOpen(true);
                            }}
                        >
                            Reject
                        </button>

                        <button
                            className="reschedule-btn"
                            onClick={() => setRescheduleModalOpen(true)}
                        >
                            Reschedule
                        </button>

                    </div>

                </div>

            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title={`${action} Appointment`}
                message={`Are you sure you want to ${action.toLowerCase()} this appointment?`}
                confirmText={action}
                onCancel={() => setModalOpen(false)}
                onConfirm={() => {
                    alert(`${action} Successful`);
                    setModalOpen(false);
                }}
            />

            <RescheduleModal
                isOpen={rescheduleModalOpen}
                onClose={() => setRescheduleModalOpen(false)}
            />

            <Footer />

        </div>

    );

}

export default AppointmentDetails;