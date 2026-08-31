import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import RescheduleModal from "../components/RescheduleModal";
import "../styles/appointmentDetails.css";
import api from "../utils/api";

function AppointmentDetails() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const visitId = searchParams.get("id");

    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [action, setAction] = useState("");
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

    useEffect(() => {
        if (!visitId) return;
        const fetchVisit = async () => {
            try {
                const { data } = await api.get(`/visits/${visitId}`);
                setVisit(data);
            } catch (err) {
                console.error("Error loading visit:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVisit();
    }, [visitId]);

    const handleAction = async (confirmedAction) => {
        try {
            const status = confirmedAction === "Approve" ? "approved" : "rejected";
            await api.patch(`/visits/${visitId}/status`, { status });
            setVisit({ ...visit, status });
            setModalOpen(false);
        } catch {
            alert("Failed to update status. Please try again.");
            setModalOpen(false);
        }
    };

    const handleReschedule = async ({ visitDate, timeSlot }) => {
        try {
            await api.patch(`/visits/${visitId}/reschedule`, { visitDate, timeSlot });
            setVisit({ ...visit, visitDate, timeSlot, status: "pending" });
            setRescheduleModalOpen(false);
        } catch {
            alert("Failed to reschedule. Please try again.");
        }
    };

    if (!visitId) return <div style={{ padding: "40px" }}>No appointment ID provided.</div>;
    if (loading) return <div style={{ padding: "40px" }}>Loading appointment details...</div>;
    if (!visit) return <div style={{ padding: "40px" }}>Appointment not found.</div>;

    const tenant = visit.tenant || {};
    const property = visit.property || {};

    const statusColor = {
        approved: "#16a34a",
        rejected: "#dc2626",
        pending: "#d97706",
        completed: "#2563eb",
    };

    return (
        <div className="appointment-details-page">
            <OwnerNavbar />

            <div className="appointment-details-container">
                <button
                    onClick={() => navigate("/owner-appointments")}
                    style={{ marginBottom: "16px", cursor: "pointer", background: "none", border: "none", fontSize: "14px", color: "#2563eb" }}
                >
                    ← Back to Appointments
                </button>

                <h1>Appointment Details</h1>

                <div className="details-card">
                    {/* Tenant Details */}
                    <div className="tenant-section">
                        <img
                            src={tenant.profilePicture || "/default-profile.png"}
                            alt="Tenant"
                            className="tenant-image"
                        />
                        <div>
                            <h2>{tenant.firstName} {tenant.lastName}</h2>
                            <p>✔ Verified Tenant</p>
                            <p>📞 {tenant.phone || "Not provided"}</p>
                            <p>✉ {tenant.email}</p>
                        </div>
                    </div>

                    <hr />

                    {/* Property Details */}
                    <div className="property-section">
                        <h2>Property</h2>
                        <p>🏠 {property.title}</p>
                        <p>{property.bhk} • ₹{property.rent?.toLocaleString("en-IN")} / month</p>
                        <p>📍 {property.location}</p>
                    </div>

                    <hr />

                    {/* Visit Details */}
                    <div className="visit-section">
                        <h2>Visit Information</h2>
                        <p>📅 {visit.visitDate}</p>
                        <p>🕒 {visit.timeSlot}</p>
                        <p><strong>Purpose :</strong> {visit.purpose}</p>
                        {visit.additionalNote && (
                            <p>
                                <strong>Additional Note :</strong><br />
                                {visit.additionalNote}
                            </p>
                        )}
                        <p>
                            <strong>Status :</strong>{" "}
                            <span style={{ color: statusColor[visit.status], fontWeight: "bold", textTransform: "capitalize" }}>
                                {visit.status}
                            </span>
                        </p>
                    </div>

                    <hr />

                    {/* Action Buttons — only shown for pending visits */}
                    {visit.status === "pending" && (
                        <div className="appointment-buttons">
                            <button
                                className="approve-btn"
                                onClick={() => { setAction("Approve"); setModalOpen(true); }}
                            >
                                Approve
                            </button>

                            <button
                                className="reject-btn"
                                onClick={() => { setAction("Reject"); setModalOpen(true); }}
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
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title={`${action} Appointment`}
                message={`Are you sure you want to ${action.toLowerCase()} this appointment?`}
                confirmText={action}
                onCancel={() => setModalOpen(false)}
                onConfirm={() => handleAction(action)}
            />

            <RescheduleModal
                isOpen={rescheduleModalOpen}
                onClose={() => setRescheduleModalOpen(false)}
                onReschedule={handleReschedule}
            />

            <Footer />
        </div>
    );
}

export default AppointmentDetails;