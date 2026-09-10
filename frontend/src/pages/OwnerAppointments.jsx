import { useEffect, useState } from "react";
import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerAppointments.css";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import ScheduleDateModal from "../components/ScheduleDateModal";

function OwnerAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisitForReschedule, setSelectedVisitForReschedule] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/visits/for-owner");
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/visits/${id}/status`, { status });
      setAppointments(appointments.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleRescheduleDone = (id, note) => {
    setAppointments(appointments.map((a) => (a._id === id ? { ...a, status: "reschedule_requested", ownerNote: note } : a)));
  };

  const formatStatus = (status) => {
    if (status === "reschedule_requested") return "Reschedule Requested (Waiting for Tenant)";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected / Cancelled";
    if (status === "cancelled") return "Cancelled by Tenant";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="owner-appointments-page">
      <OwnerNavbar />
      <div className="owner-appointments-container">
        <h1>Appointment Requests</h1>
        <p style={{ color: "#64748b", marginTop: "-10px", marginBottom: "20px", fontSize: "14px" }}>
          Manage tenant visit requests. Confirm appointments, request another date if unavailable, or reject.
        </p>

        <div className="appointments-list">
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointment requests yet.</p>
          ) : (
            appointments.map((item) => (
              <div className="appointment-card" key={item._id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div className="appointment-info">
                    <h2>{item.tenant?.firstName} {item.tenant?.lastName}</h2>
                    <p>🏠 <strong>{item.property?.title}</strong> ({item.property?.location})</p>
                    <p>📅 Requested Date: <strong>{item.visitDate}</strong> at <strong>{item.timeSlot}</strong></p>
                    {item.purpose && <p>🎯 Purpose: {item.purpose}</p>}
                    {item.ownerNote && item.status === "reschedule_requested" && (
                      <p style={{ background: "#fef3c7", color: "#92400e", padding: "6px 10px", borderRadius: "6px", fontSize: "13px", marginTop: "6px" }}>
                        ⚠️ Notice to Tenant: {item.ownerNote}
                      </p>
                    )}
                    <span className={`status ${item.status}`} style={{ display: "inline-block", marginTop: "6px" }}>
                      {formatStatus(item.status)}
                    </span>
                  </div>

                  <div className="appointment-actions" style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                    <button className="view-btn" onClick={() => navigate(`/appointment-details?id=${item._id}`)}>
                      View Details
                    </button>

                    {/* Owner 3 Action Buttons for Pending appointments */}
                    {item.status === "pending" && (
                      <>
                        {/* 1. Approve Button */}
                        <button
                          className="approve-btn"
                          style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleStatus(item._id, "approved")}
                        >
                          ✓ Approve
                        </button>

                        {/* 2. Schedule Date / Mark Unavailable Button */}
                        <button
                          type="button"
                          style={{ background: "#d97706", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => setSelectedVisitForReschedule(item)}
                        >
                          📅 Schedule Date
                        </button>

                        {/* 3. Reject / Cancel Button */}
                        <button
                          className="reject-btn"
                          style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => handleStatus(item._id, "rejected")}
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ScheduleDateModal
        isOpen={Boolean(selectedVisitForReschedule)}
        visit={selectedVisitForReschedule}
        onClose={() => setSelectedVisitForReschedule(null)}
        onRescheduleRequested={handleRescheduleDone}
      />

      <Footer />
    </div>
  );
}

export default OwnerAppointments;