import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/myAppointments.css";
import api from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
function getImageSrc(img) {
  if (!img) return null;
  if (img.startsWith("/uploads")) return BACKEND_URL + img;
  return img;
}

function MyAppointments() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRescheduleId, setActiveRescheduleId] = useState(null);
  const [chosenDate, setChosenDate] = useState("");
  const [chosenTime, setChosenTime] = useState("");
  const [submittingDate, setSubmittingDate] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();


  const fetchVisits = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/visits/my-visits");
      setVisits(data);
    } catch (err) {
      console.error("Error fetching visits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancel = async (visitId) => {
    if (!window.confirm("Are you sure you want to reject / cancel this appointment?")) return;
    try {
      await api.patch(`/visits/${visitId}/cancel`);
      setVisits(visits.map((v) => v._id === visitId ? { ...v, status: "cancelled" } : v));
      setActiveRescheduleId(null);
    } catch {
      alert("Failed to cancel. Please try again.");
    }
  };

  const handleDelete = async (visitId) => {
    if (!window.confirm("Delete this appointment from your appointments?")) return;
    try {
      await api.delete(`/visits/${visitId}`);
      setVisits((current) => current.filter((visit) => visit._id !== visitId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  const handleSelectAlternateDate = async (visitId) => {
    if (!chosenDate || !chosenTime) {
      alert("Please select an available date and time.");
      return;
    }
    try {
      setSubmittingDate(true);
      const { data } = await api.patch(`/visits/${visitId}/select-date`, {
        visitDate: chosenDate,
        timeSlot: chosenTime,
      });
      setVisits(visits.map((v) => v._id === visitId ? data : v));
      setActiveRescheduleId(null);
      setChosenDate("");
      setChosenTime("");
      alert(`Date successfully updated to ${chosenDate}! The owner has been notified.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update visit date.");
    } finally {
      setSubmittingDate(false);
    }
  };

  const statusClass = (status) => {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    if (status === "cancelled") return "cancelled";
    if (status === "completed") return "completed";
    if (status === "reschedule_requested") return "pending";
    return "pending";
  };

  const statusLabel = (status) => {
    const labels = {
      pending: "Pending Approval",
      approved: "Approved by Owner",
      rejected: "Rejected / Cancelled by Owner",
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
        <p className="appointments-subtitle">Track, reschedule, and manage all your scheduled property visits.</p>

        {loading ? (
          <p>Loading appointments...</p>
        ) : visits.length === 0 ? (
          <p>No appointments booked yet. <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => navigate("/properties")}>Browse Properties →</span></p>
        ) : (
          visits.map((visit) => {
            const isRescheduleMode = activeRescheduleId === visit._id;
            
            // Check if the property was deleted by the owner
            if (!visit.property || visit.property.hiddenFromOwner) {
              // If already dismissed (cancelled), don't show it at all
              if (visit.status === "cancelled") return null;

              return (
                <div
                  className="appointment-card"
                  key={visit._id}
                  style={{
                    border: "1px solid #fee2e2",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    background: "#fff5f5",
                    position: "relative",
                    }}
                  >
                    <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1 }}>
                      <button
                        type="button"
                        aria-label="More appointment options"
                        onClick={() => setOpenMenuId(openMenuId === visit._id ? null : visit._id)}
                        style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}
                      >
                        ⋯
                      </button>
                      {openMenuId === visit._id && (
                        <button
                          type="button"
                          onClick={() => handleDelete(visit._id)}
                          style={{ display: "block", marginTop: "4px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#991b1b", fontWeight: "600", fontSize: "15px" }}>
                      ⚠️ Due to some problems, the owner has removed this property post. Please go for more properties.
                    </p>
                </div>
              );
            }

            const availableDates = visit.property?.availableDates || [];
            const remainingDates = availableDates.filter(
              (date) => date !== visit.visitDate && !visit.unavailableDates?.includes(date)
            );

            return (
              <div
                className="appointment-card"
                key={visit._id}
                style={{
                  border: visit.status === "reschedule_requested" ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1 }}>
                  <button
                    type="button"
                    aria-label={`More options for ${visit.property?.title || "appointment"}`}
                    onClick={() => setOpenMenuId(openMenuId === visit._id ? null : visit._id)}
                    style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}
                  >
                    ⋯
                  </button>
                  {openMenuId === visit._id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(visit._id)}
                      style={{ display: "block", marginTop: "4px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div className="appointment-image">
                    <img
                      src={getImageSrc(visit.property?.images?.[0])}
                      alt="Property"
                    />
                  </div>

                  <div className="appointment-details" style={{ flex: 1 }}>
                    <h2>{visit.property?.title}</h2>
                    <p>📍 {visit.property?.location}</p>
                    <p>📅 Scheduled Date: <strong>{visit.visitDate}</strong> at <strong>{visit.timeSlot}</strong></p>
                    {visit.status !== "reschedule_requested" && (
                      <span className={`status ${statusClass(visit.status)}`}>
                        {statusLabel(visit.status)}
                      </span>
                    )}
                  </div>

                  <div className="appointment-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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

                {/* Reschedule Requested Notice & Tenant 2-Action Response */}
                {visit.status === "reschedule_requested" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1.5px solid #fcd34d",
                      padding: "16px",
                      borderRadius: "12px",
                      marginTop: "6px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "20px" }}>⚠️</span>
                      <strong style={{ color: "#92400e", fontSize: "15px" }}>
                        Owner is not available on {visit.visitDate}
                      </strong>
                    </div>

                    <p style={{ color: "#78350f", fontSize: "13px", margin: "0 0 12px 0" }}>
                      {visit.ownerNote || "Please choose another date from the owner's posted availability."}
                    </p>

                    {/* Tenant can choose another date or reject the appointment. */}
                    {!isRescheduleMode ? (
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRescheduleId(visit._id);
                            setChosenDate(remainingDates[0] || "");
                            setChosenTime("");
                          }}
                          style={{
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          ✓ Approve (Choose Another Date)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancel(visit._id)}
                          style={{
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: "pointer",
                          }}
                        >
                          ✕ Reject Appointment
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid #fde68a" }}>
                        <p style={{ fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0", fontSize: "14px" }}>
                          Select an alternate date from the owner's posted availability:
                        </p>

                        {remainingDates.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                            {remainingDates.map((date) => {
                              const isSelected = chosenDate === date;
                              return (
                                <button
                                  type="button"
                                  key={date}
                                  onClick={() => setChosenDate(date)}
                                  style={{
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    border: isSelected ? "2px solid #2563eb" : "1.5px solid #cbd5e1",
                                    background: isSelected ? "#eff6ff" : "#f8fafc",
                                    color: isSelected ? "#1e40af" : "#334155",
                                    fontWeight: isSelected ? "700" : "500",
                                    cursor: "pointer",
                                  }}
                                >
                                  📅 {date} {isSelected && "✓"}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ color: "#92400e", marginBottom: "14px" }}>
                            The owner has not posted another available date yet.
                          </p>
                        )}

                        <label style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", color: "#1e293b", fontWeight: "700", fontSize: "14px" }}>
                          Select a time for the chosen date:
                          <input
                            type="time"
                            value={chosenTime}
                            onChange={(event) => setChosenTime(event.target.value)}
                            style={{
                              width: "180px",
                              padding: "8px 10px",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              fontWeight: "500",
                            }}
                          />
                        </label>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleSelectAlternateDate(visit._id)}
                            disabled={submittingDate || !chosenDate || !chosenTime}
                            style={{
                              background: "#2563eb",
                              color: "#fff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            {submittingDate ? "Updating..." : `Confirm ${chosenDate ? chosenDate : "Date"}`}
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveRescheduleId(null)}
                            style={{
                              background: "transparent",
                              border: "1px solid #cbd5e1",
                              color: "#64748b",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            Back
                          </button>

                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyAppointments;