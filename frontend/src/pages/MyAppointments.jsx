import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/myAppointments.css";

function MyAppointments() {

    return (

        <div className="appointments-page">

            <Navbar />

            <div className="appointments-container">

                <h1>📅 My Appointments</h1>

                <p className="appointments-subtitle">
                    Track all your scheduled property visits.
                </p>

                <div className="appointment-card">

                    <div className="appointment-image">

                        <img
                            src="/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg"
                            alt="Property"
                        />

                    </div>

                    <div className="appointment-details">

                        <h2>Luxury Apartment</h2>

                        <p>📍 Bhubaneswar</p>

                        <p>📅 18 July 2026</p>

                        <p>🕚 11:00 AM</p>

                        <span className="status pending">

                            Pending Approval

                        </span>

                    </div>

                    <div className="appointment-buttons">

                        <button className="view-btn">

                            View Property

                        </button>

                        <button className="cancel-btn">

                            Cancel Appointment

                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default MyAppointments;