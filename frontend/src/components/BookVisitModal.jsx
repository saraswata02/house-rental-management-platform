import { useState } from "react";
import "../styles/bookVisitModal.css";

function BookVisitModal({ isOpen, onClose }) {

    const [bookingSuccess, setBookingSuccess] = useState(false);

    const handleBooking = () => {

        setBookingSuccess(true);

        setTimeout(() => {

            setBookingSuccess(false);

            onClose();

        }, 2500);

    };

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="booking-modal">

                {bookingSuccess ? (

                    <div className="booking-success">

                        <div className="success-icon">
                            ✅
                        </div>

                        <h2>Booking Request Sent</h2>

                        <p>

                            Your appointment request has been sent to the owner.

                        </p>

                        <div className="booking-status">

                            Status :
                            <span> Pending Approval</span>

                        </div>

                    </div>

                ) : (

                    <>

                        <h2>📅 Schedule Property Visit</h2>

                        <div className="form-group">

                            <label>Select Date</label>

                            <input type="date" />

                        </div>

                        <div className="form-group">

                            <label>Select Time</label>

                            <select>

                                <option>09:00 AM</option>
                                <option>11:00 AM</option>
                                <option>02:00 PM</option>
                                <option>05:00 PM</option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Purpose</label>

                            <select>

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
                            />

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
                                onClick={handleBooking}
                            >
                                Confirm Booking
                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

}

export default BookVisitModal;