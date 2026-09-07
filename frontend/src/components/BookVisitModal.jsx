import { useState } from "react";
import "../styles/bookVisitModal.css";
import api from "../utils/api";

function BookVisitModal({ isOpen, onClose, propertyId }) {
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [visitDate, setVisitDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM");
  const [purpose, setPurpose] = useState("House Inspection");
  const [additionalNote, setAdditionalNote] = useState("");

  const handleBooking = async () => {
    if (!visitDate) {
      setError("Please select a date.");
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
            <p>Your appointment request has been sent to the owner.</p>
            <div className="booking-status">
              Status : <span> Pending Approval</span>
            </div>
          </div>
        ) : (
          <>
            <h2>📅 Schedule Property Visit</h2>

            {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

            <div className="form-group">
              <label>Select Date</label>
              <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Select Time</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option>09:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
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
              <label>Additional Note</label>
              <textarea
                rows="4"
                placeholder="Write anything you want the owner to know..."
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <button className="confirm-btn" onClick={handleBooking} disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookVisitModal;