import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/myAppointments.css";
import api from "../utils/api";

const BACKEND_URL = "http://localhost:5000";
function getImageSrc(img) {
  if (!img) return "/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg";
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function MyAppointments() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const { data } = await api.get("/visits/my-visits");
        setVisits(data);
      } catch (err) {
        console.error("Error fetching visits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  const handleCancel = async (visitId) => {
    try {
      await api.patch(`/visits/${visitId}/cancel`);
      setVisits(visits.map((v) => v._id === visitId ? { ...v, status: "cancelled" } : v));
    } catch {
      alert("Failed to cancel. Please try again.");
    }
  };

  const statusClass = (status) => {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    if (status === "cancelled") return "cancelled";
    if (status === "completed") return "completed";
    return "pending";
  };

  const statusLabel = (status) => {
    const labels = {
      pending: "Pending Approval",
      approved: "Approved",
      rejected: "Rejected by Owner",
      cancelled: "Cancelled",
      completed: "Completed",
    };
    return labels[status] || status;
  };

  return (
    <div className="appointments-page">
      <Navbar />
      <div className="appointments-container">
        <h1>📅 My Appointments</h1>
        <p className="appointments-subtitle">Track all your scheduled property visits.</p>

        {loading ? (
          <p>Loading appointments...</p>
        ) : visits.length === 0 ? (
          <p>No appointments booked yet. <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/properties")}>Browse Properties →</span></p>
        ) : (
          visits.map((visit) => (
            <div className="appointment-card" key={visit._id}>
              <div className="appointment-image">
                <img
                  src={getImageSrc(visit.property?.images?.[0])}
                  alt="Property"
                />
              </div>
              <div className="appointment-details">
                <h2>{visit.property?.title}</h2>
                <p>📍 {visit.property?.location}</p>
                <p>📅 {visit.visitDate}</p>
                <p>🕚 {visit.timeSlot}</p>
                <span className={`status ${statusClass(visit.status)}`}>
                  {statusLabel(visit.status)}
                </span>
              </div>
              <div className="appointment-buttons">
                <button className="view-btn" onClick={() => navigate(`/property/${visit.property?._id}`)}>
                  View Property
                </button>
                {visit.status === "pending" && (
                  <button className="cancel-btn" onClick={() => handleCancel(visit._id)}>
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyAppointments;