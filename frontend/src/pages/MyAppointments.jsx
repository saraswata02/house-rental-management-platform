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
  const [chosenTime, setChosenTime] = useState("11:00 AM");
  const [submittingDate, setSubmittingDate] = useState(false);
  const navigate = useNavigate();

  const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

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

  const handleDismissDeletedProperty = async (visitId) => {
    try {
      await api.patch(`/visits/${visitId}/cancel`);
      // Immediately hide it from the UI by filtering it out
      setVisits(visits.filter((v) => v._id !== visitId));
    } catch {
      alert("Failed to dismiss. Please try again.");
    }
  };

  const handleSelectAlternateDate = async (visitId) => {
    if (!chosenDate) {
      alert("Please select one of the available dates.");
      return;
    }
    if (!chosenTime) {
      alert("Please select a visit time.");
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
      setChosenTime("11:00 AM");
      alert(`Date and time successfully updated to ${chosenDate} at ${chosenTime}! The owner has been notified.`);
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
      reschedule_requested: "Date Unavailable - Action Required",
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
            if (!visit.property) {
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
                    background: "#fff5f5"
                  }}
                >
                  <p style={{ margin: 0, color: "#991b1b", fontWeight: "600", fontSize: "15px" }}>
                    ⚠️ Due to some problems owners has removed its property from post go for some more properties
                  </p>
                  <button className="cancel-btn" onClick={() => handleDismissDeletedProperty(visit._id)} style={{ alignSelf: "flex-start" }}>
                    Dismiss
                  </button>
                </div>
              );
            }

            const availableDates = visit.property?.availableDates || [];
            const remainingDates = availableDates.filter((d) => !visit.unavailableDates?.includes(d));

            return (
              <div
                className="appointment-card"
                key={visit._id}
                style={{
                  border: visit.status === "reschedule_requested" ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
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
                    <span
                      className={`status ${statusClass(visit.status)}`}
                      style={{
                        background: visit.status === "reschedule_requested" ? "#fef3c7" : undefined,
                        color: visit.status === "reschedule_requested" ? "#92400e" : undefined,
                      }}
                    >
                      {statusLabel(visit.status)}
                    </span>
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
                      {visit.ownerNote || "The owner marked this timing as unavailable. Please choose another available date or reject the appointment."}
                    </p>

                    {/* Tenant 2 Options: Approve (Select New Date) & Reject */}
                    {!isRescheduleMode ? (
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRescheduleId(visit._id);
                            setChosenDate(remainingDates[0] || "");
                            setChosenTime(visit.timeSlot || "11:00 AM");
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
                          <div style={{ marginBottom: "14px" }}>
                            <input
                              type="date"
                              value={chosenDate}
                              onChange={(e) => setChosenDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                          </div>
                        )}

                        <div style={{ marginBottom: "14px" }}>
                          <p style={{ fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0", fontSize: "14px" }}>
                            Select a time slot
                          </p>
                          <select
                            value={chosenTime}
                            onChange={(e) => setChosenTime(e.target.value)}
                            style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", minWidth: "160px" }}
                          >
                            {TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>

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
                            {submittingDate ? "Updating..." : `Confirm ${chosenDate ? chosenDate : "Date"} at ${chosenTime}`}
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

                          <button
                            type="button"
                            onClick={() => handleCancel(visit._id)}
                            style={{
                              background: "#fee2e2",
                              border: "1px solid #fca5a5",
                              color: "#991b1b",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              fontWeight: "600",
                              cursor: "pointer",
                              marginLeft: "auto",
                            }}
                          >
                            Reject & Cancel
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