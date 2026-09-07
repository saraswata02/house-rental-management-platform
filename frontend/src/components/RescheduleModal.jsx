import { useState } from "react";
import "../styles/rescheduleModal.css";

function RescheduleModal({ isOpen, onClose }) {

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="reschedule-modal">

                <h2>📅 Reschedule Appointment</h2>

                <div className="form-group">

                    <label>Select New Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e)=>setDate(e.target.value)}
                    />

                </div>

                <div className="form-group">

                    <label>Select New Time</label>

                    <select
                        value={time}
                        onChange={(e)=>setTime(e.target.value)}
                    >

                        <option value="">Choose Time</option>

                        <option>09:00 AM</option>
                        <option>11:00 AM</option>
                        <option>02:00 PM</option>
                        <option>05:00 PM</option>

                    </select>

                </div>

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={()=>{
                            alert("Appointment Rescheduled Successfully");
                            onClose();
                        }}
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    );

}

export default RescheduleModal;