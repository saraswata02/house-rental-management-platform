import { useState } from "react";
import api from "../utils/api";
import "../styles/rescheduleModal.css";

function ScheduleDateModal({ isOpen, onClose, visit, onRescheduleRequested }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !visit) return null;

  const handleSend = async () => {
    try {
      setLoading(true);
      setError("");
      const customNote = note.trim() || `Owner is not available on ${visit.visitDate}. Please choose another date from the property's available dates.`;
      
      await api.patch(`/visits/${visit._id}/reschedule-request`, { note: customNote });
      
      if (onRescheduleRequested) {
        onRescheduleRequested(visit._id, customNote);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal" style={{ maxWidth: "480px" }}>
        <h2>📅 Schedule Another Date</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginTop: "-6px", marginBottom: "16px" }}>
          Mark <strong>{visit.visitDate}</strong> ({visit.timeSlot}) as unavailable for <strong>{visit.tenant?.firstName} {visit.tenant?.lastName}</strong> and request them to pick an alternate date.
        </p>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <div className="form-group">
          <label>Message for Tenant</label>
          <textarea
            rows="3"
            placeholder="e.g. Sorry, I am unavailable on this date. Please select another date from the available options on the property listing."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Back
          </button>
          <button
            type="button"
            className="confirm-btn"
            style={{ background: "#d97706" }}
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Mark Unavailable & Notify Tenant"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDateModal;
