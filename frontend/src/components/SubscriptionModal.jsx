import { useState } from "react";
import api from "../utils/api";
import "../styles/subscriptionModal.css";

function SubscriptionModal({ isOpen, onClose, onUpgraded }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      setError("");
      
      // MOCK FOR TESTING: Faking the API call and NOT updating localStorage 
      // so it resets to initial (free) upon page refresh.
      // const { data } = await api.post("/users/upgrade-subscription");
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      // user.subscriptionPlan = "pro";
      // localStorage.setItem("user", JSON.stringify(user));

      await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onUpgraded) onUpgraded();
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to upgrade subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-modal-overlay">
      <div className="subscription-modal-card">
        <button className="subscription-modal-close" onClick={onClose}>✕</button>

        {success ? (
          <div className="subscription-success-box">
            <div className="success-badge-icon">🎉</div>
            <h2>Welcome to SmartRentAI Pro!</h2>
            <p>Your account has been upgraded. You now have unlimited available dates for all your properties!</p>
          </div>
        ) : (
          <>
            <div className="pro-pill">⭐ PRO SUBSCRIPTION</div>
            <h2>Unlock Unlimited Visit Dates</h2>
            <p className="modal-lead">
              The free tier includes up to <strong>3 visit dates</strong> per property. Upgrade to <strong>SmartRentAI Pro</strong> to add unlimited dates and boost your listing visibility!
            </p>

            {error && <p className="pro-error-msg">{error}</p>}

            <div className="pro-features-list">
              <div className="pro-feature-item">
                <span className="pro-check">✓</span>
                <div>
                  <strong>Unlimited Visit Dates</strong>
                  <p>Offer flexible inspection dates to maximize tenant interest.</p>
                </div>
              </div>
              <div className="pro-feature-item">
                <span className="pro-check">✓</span>
                <div>
                  <strong>Featured Placement</strong>
                  <p>Get up to 3x more views in tenant search and recommendation feeds.</p>
                </div>
              </div>
              <div className="pro-feature-item">
                <span className="pro-check">✓</span>
                <div>
                  <strong>Priority Appointment Management</strong>
                  <p>Real-time scheduling, instant approvals, and automated reminders.</p>
                </div>
              </div>
            </div>

            <div className="pro-pricing-banner">
              <span className="pro-price">₹499 / month</span>
              <span className="pro-trial-badge">Free 30-Day Trial Included</span>
            </div>

            <div className="subscription-modal-actions">
              <button className="sub-cancel-btn" onClick={onClose}>
                Keep Free (Max 3 Dates)
              </button>
              <button
                className="sub-upgrade-btn"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? "Activating Pro..." : "Activate Pro Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SubscriptionModal;
