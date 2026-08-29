import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerAppointments.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function OwnerAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/visits/for-owner");
        setAppointments(data);
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/visits/${id}/status`, { status });
      setAppointments(appointments.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="owner-appointments-page">
      <OwnerNavbar />
      <div className="owner-appointments-container">
        <h1>Appointment Requests</h1>
        <div className="appointments-list">
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointment requests yet.</p>
          ) : (
            appointments.map((item) => (
              <div className="appointment-card" key={item._id}>
                <div className="appointment-info">
                  <h2>{item.tenant?.firstName} {item.tenant?.lastName}</h2>
                  <p>🏠 {item.property?.title}</p>
                  <p>📅 {item.visitDate}</p>
                  <p>🕒 {item.timeSlot}</p>
                  <span className={`status ${item.status}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                </div>
                <div className="appointment-actions">
                  <button className="view-btn" onClick={() => navigate(`/appointment-details?id=${item._id}`)}>
                    View Details
                  </button>
                  {item.status === "pending" && (
                    <>
                      <button className="approve-btn" onClick={() => handleStatus(item._id, "approved")}>Approve</button>
                      <button className="reject-btn" onClick={() => handleStatus(item._id, "rejected")}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OwnerAppointments;