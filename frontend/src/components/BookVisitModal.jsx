import { useState, useEffect } from "react";
import "../styles/bookVisitModal.css";
import api from "../utils/api";

function BookVisitModal({ isOpen, onClose, propertyId, availableDates = [], propertyTitle = "Property" }) {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [visitDate, setVisitDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("11:00 AM");
  const [purpose, setPurpose] = useState("House Inspection");
  const [additionalNote, setAdditionalNote] = useState("");

  // Pre-select first available date if available
  useEffect(() => {
    if (availableDates && availableDates.length > 0) {
      setVisitDate(availableDates[0]);
    } else {
      setVisitDate("");
    }
  }, [availableDates, isOpen]);

  const handleBooking = async () => {
    if (!visitDate) {
      setError("Please select a visit date.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/visits", {
        propertyId,
        visitDate,
        timeSlot,
        purpose,
        additionalNote,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please login first.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        {bookingSuccess ? (
          <div className="booking-success">
            <div className="success-icon">✅</div>
            <h2>Booking Request Sent</h2>
            <p>Your visit appointment request for <strong>{visitDate}</strong> at <strong>{timeSlot}</strong> has been sent to the property owner.</p>
            <div className="booking-status">
              Status : <span> Pending Owner Approval</span>
            </div>
          </div>
        ) : (
          <>
            <h2>📅 Schedule Property Visit</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "-10px", marginBottom: "16px" }}>
              For: <strong>{propertyTitle}</strong>
            </p>

            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

            {/* Owner Available Dates Selection */}
            <div className="form-group">
              <label style={{ display: "block", marginBottom: "6px" }}>
                {availableDates && availableDates.length > 0 ? "Select from Owner's Available Dates *" : "Select Date *"}
              </label>

              {availableDates && availableDates.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "6px" }}>
                  {availableDates.map((date) => {
                    const isSelected = visitDate === date;
                    return (
                      <button
                        type="button"
                        key={date}
                        onClick={() => setVisitDate(date)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: isSelected ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                          background: isSelected ? "#eff6ff" : "#ffffff",
                          color: isSelected ? "#1e40af" : "#1e293b",
                          fontWeight: isSelected ? "700" : "500",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "14px" }}>📅 {date}</span>
                        {isSelected && (
                          <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700" }}>✓ Selected</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              )}
            </div>

            <div className="form-group">
              <label>Select Time</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option>09:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>04:00 PM</option>
                <option>05:00 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>House Inspection</option>
                <option>Rent Discussion</option>
                <option>Family Visit</option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Note (Optional)</label>
              <textarea
                rows="3"
                placeholder="Write anything you want the owner to know..."
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <button className="confirm-btn" onClick={handleBooking} disabled={loading}>
                {loading ? "Sending Request..." : "Confirm Booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookVisitModal;