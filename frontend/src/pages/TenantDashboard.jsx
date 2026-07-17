import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import HeroSlider from "../components/HeroSlider";
import QuickStats from "../components/QuickStats";
import { useNavigate } from "react-router-dom";
import "../styles/tenantDashboard.css";

function TenantDashboard() {

  const navigate = useNavigate();

  return (

    <div className="tenant-dashboard">

      <Navbar />

      <HeroSlider />

      <QuickStats />

      <main className="dashboard-content">

        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="action-grid">

         <div
    className="action-card"
    onClick={() => navigate("/properties")}
>
    <div className="action-icon">🏠</div>

    <h3>Search Homes</h3>

    <p>Browse thousands of verified rentals.</p>
</div>

<div className="action-card">
    <div className="action-icon">🤖</div>
    <h3>AI Recommendation</h3>
    <p>Smart suggestions based on your needs.</p>
</div>

<div
    className="action-card"
    onClick={() => navigate("/tenant-wishlist")}
>

    <div className="action-icon">
        ❤️
    </div>

    <h3>Wishlist</h3>

    <p>Save your favourite properties.</p>

</div>

<div className="action-card" onClick={() => navigate("/my-appointments")}>
    <div className="action-icon">📅</div>
    <h3>Appointments</h3>
    <p>Book property visits instantly.</p>
</div>

</div>

        </section>

        <section className="featured-section">

    <div className="section-header">

        <h2>Featured Properties</h2>

        <button className="view-all-btn">
            View All →
        </button>

    </div>

    <p className="section-subtitle">
        Hand-picked premium rental properties for you
    </p>

    <div className="property-grid">

        <PropertyCard
            id={1}
            image="/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg"
            title="Luxury Apartment"
            location="Bhubaneswar"
            rent="18,000"
            bhk="2 BHK"
            rating="4.8"
           
        />

        <PropertyCard
            id={2}
            image="/houses/WhatsApp Image 2026-06-30 at 10.55.15 AM.jpeg"
            title="Modern Villa"
            location="Talcher"
            rent="25,000"
            bhk="3 BHK"
            rating="4.9"
            
        />

        <PropertyCard
            id={3}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.56 AM.jpeg"
            title="Studio Apartment"
            location="Cuttack"
            rent="12,000"
            bhk="1 BHK"
            rating="4.6"
           
        />

        <PropertyCard
            id={4}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.53 AM.jpeg"
            title="Family Home"
            location="Angul"
            rent="15,000"
            bhk="2 BHK"
            rating="4.7"
            
        />

        <PropertyCard
            id={5}
            image="/houses/WhatsApp Image 2026-06-30 at 10.54.50 AM.jpeg"
            title="Luxury Duplex"
            location="Puri"
            rent="32,000"
            bhk="4 BHK"
            rating="5.0"
            
        />

        <PropertyCard
            id={6}
            image="/houses/house 6.webp"
            title="Budget Flat"
            location="Sambalpur"
            rent="9,000"
            bhk="1 BHK"
            rating="4.4"
            
        />

    </div>

</section>

<section className="recent-section">

    <div className="section-header">

        <h2>🔥 Recently Added</h2>

        <button className="view-all-btn">
            View All →
        </button>

    </div>

    <p className="section-subtitle">
        Fresh rental properties added by verified owners.
    </p>

    <div className="property-grid">

        <PropertyCard
            image="\public\house 1.avif"
            title="Modern Apartment"
            location="Talcher"
            rent="14,000"
            bhk="2 BHK"
            rating="4.7"
            
        />

        <PropertyCard
            image="\public\house 2.avif"
            title="Family Villa"
            location="Bhubaneswar"
            rent="28,000"
            bhk="3 BHK"
            rating="4.9"
            
        />

        <PropertyCard
            image="\public\house 3.jpg"
            title="Budget Studio"
            location="Cuttack"
            rent="9,500"
            bhk="1 BHK"
            rating="4.5"
            
        />

    </div>

</section>

<section className="why-section">

    <h2>Why Choose SmartRent-AI?</h2>

    <p className="why-subtitle">
        Experience a smarter and safer way to find your perfect rental home.
    </p>

    <div className="why-grid">

        <div className="why-card">
            <div className="why-icon">🤖</div>
            <h3>AI Recommendations</h3>
            <p>Get personalized rental suggestions based on your preferences.</p>
        </div>

        <div className="why-card">
            <div className="why-icon">✔️</div>
            <h3>Verified Owners</h3>
            <p>Every property owner is verified for a secure rental experience.</p>
        </div>

        <div className="why-card">
            <div className="why-icon">📅</div>
            <h3>Easy Appointment</h3>
            <p>Schedule property visits instantly with just one click.</p>
        </div>

        <div className="why-card">
            <div className="why-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Your personal information is protected with secure authentication.</p>
        </div>

        <div className="why-card">
            <div className="why-icon">📍</div>
            <h3>Smart Location</h3>
            <p>Explore nearby schools, hospitals, markets and transport.</p>
        </div>

        <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Fast Search</h3>
            <p>Find your ideal rental quickly using powerful search filters.</p>
        </div>

    </div>

</section>

      </main>

      <Footer />

    </div>

  );

}

export default TenantDashboard;